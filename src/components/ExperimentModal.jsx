import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './ExperimentModal.css'
import TextBulge from '../experiments/002-text-bulge'

const CONTENT = {
  text: TextBulge,
}

// Full-page modal that visually grows out of the card that opened it.
// `origin` is the card's viewport rect, captured at click time; a dark
// panel starts scaled/positioned to match it, then expands to fill the
// screen while the experiment content fades in on top.
function ExperimentModal({ exp, onClose }) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const rafRef = useRef(null)
  const timerRef = useRef(null)

  const Experiment = CONTENT[exp.id]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Double rAF so the collapsed (card-sized) state paints before we
    // transition to the expanded state — otherwise the grow is skipped.
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => setOpen(true))
    })

    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timerRef.current)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = () => {
    setClosing((already) => {
      if (already) return already
      timerRef.current = setTimeout(onClose, 460) // match grow transition
      return true
    })
  }

  const collapsed = !open || closing
  const { top, left, width, height } = exp.origin
  const vw = window.innerWidth
  const vh = window.innerHeight
  const bgStyle = collapsed
    ? {
        transform: `translate(${left}px, ${top}px) scale(${(width / vw).toFixed(4)}, ${(height / vh).toFixed(4)})`,
        borderRadius: '10px',
      }
    : { transform: 'translate(0px, 0px) scale(1, 1)', borderRadius: '0px' }

  // Portal to <body> so the modal escapes the .experiments stacking
  // context (z-index:1) and sits above the fixed navbar.
  return createPortal(
    <div className="exp-modal-root" role="dialog" aria-modal="true" aria-label={exp.title}>
      <div className="exp-modal-bg" style={bgStyle} />

      <div className={`exp-modal-content${open && !closing ? ' is-visible' : ''}`}>
        {Experiment && <Experiment />}
      </div>

      <button className="exp-modal-close" onClick={handleClose} aria-label="Close experiment">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>,
    document.body
  )
}

export default ExperimentModal
