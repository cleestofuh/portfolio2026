import { useCallback } from 'react'
import DraggableFrame from './DraggableFrame'

function GridHero() {
  const scrollAndSelect = useCallback((e, selector) => {
    e.preventDefault()
    const target = document.querySelector(selector)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const frame = target.querySelector('.draggable-frame') || target.closest('.draggable-frame')
    if (frame) {
      setTimeout(() => {
        // Deselect all other frames then select the target
        window.dispatchEvent(new CustomEvent('frame-global-select', {
          detail: { source: frame, shift: false },
        }))
        // Tell the frame to select itself
        frame.dispatchEvent(new CustomEvent('frame-request-select'))
      }, 400)
    }
  }, [])

  return (
    <section className="grid-hero">
      <DraggableFrame className="grid-hero-canvas" frameLabel="Hero / 1440 &times; 900">
        <div className="grid-hero-content">
          <DraggableFrame className="grid-hero-name-wrap" frameLabel="Name" initialSelected>
            <h1 className="grid-hero-name">Chris Lo</h1>
            <span className="grid-dimension grid-dimension--name">420 &times; 240</span>
          </DraggableFrame>

          <DraggableFrame className="grid-hero-meta" frameLabel="Subtitle">
            <p className="grid-hero-subtitle">
              Currently vibin' and designin' @ <a href="https://www.linkedin.com/in/cleestofuh/" target="_blank" rel="noopener noreferrer" className="grid-link">LinkedIn</a>
            </p>
          </DraggableFrame>

          <DraggableFrame className="grid-hero-about" frameLabel="Blurb">
            <p className="grid-hero-about-text">
              I'm a product designer who cares about people, thinks in systems, sweats the details, and believes even complex workflows deserve a bit of delight.
            </p>
            <p className="grid-hero-about-text grid-hero-about-text--secondary">
              Leading enterprise AI and employee experience design at LinkedIn.
            </p>
          </DraggableFrame>
        </div>

        <DraggableFrame className="grid-hero-toolbar-wrap" frameLabel="Navigation">
          <div className="grid-toolbar-btns">
            <a href="/about" className="grid-toolbar-btn">About</a>
            <a href="#work" className="grid-toolbar-btn" onClick={(e) => scrollAndSelect(e, '#work')}>Work</a>
            <a href="#contact" className="grid-toolbar-btn" onClick={(e) => scrollAndSelect(e, '#contact')}>Contact</a>
          </div>
        </DraggableFrame>
      </DraggableFrame>
    </section>
  )
}

export default GridHero
