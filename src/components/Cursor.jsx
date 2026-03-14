import { useEffect, useRef } from 'react'
import './Cursor.css'

const TEXT_SELECTORS = 'p, h1, h2, h3, h4, h5, h6, li, span, .about-text-serif, .about-text-sans, .work-card-title, .work-card-desc'

function lerpAngle(a, b, t) {
  let diff = b - a
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  return a + diff * t
}

function Cursor() {
  const cursorRef = useRef(null)
  const state = useRef({ x: -100, y: -100, angle: 0, targetAngle: 0 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const cursor = cursorRef.current
    if (!cursor) return

    const onMove = (e) => {
      state.current.x = e.clientX
      state.current.y = e.clientY

      const els = document.elementsFromPoint(e.clientX, e.clientY)
      const textEl = els.find(el => el.matches?.(TEXT_SELECTORS) && el.textContent.trim().length > 2)

      if (textEl) {
        const rect = textEl.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = cx - e.clientX
        const dy = cy - e.clientY
        state.current.targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
      } else {
        state.current.targetAngle = 0
      }
    }

    let raf
    const animate = () => {
      const s = state.current
      s.angle = lerpAngle(s.angle, s.targetAngle, 0.1)
      cursor.style.left = `${s.x}px`
      cursor.style.top = `${s.y}px`
      cursor.style.transform = `rotate(${s.angle}deg)`
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={cursorRef} className="custom-cursor">
      <svg width="18" height="26" viewBox="0 0 18 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1 L16 13 L11.5 11.5 L11.5 25 L6.5 25 L6.5 11.5 L2 13 Z" fill="#1a1a1a" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

export default Cursor
