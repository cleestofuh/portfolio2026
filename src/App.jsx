import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Ripples from './components/Ripples'
import Blurb from './components/Blurb'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'

function spawnRippleAt(container, cx, cy, sizes = [80, 140, 200]) {
  const rings = sizes.map((size, i) => ({ delay: i * 150, size }));

  rings.forEach(({ delay, size }) => {
    setTimeout(() => {
      const ring = document.createElement('div');
      ring.className = 'ripple-ring';
      ring.style.left = `${cx}px`;
      ring.style.top = `${cy}px`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.marginLeft = `${-size / 2}px`;
      ring.style.marginTop = `${-size / 2}px`;
      container.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove());
    }, delay);
  });
}


function setupHoverShift(el, amount = 5) {
  const onEnter = (e) => {
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    el.style.translate = `${-(dx / dist) * amount}px ${-(dy / dist) * amount}px`;
  };
  const onLeave = () => { el.style.translate = ''; };
  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mouseleave', onLeave);
  return () => {
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
  };
}

function getCenterRelativeTo(el, ancestor) {
  let x = 0, y = 0;
  let current = el;
  while (current && current !== ancestor) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent;
  }
  return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
}

function App() {
  const heroRef = useRef(null);
  const pageRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location]);
  const lily1Ref = useRef(null);
  const lily2Ref = useRef(null);
  const lily3Ref = useRef(null);


  useEffect(() => {
    const container = heroRef.current;
    if (!container) return;

    const timeout = setTimeout(() => {
      const cx = container.offsetWidth / 2;
      const cy = container.offsetHeight / 2;
      spawnRippleAt(container, cx, cy, [200, 350, 500]);
    }, 600);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const container = heroRef.current;
    if (!container) return;

    const lilies = [lily1Ref.current, lily2Ref.current, lily3Ref.current].filter(Boolean);
    const frog = container.querySelector('.freg');
    const cleanups = [];

    lilies.forEach((el) => {
      let shiftCleanup = null;
      const clearBounce = () => el.classList.remove('bounce-up');
      const onMouseEnter = () => {
        const { x, y } = getCenterRelativeTo(el, container);
        spawnRippleAt(container, x, y, [180, 280]);
      };
      const onMouseDown = () => {
        clearBounce();
        const { x, y } = getCenterRelativeTo(el, container);
        spawnRippleAt(container, x, y, [150, 250, 350]);
      };
      const onMouseUp = () => {
        const { x, y } = getCenterRelativeTo(el, container);
        spawnRippleAt(container, x, y, [200, 320, 440]);
        clearBounce();
        void el.offsetWidth;
        el.classList.add('bounce-up');
      };
      const onMouseLeave = () => clearBounce();

      const onAnimEnd = () => {
        el.classList.add('steppable');
        shiftCleanup = setupHoverShift(el, 8);
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('mouseup', onMouseUp);
        el.addEventListener('mouseleave', onMouseLeave);
      };

      el.addEventListener('animationend', onAnimEnd);
      cleanups.push(() => {
        el.removeEventListener('animationend', onAnimEnd);
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mousedown', onMouseDown);
        el.removeEventListener('mouseup', onMouseUp);
        el.removeEventListener('mouseleave', onMouseLeave);
        if (shiftCleanup) shiftCleanup();
      });
    });

    if (frog) {
      let ready = false;
      let jumping = false;

      let detached = false;

      const onFrogClick = () => {
        if (!ready || jumping) return;
        jumping = true;
        clearInterval(wiggleInterval);

        frog.style.transform = 'none';

        // Viewport position for animation delta + bounds clamping
        const rect = frog.getBoundingClientRect();
        const size = rect.width;

        const margin = 32;
        const maxJump = 180;
        const angle = Math.random() * 2 * Math.PI;
        const jumpDist = 80 + Math.random() * (maxJump - 80);

        // Clamp destination to visible viewport
        const newViewportLeft = Math.max(margin, Math.min(window.innerWidth - size - margin, rect.left + Math.cos(angle) * jumpDist));
        const newViewportTop = Math.max(margin, Math.min(window.innerHeight - size - margin, rect.top + Math.sin(angle) * jumpDist));

        // Convert to page coords for storing final position
        const newPageLeft = newViewportLeft + window.scrollX;
        const newPageTop = newViewportTop + window.scrollY;

        const dx = newViewportLeft - rect.left;
        const dy = newViewportTop - rect.top;
        const arcHeight = Math.min(jumpDist * 0.45, 180);

        const anim = frog.animate([
          { transform: 'translate(0px, 0px) scale(1)' },
          { transform: `translate(${dx * 0.4}px, ${-arcHeight}px) scale(1.15)`, offset: 0.35 },
          { transform: `translate(${dx}px, ${dy + 6}px) scale(0.9)`, offset: 0.85 },
          { transform: `translate(${dx}px, ${dy}px) scale(1)` },
        ], { duration: 550, easing: 'ease-in-out', fill: 'forwards' });

        // Spawn ripple at landing moment (85% through = squish frame)
        setTimeout(() => {
          const containerRect = container.getBoundingClientRect();
          spawnRippleAt(
            container,
            newViewportLeft + size / 2 - containerRect.left,
            newViewportTop + size / 2 - containerRect.top,
            [120, 200, 280]
          );
        }, 550 * 0.85);

        anim.onfinish = () => {
          frog.style.left = `${newPageLeft}px`;
          frog.style.top = `${newPageTop}px`;
          anim.cancel();
          jumping = false;
        };
      };

      frog.addEventListener('click', onFrogClick);

      let wiggleInterval = null;

      const readyTimeout = setTimeout(() => {
        ready = true;
        const rect = frog.getBoundingClientRect();
        const computed = window.getComputedStyle(frog);
        const placeholder = document.createElement('span');
        placeholder.style.display = 'inline-block';
        placeholder.style.width = `${rect.width}px`;
        placeholder.style.height = `${rect.height}px`;
        placeholder.style.marginLeft = computed.marginLeft;
        placeholder.style.marginBottom = computed.marginBottom;
        placeholder.style.alignSelf = computed.alignSelf;
        placeholder.style.flexShrink = '0';
        frog.parentNode.insertBefore(placeholder, frog);
        document.body.appendChild(frog);
        detached = true;
        frog.style.position = 'absolute';
        frog.style.left = `${rect.left + window.scrollX}px`;
        frog.style.top = `${rect.top + window.scrollY}px`;
        frog.style.width = `${rect.width}px`;
        frog.style.margin = '0';
        frog.style.transform = 'none';
        frog.style.zIndex = '1000';
        frog.style.opacity = '1';
        frog.style.pointerEvents = 'auto';
        frog.style.cursor = 'pointer';

        wiggleInterval = setInterval(() => {
          if (jumping) return;
          frog.classList.add('freg-wiggle');
          frog.addEventListener('animationend', () => frog.classList.remove('freg-wiggle'), { once: true });
        }, 4000);
      }, 3000);

      cleanups.push(() => {
        clearTimeout(readyTimeout);
        clearInterval(wiggleInterval);
        frog.removeEventListener('click', onFrogClick);
        if (detached && frog.parentNode === document.body) {
          document.body.removeChild(frog);
        }
      });
    }

    return () => cleanups.forEach(fn => fn());
  }, []);

  useEffect(() => {
    const targets = [
      ...document.querySelectorAll('.title-letter'),
      ...document.querySelectorAll('.subtitle-word'),
      ...document.querySelectorAll('.hero-nav-link'),
      ...document.querySelectorAll('.work-card'),
    ];
    const cleanups = targets.map(el => setupHoverShift(el, 5));
    return () => cleanups.forEach(fn => fn());
  }, []);

  useEffect(() => {
    const timeouts = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.revealDelay || 0;
            timeouts.push(setTimeout(() => el.classList.add('visible'), delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((el, i) => {
      if (el.classList.contains('work-card')) {
        el.dataset.revealDelay = i * 100;
      }
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-ripple-zone" ref={pageRef}>
      <Ripples containerRef={pageRef} />
      <section className="hero" ref={heroRef}>
        <div className="title">
          <img ref={lily1Ref} src="/lily1.svg" alt="" className="lily lily1" />
          <img ref={lily2Ref} src="/lily2.svg" alt="" className="lily lily2" />
          <img ref={lily3Ref} src="/lily3.svg" alt="" className="lily lily3" />
          <div className="title-line">
            {'chris'.split('').map((char, i) => (
              <span key={i} className="title-letter">
                {char}
              </span>
            ))}
          </div>
          <div className="title-line">
            <span className="title-letter">L</span>
            <img src="/freg.svg" alt="frog" className="freg title-letter" />
          </div>
        </div>

        <nav className="hero-nav">
          <a href="/about" className="hero-nav-link">about</a>
          <a href="#work" className="hero-nav-link">work</a>
          <a href="#contact" className="hero-nav-link">contact</a>
        </nav>

        <a href="#about" className="scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 13l7 7 7-7" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        <p className="subtitle">
        <span className="subtitle-word">currently</span>{' '}
          <span className="subtitle-word">vibin'</span>{' '}
          <span className="subtitle-word">and</span>{' '}
          <span className="subtitle-word">designin'</span>{' '}
          <span className="subtitle-word">@</span>{' '}
          <a href="https://www.linkedin.com/in/cleestofuh/" target="_blank" rel="noopener noreferrer" className="subtitle-link">linkedin</a>
        </p>
      </section>

      <div className="content-sections">
        <section id="about">
          <Blurb />
        </section>

        <section id="work">
          <Work />
        </section>

        <div className="rocks-divider">
          <img src="/rocks.svg" alt="" className="rocks-divider-img" />
        </div>
      </div>
      </div>

      <section id="contact">
        <Contact />
      </section>
      <Footer green />
    </>
  )
}

export default App
