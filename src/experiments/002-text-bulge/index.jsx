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
      const R = 140, PUSH = 48
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
      'Sweep your cursor through the sentence. The letters scatter like grains ' +
      'of sand, piling up in your wake and slowly drifting back.',
    touchText:
      'Drag your finger through the sentence. The letters scatter like grains ' +
      'of sand, piling up in your wake and slowly drifting back.',
    apply(c, env) {
      const R = 95
      c.ox *= 0.93                          // slow settle back
      c.oy *= 0.93
      if (env.active && env.speed > 40) {
        const dx = c.cx - env.mx, dy = c.cy - env.my
        const dist = Math.hypot(dx, dy)
        if (dist < R) {
          const f = 1 - dist / R
          const nvx = env.vx / env.speed, nvy = env.vy / env.speed
          const shove = Math.min(env.speed * 0.012, 16) * f
          c.ox += nvx * shove
          c.oy += nvy * shove
        }
      }
      const mag = Math.hypot(c.ox, c.oy)
      const rot = mag * 0.4 * (c.seed - 0.5) // grainy tumble
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
  {
    id: 'refraction',
    label: '3D',
    text:
      'Glide your cursor over the text. It bows and splits into colour, as if ' +
      'you are reading through a pane of warped glass.',
    touchText:
      'Drag your finger over the text. It bows and splits into colour, as if ' +
      'you are reading through a pane of warped glass.',
    apply(c, env) {
      const R = 160
      let inside = false
      if (env.active) {
        const dx = c.cx - env.mx, dy = c.cy - env.my
        const dist = Math.hypot(dx, dy)
        if (dist < R) {
          inside = true
          const f = dist / R                 // 0 center -> 1 edge
          const dir = 1 / (dist || 1)
          const ab = f * 7                    // chromatic offset grows outward
          const ox = dx * dir * ab, oy = dy * dir * ab
          const scale = 1 + (1 - f) * 0.45    // lens magnifies the center
          c.el.style.transform = `scale(${scale.toFixed(3)})`
          c.el.style.textShadow =
            `${ox.toFixed(1)}px ${oy.toFixed(1)}px 0 rgba(255,42,92,0.55), ` +
            `${(-ox).toFixed(1)}px ${(-oy).toFixed(1)}px 0 rgba(54,200,255,0.55)`
        }
      }
      if (!inside) {
        c.el.style.transform = ''
        c.el.style.textShadow = 'none'
      }
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
      const S = 19
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

      if (ctx) {
        if (activeIdRef.current === 'sand') {
          if (!trailDrawn) sizeTrail()   // refresh size/position on entering sand
          ctx.clearRect(0, 0, trailW, trailH)

          // Background grains scatter with the same physics as the letters.
          const cmx = m.x - trailLeft, cmy = m.y - trailTop
          const kick = m.active && env.speed > 40
          const nvx = kick ? env.vx / env.speed : 0
          const nvy = kick ? env.vy / env.speed : 0
          ctx.fillStyle = 'rgba(90, 62, 30, 0.5)'
          for (let i = 0; i < sandDots.length; i++) {
            const d = sandDots[i]
            d.ox *= 0.93
            d.oy *= 0.93
            if (kick) {
              const dx = d.rx - cmx, dy = d.ry - cmy
              const dist = Math.hypot(dx, dy)
              if (dist < 95) {
                const shove = Math.min(env.speed * 0.012, 16) * (1 - dist / 95)
                d.ox += nvx * shove
                d.oy += nvy * shove
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

          // Draw a smooth line that tapers from thick (head) to a fine point.
          if (trailPts.length > 1) {
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            for (let i = 1; i < trailPts.length; i++) {
              const a = trailPts[i - 1], b = trailPts[i]
              const f = i / (trailPts.length - 1)   // 0 at tail, 1 at the cursor
              ctx.strokeStyle = `rgba(38, 24, 10, ${(0.05 + f * 0.28).toFixed(3)})`
              ctx.lineWidth = 2 + f * 14
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
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
