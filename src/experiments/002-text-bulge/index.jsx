import { useEffect, useRef, useState } from 'react'
import './experiment.css'

/* ------------------------------------------------------------------ *
 * Effects. Each entry has its own instructional copy + an
 * `apply(char, env)` that runs once per character per frame.
 *   char = { el, cx, cy, ox, oy, vx, vy, seed }  (ox/oy/vx/vy = physics state)
 *   env  = { mx, my, vx, vy, speed, active, dt }
 * ------------------------------------------------------------------ */

function spring(c, tx, ty, stiffness, damping, dt) {
  c.vx += ((tx - c.ox) * stiffness - c.vx * damping) * dt
  c.vy += ((ty - c.oy) * stiffness - c.vy * damping) * dt
  c.ox += c.vx * dt
  c.oy += c.vy * dt
}

const EFFECTS = [
  {
    id: 'magnetic',
    label: 'Magnetic',
    text:
      'Move your cursor across the words. Like the wrong ends of two magnets, the ' +
      'letters shove away from your cursor, then snap back the instant you pass by.',
    touchText:
      'Drag your finger across the words. Like the wrong ends of two magnets, the ' +
      'letters shove away from your touch, then snap back the instant you pass by.',
    apply(c, env) {
      const R = 150, PUSH = 60
      let tx = 0, ty = 0
      if (env.active) {
        const dx = c.cx - env.mx, dy = c.cy - env.my
        const dist = Math.hypot(dx, dy)
        if (dist < R) {
          const f = 1 - dist / R
          const dir = 1 / (dist || 1)
          tx = dx * dir * f * PUSH
          ty = dy * dir * f * PUSH
        }
      }
      spring(c, tx, ty, 320, 24, env.dt)   // crisp, near-critically damped
      c.el.style.transform = `translate(${c.ox.toFixed(2)}px, ${c.oy.toFixed(2)}px)`
    },
  },
  {
    id: 'jelly',
    label: 'Jelly',
    text:
      'Drag your cursor across the words. They squish and wobble like jelly, ' +
      'jiggling for a beat before they settle.',
    touchText:
      'Drag your finger across the words. They squish and wobble like jelly, ' +
      'jiggling for a beat before they settle.',
    apply(c, env) {
      const R = 88, PUSH = 48
      let tx = 0, ty = 0
      if (env.active) {
        const dx = c.cx - env.mx, dy = c.cy - env.my
        const dist = Math.hypot(dx, dy)
        if (dist < R) {
          const f = 1 - dist / R
          const dir = 1 / (dist || 1)
          const amp = PUSH * f * (1 + Math.min(env.speed * 0.0006, 1.2))
          tx = dx * dir * amp
          ty = dy * dir * amp
        }
      }
      spring(c, tx, ty, 260, 9, env.dt)    // underdamped => wobble
      const v = Math.min(Math.hypot(c.vx, c.vy) * 0.0009, 0.5)
      c.el.style.transform =
        `translate(${c.ox.toFixed(2)}px, ${c.oy.toFixed(2)}px) scale(${(1 + v).toFixed(3)})`
    },
  },
  {
    id: 'sand',
    label: 'Sand',
    text:
      'Drag your cursor through the sentence. The letters and grains push ' +
      'aside like sand and stay where you shove them.',
    touchText:
      'Drag your finger through the sentence. The letters and grains push ' +
      'aside like sand and stay where you shove them.',
    apply(c, env) {
      const R = 36   // a touch wider than the streak so it parts letters as it passes
      // No settle-back: the cursor ploughs a channel and the letters stay put,
      // shoved radially outward from wherever they currently sit.
      if (env.active) {
        const cx = c.cx + c.ox, cy = c.cy + c.oy
        const dx = cx - env.mx, dy = cy - env.my
        const dist = Math.hypot(dx, dy)
        if (dist < R) {
          const push = (R - dist) * 0.25
          const inv = 1 / (dist || 1)
          c.ox += dx * inv * push
          c.oy += dy * inv * push
        }
      }
      const mag = Math.hypot(c.ox, c.oy)
      const rot = Math.max(-22, Math.min(22, mag * 0.2 * (c.seed - 0.5)))
      c.el.style.transform =
        `translate(${c.ox.toFixed(2)}px, ${c.oy.toFixed(2)}px) rotate(${rot.toFixed(2)}deg)`
    },
  },
  {
    id: 'gravity',
    label: 'Gravity',
    text:
      'Move your cursor near the words. Each one bends toward it, sinking ' +
      'inward like matter pulled into a gravity well.',
    touchText:
      'Drag your finger near the words. Each one bends toward it, sinking ' +
      'inward like matter pulled into a gravity well.',
    apply(c, env) {
      const R = 240, PULL = 70
      let tx = 0, ty = 0
      if (env.active) {
        const dx = c.cx - env.mx, dy = c.cy - env.my
        const dist = Math.hypot(dx, dy)
        if (dist < R) {
          const f = 1 / (1 + (dist / (R * 0.42)) ** 2)   // soft, wide well
          const dir = 1 / (dist || 1)
          tx = -dx * dir * f * PULL                       // toward cursor
          ty = -dy * dir * f * PULL
        }
      }
      spring(c, tx, ty, 150, 18, env.dt)   // slow, heavy
      c.el.style.transform = `translate(${c.ox.toFixed(2)}px, ${c.oy.toFixed(2)}px)`
    },
  },
  {
    id: 'spotlight',
    label: 'Spotlight',
    text:
      'Move your cursor across the dark. Only the words beneath your light ' +
      'wake up. The rest stay in shadow.',
    touchText:
      'Drag your finger across the dark. Only the words beneath your light ' +
      'wake up. The rest stay in shadow.',
    apply(c, env) {
      const R = 170
      const HALF = 9 * Math.PI / 180        // beam cone half-angle (matches CSS wedge)
      let lit = 0
      if (env.active) {
        // The bright pool right at the cursor.
        const dist = Math.hypot(c.cx - env.mx, c.cy - env.my)
        if (dist < R) lit = 1 - dist / R

        // Anything the beam itself sweeps over: inside the cone from the
        // Spotlight tab to the cursor, and not past the cursor.
        const cdx = env.mx - env.bx, cdy = env.my - env.by   // tab -> cursor
        const beamLen = Math.hypot(cdx, cdy)
        const pdx = c.cx - env.bx, pdy = c.cy - env.by        // tab -> letter
        const charDist = Math.hypot(pdx, pdy)
        if (beamLen > 1 && charDist > 1 && charDist <= beamLen + R * 0.5) {
          const cos = (cdx * pdx + cdy * pdy) / (beamLen * charDist)
          const ang = Math.acos(Math.min(1, Math.max(-1, cos)))
          if (ang < HALF) {
            const edge = 1 - ang / HALF             // brighter toward the beam's spine
            // Full along the shaft, easing off just past the cursor tip.
            const tail = charDist <= beamLen ? 1 : 1 - (charDist - beamLen) / (R * 0.5)
            lit = Math.max(lit, edge * tail)
          }
        }
      }
      const e = lit * lit                  // sharper edge
      const r = Math.round(74 + (255 - 74) * e)
      const g = Math.round(72 + (255 - 72) * e)
      const b = Math.round(66 + (255 - 66) * e)
      c.el.style.color = `rgb(${r},${g},${b})`
      c.el.style.textShadow = e > 0.02
        ? `0 0 ${(e * 22).toFixed(1)}px rgba(255,238,200,${(e * 0.85).toFixed(2)})`
        : 'none'
    },
  },
]

