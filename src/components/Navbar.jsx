import { useState, useEffect, useRef, useCallback } from 'react'
import resumePdf from '../assets/Christopher Lo Resume.pdf'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar({ forceVisible = false }) {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef = useRef(null);
  const jumpingRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      setVisible(window.scrollY > vh * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (jumpingRef.current) return;
    const img = logoRef.current;
    if (!img) return;

    jumpingRef.current = true;
    img.classList.remove('navbar-logo-jump');
    void img.offsetWidth;
    img.classList.add('navbar-logo-jump');

    setTimeout(() => {
      img.classList.remove('navbar-logo-jump');
      jumpingRef.current = false;
      if (isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
    }, 450);
  }, [isHome, navigate]);

  const handleHashLink = useCallback((e, hash) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/' + hash);
    }
  }, [isHome, navigate]);

  return (
    <header className={`navbar ${visible || forceVisible ? 'navbar--visible' : ''}`}>
      <a href="/" className="navbar-logo" onClick={handleLogoClick}>
        <img ref={logoRef} src="/freg.svg" alt="chris Lo" className="navbar-logo-img" />
        <span className="navbar-logo-name">chris Lo</span>
      </a>

      {/* Desktop nav */}
      <nav className="navbar-links">
        <a href="/" className="navbar-link" onClick={handleLogoClick}>home</a>
        <a href="/about" className="navbar-link">about</a>
        <a href="/#work" className="navbar-link" onClick={(e) => handleHashLink(e, '#work')}>work</a>
        <a href="/#contact" className="navbar-link" onClick={(e) => handleHashLink(e, '#contact')}>contact</a>
        <a href={resumePdf} className="navbar-link" target="_blank" rel="noopener noreferrer">resume</a>
      </nav>

      {/* Hamburger button */}
      <button
        className={`navbar-hamburger ${menuOpen ? 'navbar-hamburger--open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile drawer */}
      <nav className={`navbar-mobile ${menuOpen ? 'navbar-mobile--open' : ''}`}>
        <a href="/" className="navbar-mobile-link" onClick={handleLogoClick}>home</a>
        <a href="/about" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>about</a>
        <a href="/#work" className="navbar-mobile-link" onClick={(e) => handleHashLink(e, '#work')}>work</a>
        <a href="/#contact" className="navbar-mobile-link" onClick={(e) => handleHashLink(e, '#contact')}>contact</a>
        <a href={resumePdf} className="navbar-mobile-link" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>resume</a>
      </nav>
    </header>
  )
}

export default Navbar
