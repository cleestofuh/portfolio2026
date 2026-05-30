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
    label: 'Gravity well',
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
      let lit = 0
      if (env.active) {
        const dist = Math.hypot(c.cx - env.mx, c.cy - env.my)
        if (dist < R) lit = 1 - dist / R
      }
      const e = lit * lit                  // sharper edge
      const r = Math.round(74 + (245 - 74) * e)
      const g = Math.round(72 + (239 - 72) * e)
      const b = Math.round(66 + (226 - 66) * e)
      c.el.style.color = `rgb(${r},${g},${b})`
      c.el.style.textShadow = e > 0.02
        ? `0 0 ${(e * 22).toFixed(1)}px rgba(255,238,200,${(e * 0.85).toFixed(2)})`
        : 'none'
    },
  },
  {
    id: 'refraction',
    label: 'Refraction',
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
    }
    measureRef.current = measure

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

      const env = {
        mx: m.x, my: m.y, active: m.active,
        vx, vy, speed: Math.hypot(vx, vy), dt,
      }

      const eff = EFFECTS.find((e) => e.id === activeIdRef.current)
      const chars = charsRef.current
      for (let i = 0; i < chars.length; i++) eff.apply(chars[i], env)

      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', measure)
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
