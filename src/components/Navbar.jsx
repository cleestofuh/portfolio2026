import { useState, useEffect, useRef, useCallback } from 'react'
import './Navbar.css'

function Navbar() {
  const [visible, setVisible] = useState(false);
  const logoRef = useRef(null);
  const jumpingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      setVisible(window.scrollY > vh * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);
  }, []);

  return (
    <header className={`navbar ${visible ? 'navbar--visible' : ''}`}>
      <a href="#" className="navbar-logo" onClick={handleLogoClick}>
        <img ref={logoRef} src="/freg.svg" alt="Chris Lo" className="navbar-logo-img" />
      </a>
      <nav className="navbar-links">
        <a href="#about" className="navbar-link">about</a>
        <a href="#work" className="navbar-link">work</a>
      </nav>
    </header>
  )
}

export default Navbar
