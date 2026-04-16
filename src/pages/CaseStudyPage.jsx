import { useParams, Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import ThemeToggle from '../components/ThemeToggle'
import Footer from '../components/Footer'
import caseStudies from '../data/caseStudies.jsx'
import './CaseStudyPage.css'

function CaseStudyPage() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const study = caseStudies[slug]

  useEffect(() => {
    const els = document.querySelectorAll('.cs-reveal, .cs-section')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  if (!study) {
    return (
      <>
        <ThemeToggle />
        <Navbar forceVisible />
        <main className="cs-not-found">
          <p>case study not found.</p>
          <Link to="/" className="cs-back">← back home</Link>
        </main>
      </>
    )
  }

  const Content = study.Content
  const otherStudies = Object.values(caseStudies).filter((s) => s.slug !== slug)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <>
      <ThemeToggle />
      <Navbar forceVisible />
      <main className="cs-page">

        {/* Hero */}
        <div className="cs-hero">
          <Link to="/#work" className="cs-back cs-reveal" style={{ '--reveal-delay': '0ms' }}>← back to work</Link>

          <p className="cs-company cs-reveal" style={{ '--reveal-delay': '80ms' }}>{study.company}</p>
          <h1 className="cs-title cs-reveal" style={{ '--reveal-delay': '160ms' }}>{study.title}</h1>
          <p className="cs-tagline cs-reveal" style={{ '--reveal-delay': '240ms', ...(!study.impactBlurb && !study.role && !study.methods ? { marginBottom: 0 } : {}) }}>{study.tagline}</p>
          {study.impactBlurb && (
            <div className="cs-impact-bar cs-reveal" style={{ '--reveal-delay': '320ms' }}>
              <span className="cs-impact-label">outcomes</span>
              <p className="cs-impact-blurb">{study.impactBlurb}</p>
              <a href="#solution" className="cs-skip-link">skip to solution ↓</a>
            </div>
          )}

          {(study.role || study.timeline || study.methods) && (
            <div className="cs-meta cs-reveal" style={{ '--reveal-delay': '400ms' }}>
              {study.role && (
                <div className="cs-meta-item">
                  <span className="cs-meta-label">role</span>
                  <span className="cs-meta-value">{study.role}</span>
                </div>
              )}
              {study.timeline && (
                <div className="cs-meta-item">
                  <span className="cs-meta-label">timeline</span>
                  <span className="cs-meta-value">{study.timeline}</span>
                </div>
              )}
              {study.methods && (
                <div className="cs-meta-item">
                  <span className="cs-meta-label">methods</span>
                  <span className="cs-meta-value">{study.methods}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hero image */}
        {study.heroImage && (
          <div className="cs-hero-image cs-reveal" style={{ '--reveal-delay': '480ms' }}>
            <img src={study.heroImage} alt={study.title} className="cs-hero-img" />
          </div>
        )}

        {/* Case study content — unique per project */}
        <Content />

        {/* Footer nav */}
        <div className="cs-footer-nav">
          <Link to="/#work" className="cs-back">← back to work</Link>
          <div className="cs-more-menu" ref={menuRef}>
            <button
              className="cs-more-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
            >
              <span className="cs-more-icon">
                <span /><span /><span />
              </span>
              see more case studies
            </button>
            {menuOpen && (
              <div className="cs-more-dropdown">
                {otherStudies.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/work/${s.slug}`}
                    className="cs-more-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="cs-more-item-company">{s.company}</span>
                    <span className="cs-more-item-title">{s.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}

export default CaseStudyPage
