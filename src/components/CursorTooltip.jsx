import { useEffect, useRef } from 'react'
import './CursorTooltip.css'

// One global label that follows the cursor. Any element can opt in by setting
// a `data-cursor-tip="..."` attribute; hovering it shows that text by the
// pointer. DOM is updated directly (no React state) so it tracks smoothly.
function CursorTooltip() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let shown = false
    let curText = ''

    const hide = () => {
      if (shown) {
        shown = false
        el.classList.remove('cursor-tip--on')
      }
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return // hover only
      const tipEl = e.target.closest?.('[data-cursor-tip]')
      const tip = tipEl ? tipEl.getAttribute('data-cursor-tip') : ''
      if (tip) {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        if (tip !== curText) {
          curText = tip
          el.textContent = tip
        }
        if (!shown) {
          shown = true
          el.classList.add('cursor-tip--on')
        }
      } else {
        hide()
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', hide, { passive: true })
    document.addEventListener('mouseleave', hide)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', hide)
      document.removeEventListener('mouseleave', hide)
    }
  }, [])

  return <div ref={ref} className="cursor-tip" aria-hidden="true" />
}

export default CursorTooltip
