import { useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function GridNavbar({ forceVisible }) {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollAndSelect = useCallback((e, selector) => {
    e.preventDefault()

    const doScrollAndSelect = () => {
      const target = document.querySelector(selector)
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const frame = target.querySelector('.draggable-frame') || target.closest('.draggable-frame')
      if (frame) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('frame-global-select', {
            detail: { source: frame, shift: false },
          }))
          frame.dispatchEvent(new CustomEvent('frame-request-select'))
        }, 400)
      }
    }

    if (location.pathname !== '/') {
      navigate('/')
      // Wait for home page to render, then scroll and select
      setTimeout(doScrollAndSelect, 600)
    } else {
      doScrollAndSelect()
    }
  }, [navigate, location.pathname])

  return (
    <nav className="grid-navbar">
      <div className="grid-navbar-left">
        <Link to="/" className="grid-navbar-logo">Chris Lo</Link>
        <span className="grid-navbar-divider" />
        <span className="grid-navbar-role">Product Designer</span>
      </div>
      <div className="grid-navbar-right">
        <Link to="/about" className="grid-navbar-link">About</Link>
        <a href="#work" className="grid-navbar-link" onClick={(e) => scrollAndSelect(e, '#work')}>Work</a>
        <a href="#contact" className="grid-navbar-link" onClick={(e) => scrollAndSelect(e, '#contact')}>Contact</a>
      </div>
    </nav>
  )
}

export default GridNavbar
