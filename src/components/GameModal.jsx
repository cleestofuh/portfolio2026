import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './GameModal.css'

// Opens the live Shikaku Days site inside a phone-shaped frame. The phone
// grows out of the card that opened it and shrinks back into it on close
// (FLIP: it's positioned/centered normally, then transformed to match the
// card's rect, then transitioned to identity).
function GameModal({ origin, onClose }) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [flip, setFlip] = useState(null)
  const phoneRef = useRef(null)
  const closeTimer = useRef(null)

  const handleClose = () => {
    setClosing((c) => {
      if (c) return c
      closeTimer.current = setTimeout(onClose, 430) // match transition
      return true
    })
  }

  // Measure the phone's resting rect and derive the collapsed transform that
  // maps it onto the originating card — done before paint to avoid a flash.
  useLayoutEffect(() => {
    const phone = phoneRef.current
    if (!phone || !origin) return
    const pr = phone.getBoundingClientRect()
    setFlip({
      s: origin.width / pr.width,
      tx: origin.left + origin.width / 2 - (pr.left + pr.width / 2),
      ty: origin.top + origin.height / 2 - (pr.top + pr.height / 2),
    })
  }, [origin])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // double rAF so the collapsed state paints before transitioning to open
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setOpen(true))
    })
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      cancelAnimationFrame(raf)
      clearTimeout(closeTimer.current)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const collapsed = !open || closing
  const phoneStyle = flip
    ? (collapsed
        ? { transform: `translate(${flip.tx}px, ${flip.ty}px) scale(${flip.s})`, opacity: 0 }
        : { transform: 'translate(0px, 0px) scale(1)', opacity: 1 })
    : { opacity: 0 }

  return createPortal(
    <div
      className={`game-modal-overlay${open && !closing ? ' is-open' : ''}`}
      onClick={handleClose}
    >
      <div ref={phoneRef} className="game-phone" style={phoneStyle} onClick={(e) => e.stopPropagation()}>
        <iframe
          src="https://shikakudays.com/"
          title="Shikaku Days"
          className="game-phone-screen"
          allow="fullscreen"
        />
      </div>
      <button className="game-modal-close" onClick={handleClose} aria-label="Close game">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>,
    document.body
  )
}

export default GameModal