function buildSpans(para, text) {
  para.innerHTML = ''
  const words = text.split(' ')
  words.forEach((word, wi) => {
    const wordEl = document.createElement('span')
    wordEl.className = 'tb-word'
    for (const ch of word) {
      const span = document.createElement('span')
      span.className = 'tb-char'
      span.textContent = ch
      wordEl.appendChild(span)
    }
    para.appendChild(wordEl)
    if (wi < words.length - 1) para.appendChild(document.createTextNode(' '))
  })
}

export default function TextBulge() {
  const shellRef = useRef(null)
  const paraRef = useRef(null)
  const charsRef = useRef([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const rafRef = useRef(null)
  const measureRef = useRef(() => {})
  const trailRef = useRef(null)                   // sand snake-trail canvas
  const jellyRef = useRef(null)                   // jelly liquid-glass pill cursor
  const beamOriginRef = useRef({ x: 0, y: 40 })   // Spotlight tab anchor
  const activeIdRef = useRef(EFFECTS[0].id)
  const transitioningRef = useRef(false)
  const timersRef = useRef([])
  const [activeId, setActiveId] = useState(EFFECTS[0].id)
  const [pendingId, setPendingId] = useState(null)   // highlighted target mid-wipe
  const [wipe, setWipe] = useState(null)             // { id, dir }

  // Clear any pending transition timers on unmount.
  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  // Mount once: measurement helper, the rAF loop, and window listeners.
  useEffect(() => {
    const para = paraRef.current

    const measure = () => {
      const els = para.querySelectorAll('.tb-char')
      charsRef.current = Array.from(els).map((el) => {
        const prev = el.style.transform
        el.style.transform = 'none'
        const r = el.getBoundingClientRect()
        el.style.transform = prev
        return {
          el,
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
          ox: 0, oy: 0, vx: 0, vy: 0,
          seed: Math.random(),
        }
      })
      // Anchor the spotlight beam to the actual Spotlight tab.
      const tab = document.querySelector('.tb-controls [data-effect-id="spotlight"]')
      if (tab) {
        const tr = tab.getBoundingClientRect()
        beamOriginRef.current = { x: tr.left + tr.width / 2, y: tr.bottom }
      }
    }
    measureRef.current = measure

    // Sand "snake trail": a darker-brown groove drawn on a canvas that
    // fades back into the sand over a couple of seconds.
    const canvas = trailRef.current
    const ctx = canvas?.getContext('2d')
    let trailW = 0, trailH = 0
    let trailLeft = 0, trailTop = 0   // canvas position, to map cursor into canvas space
    const trailPts = []               // recent cursor points: { x, y, t }
    const TRAIL_LIFE = 600            // ms before a point fades out
    const sandDots = []               // background grains that scatter like the letters
    let trailDrawn = false
    const jelly = { ox: 0, oy: 0, vx: 0, vy: 0 }   // springy pill position
    let jellyOn = false
    let jellyAng = 0
    const sizeTrail = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      trailW = rect.width
      trailH = rect.height
      trailLeft = rect.left
      trailTop = rect.top
      canvas.width = Math.round(trailW * dpr)
      canvas.height = Math.round(trailH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Lay out a jittered grid of grains across the canvas.
      sandDots.length = 0
      const S = 12
      for (let gy = S / 2; gy < trailH; gy += S) {
        for (let gx = S / 2; gx < trailW; gx += S) {
          sandDots.push({
            rx: gx + (Math.random() - 0.5) * S * 0.7,
            ry: gy + (Math.random() - 0.5) * S * 0.7,
            ox: 0, oy: 0,
          })
        }
      }
    }
    sizeTrail()

    let prevX = mouseRef.current.x
    let prevY = mouseRef.current.y
    let prevT = performance.now()

    const frame = (t) => {
      const dt = Math.min(Math.max((t - prevT) / 1000, 0.001), 0.05)
      prevT = t
      const m = mouseRef.current
      const vx = (m.x - prevX) / dt
      const vy = (m.y - prevY) / dt
      prevX = m.x
      prevY = m.y

      const bo = beamOriginRef.current
      const env = {
        mx: m.x, my: m.y, active: m.active,
        vx, vy, speed: Math.hypot(vx, vy), dt,
        bx: bo.x, by: bo.y,   // spotlight beam origin (the Spotlight tab)
      }

      const eff = EFFECTS.find((e) => e.id === activeIdRef.current)
      const chars = charsRef.current
      for (let i = 0; i < chars.length; i++) eff.apply(chars[i], env)

      // Jelly cursor: a glass pill that springs after the cursor and
      // squashes/stretches along its direction of travel.
      if (jellyRef.current) {
        if (activeIdRef.current === 'jelly') {
          if (!jellyOn) {                       // snap to cursor when entering
            jelly.ox = m.x; jelly.oy = m.y
            jelly.vx = 0; jelly.vy = 0
            jellyOn = true
          }
          spring(jelly, m.x, m.y, 240, 13, dt)  // underdamped => bouncy
          const sp = Math.hypot(jelly.vx, jelly.vy)
          const stretch = Math.min(sp * 0.0004, 0.42)
          if (sp > 220) jellyAng = Math.atan2(jelly.vy, jelly.vx) * 180 / Math.PI
          else jellyAng *= 0.88   // relax back to horizontal when idle
          jellyRef.current.style.transform =
            `translate(${jelly.ox.toFixed(2)}px, ${jelly.oy.toFixed(2)}px) ` +
            `rotate(${jellyAng.toFixed(1)}deg) ` +
            `scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch * 0.55).toFixed(3)})`
        } else {
          jellyOn = false
        }
      }

      if (ctx) {
        if (activeIdRef.current === 'sand') {
          if (!trailDrawn) sizeTrail()   // refresh size/position on entering sand
          ctx.clearRect(0, 0, trailW, trailH)

          // Background grains push aside with the same physics as the letters:
          // radial shove from their current spot, no settle-back.
          const cmx = m.x - trailLeft, cmy = m.y - trailTop
          const R = 36   // a touch wider than the streak so it parts grains as it passes
          ctx.fillStyle = 'rgba(90, 62, 30, 0.5)'
          for (let i = 0; i < sandDots.length; i++) {
            const d = sandDots[i]
            if (m.active) {
              const dx = d.rx + d.ox - cmx, dy = d.ry + d.oy - cmy
              const dist = Math.hypot(dx, dy)
              if (dist < R) {
                const push = (R - dist) * 0.25
                const inv = 1 / (dist || 1)
                d.ox += dx * inv * push
                d.oy += dy * inv * push
              }
            }
            ctx.fillRect(d.rx + d.ox - 1, d.ry + d.oy - 1, 2, 2)
          }

          // Record the cursor path, then drop points older than TRAIL_LIFE so
          // the tail retracts and vanishes once you stop moving.
          if (m.active) {
            const px = m.x - trailLeft, py = m.y - trailTop
            const last = trailPts[trailPts.length - 1]
            if (!last || Math.hypot(px - last.x, py - last.y) > 1.5) {
              trailPts.push({ x: px, y: py, t })
            }
          }
          while (trailPts.length && t - trailPts[0].t > TRAIL_LIFE) trailPts.shift()

          // Draw the streak as ONE filled ribbon: offset each point along the
          // path normal by its half-width and fill a single polygon. Drawing
          // per-segment with round caps is what made it look like beads.
          const n = trailPts.length
          if (n > 2) {
            const halfW = (i) => {
              const taper = Math.sin(Math.PI * (i / (n - 1)))   // 0 at ends, 1 mid
              return (1 + taper * 18) / 2
            }
            const normal = (i) => {
              const prev = trailPts[Math.max(0, i - 1)]
              const next = trailPts[Math.min(n - 1, i + 1)]
              let dx = next.x - prev.x, dy = next.y - prev.y
              const len = Math.hypot(dx, dy) || 1
              return { nx: -dy / len, ny: dx / len }
            }
            ctx.shadowColor = 'rgba(58, 38, 16, 0.5)'
            ctx.shadowBlur = 6
            ctx.fillStyle = 'rgba(46, 30, 12, 0.22)'
            ctx.beginPath()
            for (let i = 0; i < n; i++) {           // one edge, head -> tail
              const p = trailPts[i], { nx, ny } = normal(i), w = halfW(i)
              const x = p.x + nx * w, y = p.y + ny * w
              if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
            }
            for (let i = n - 1; i >= 0; i--) {      // other edge, tail -> head
              const p = trailPts[i], { nx, ny } = normal(i), w = halfW(i)
              ctx.lineTo(p.x - nx * w, p.y - ny * w)
            }
            ctx.closePath()
            ctx.fill()
            ctx.shadowBlur = 0
          }
          trailDrawn = true
        } else if (trailDrawn) {
          ctx.clearRect(0, 0, trailW, trailH)
          trailPts.length = 0
          trailDrawn = false
        }
      }

      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    window.addEventListener('resize', measure)
    window.addEventListener('resize', sizeTrail)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', measure)
      window.removeEventListener('resize', sizeTrail)
      window.removeEventListener('scroll', measure)
    }
  }, [])

  // Per-effect: swap the copy, rebuild the spans, re-measure (resets state).
  useEffect(() => {
    const eff = EFFECTS.find((e) => e.id === activeId)
    // Touch devices have no hovering cursor — use finger-drag phrasing.
    const touch = window.matchMedia?.('(hover: none) and (pointer: coarse)').matches
    buildSpans(paraRef.current, (touch && eff.touchText) || eff.text)
    measureRef.current()
  }, [activeId])

  const handleMove = (e) => {
    // On touch the fingertip sits on top of the effect, so lift the
    // sample point above the contact so the spotlight/lens stays visible.
    const offsetY = e.pointerType === 'touch' ? -56 : 0
    const x = e.clientX
    const y = e.clientY + offsetY
    mouseRef.current = { x, y, active: true }
    const s = shellRef.current
    if (s) {
      s.style.setProperty('--mx', `${x}px`)
      s.style.setProperty('--my', `${y}px`)
      // Spotlight beam: shaft from the Spotlight tab to the cursor. Angle is
      // in conic-gradient convention (0deg up, clockwise); length caps the
      // beam so the light stops at the cursor instead of running to the edge.
      const o = beamOriginRef.current
      const dx = x - o.x, dy = y - o.y
      s.style.setProperty('--beam-angle', `${Math.atan2(dx, -dy) * 180 / Math.PI}deg`)
      s.style.setProperty('--beam-len', `${Math.hypot(dx, dy)}px`)
      s.style.setProperty('--beam-ox', `${o.x}px`)
      s.style.setProperty('--beam-oy', `${o.y}px`)
    }
  }
  const handleLeave = () => {
    mouseRef.current = { ...mouseRef.current, active: false }
  }
  // Touch has no "hover": releasing the finger should end the effect.
  // Mouse stays active while it moves over the shell, so only act on touch.
  const handleUp = (e) => {
    if (e.pointerType === 'touch') handleLeave()
  }

  const WIPE_MS = 640

  const selectEffect = (id) => {
    if (id === activeId || transitioningRef.current) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      activeIdRef.current = id
      setActiveId(id)
      return
    }

    const oldIndex = EFFECTS.findIndex((e) => e.id === activeId)
    const newIndex = EFFECTS.findIndex((e) => e.id === id)
    // Target sits to the right in the tabs → panel enters from the right.
    const dir = newIndex > oldIndex ? 'right' : 'left'

    transitioningRef.current = true
    setPendingId(id)
    setWipe({ id, dir })

    // Swap the underlying effect while the panel fully covers the screen.
    timersRef.current.push(setTimeout(() => {
      activeIdRef.current = id
      setActiveId(id)
    }, WIPE_MS / 2))

    // Tear down once the panel has slid off the far side.
    timersRef.current.push(setTimeout(() => {
      setWipe(null)
      setPendingId(null)
      transitioningRef.current = false
    }, WIPE_MS + 30))
  }

  const shownActive = pendingId ?? activeId

  return (
    <>
      {/* Kept outside .tb-shell so the canvas's touch-action: none doesn't
          block horizontal swipe-scrolling of the tabs on small screens. */}
      <nav className="tb-controls">
        {EFFECTS.map((e) => (
          <button
            key={e.id}
            data-effect-id={e.id}
            className={`tb-btn${e.id === shownActive ? ' is-active' : ''}`}
            onClick={() => selectEffect(e.id)}
          >
            {e.label}
          </button>
        ))}
      </nav>

      <div
        className="tb-shell"
        ref={shellRef}
        data-effect={activeId}
        onPointerDown={handleMove}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        <canvas ref={trailRef} className="tb-trail" />
        <div ref={jellyRef} className="tb-jelly-cursor" />

        <p ref={paraRef} className="tb-paragraph" />

        {wipe && (
          <div
            key={`${wipe.id}-${wipe.dir}`}
            className={`tb-wipe from-${wipe.dir}`}
            data-effect={wipe.id}
          />
        )}
      </div>
    </>
  )
}
