import { useEffect, useRef } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Ripples from './components/Ripples'
import About from './components/About'
import Work from './components/Work'

function lerp(a, b, t) {
  return a + (b - a) * t;
}

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
  const lily1Ref = useRef(null);
  const lily2Ref = useRef(null);
  const lily3Ref = useRef(null);

  useEffect(() => {
    const heroBlue = { r: 168, g: 184, b: 196 };
    const white = { r: 255, g: 255, b: 255 };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const t = Math.min(scrollY / vh, 1);

      const r = Math.round(lerp(heroBlue.r, white.r, t));
      const g = Math.round(lerp(heroBlue.g, white.g, t));
      const b = Math.round(lerp(heroBlue.b, white.b, t));

      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = heroRef.current;
    if (!container) return;

    const timeouts = [];

    const lilies = [
      { ref: lily1Ref, animDelay: 200 },
      { ref: lily2Ref, animDelay: 600 },
      { ref: lily3Ref, animDelay: 1000 },
    ];

    lilies.forEach(({ ref, animDelay }) => {
      timeouts.push(setTimeout(() => {
        const el = ref.current;
        if (!el) return;
        const { x, y } = getCenterRelativeTo(el, container);
        spawnRippleAt(container, x, y, [200, 300, 400]);
      }, animDelay + 350));
    });

    const letters = container.querySelectorAll('.title-letter');
    letters.forEach((el) => {
      const delayMs = parseFloat(el.style.animationDelay) * 1000;
      timeouts.push(setTimeout(() => {
        const { x, y } = getCenterRelativeTo(el, container);
        spawnRippleAt(container, x, y);
      }, delayMs + 240));
    });

    return () => timeouts.forEach(clearTimeout);
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

      const onFrogClick = () => {
        if (!ready || jumping) return;
        jumping = true;
        frog.style.animation = 'none';
        void frog.offsetWidth;
        frog.style.animation = 'frog-jump 0.5s ease-out forwards';

        setTimeout(() => {
          const { x, y } = getCenterRelativeTo(frog, container);
          spawnRippleAt(container, x, y, [120, 200, 280]);
        }, 300);

        setTimeout(() => {
          frog.style.animation = 'none';
          jumping = false;
        }, 500);
      };

      frog.addEventListener('click', onFrogClick);

      const readyTimeout = setTimeout(() => {
        ready = true;
        frog.style.animation = 'none';
        frog.style.opacity = '1';
        frog.style.transform = 'scale(1) translateY(0)';
        frog.style.pointerEvents = 'auto';
        frog.style.cursor = 'pointer';
      }, 3400);

      cleanups.push(() => {
        clearTimeout(readyTimeout);
        frog.removeEventListener('click', onFrogClick);
      });
    }

    return () => cleanups.forEach(fn => fn());
  }, []);

  useEffect(() => {
    const targets = [
      ...document.querySelectorAll('.title-letter'),
      ...document.querySelectorAll('.subtitle'),
      ...document.querySelectorAll('.hero-nav-link'),
      ...document.querySelectorAll('.work-card'),
    ];
    const cleanups = targets.map(el => setupHoverShift(el, 5));
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <>
      <Navbar />
      <section className="hero" ref={heroRef}>
        <Ripples containerRef={heroRef} />
        <img ref={lily1Ref} src="/lily1.svg" alt="" className="lily lily1" />
        <img ref={lily2Ref} src="/lily2.svg" alt="" className="lily lily2" />
        <img ref={lily3Ref} src="/lily3.svg" alt="" className="lily lily3" />

        <div className="title">
          <div className="title-line">
            {'chris'.split('').map((char, i) => (
              <span key={i} className="title-letter" style={{ animationDelay: `${1.5 + i * 0.1}s` }}>
                {char}
              </span>
            ))}
          </div>
          <div className="title-line">
            <span className="title-letter" style={{ animationDelay: '2.0s' }}>L</span>
            <img src="/freg.svg" alt="frog" className="freg title-letter" style={{ animationDelay: '2.8s' }} />
          </div>
        </div>

        <p className="subtitle">vibing and designing at <a href="https://www.linkedin.com/in/cleestofuh/" target="_blank" rel="noopener noreferrer" className="subtitle-link">linkedin</a></p>

        <nav className="hero-nav">
          <a href="#about" className="hero-nav-link">
            <img src="/whirl.svg" alt="" className="whirl" />
            about
          </a>
          <a href="#work" className="hero-nav-link">
            <img src="/whirl.svg" alt="" className="whirl" />
            work
          </a>
        </nav>
      </section>

      <section id="about">
        <About />
      </section>

      <section id="work">
        <Work />
      </section>
    </>
  )
}

export default App
