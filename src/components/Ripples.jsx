import { useEffect, useRef, useCallback } from 'react'
import './Ripples.css'

function Ripples({ containerRef }) {
  const lastSpawn = useRef(0);

  const spawnRipple = useCallback((x, y) => {
    const container = containerRef.current;
    if (!container) return;

    const rings = [
      { animDelay: 0,    size: 120, duration: 1.8 },
      { animDelay: 0.6,  size: 240, duration: 2.2 },
      { animDelay: 1.2,  size: 360, duration: 2.6 },
    ];

    rings.forEach(({ animDelay, size, duration }) => {
      const ring = document.createElement('div');
      ring.className = 'ripple-ring';
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.marginLeft = `${-size / 2}px`;
      ring.style.marginTop = `${-size / 2}px`;
      ring.style.animationDelay = `${animDelay}s`;
      ring.style.animationDuration = `${duration}s`;
      ring.style.opacity = '0';
      container.appendChild(ring);

      ring.addEventListener('animationend', () => ring.remove());
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastSpawn.current < 300) return;
      lastSpawn.current = now;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spawnRipple(x, y);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [containerRef, spawnRipple]);

  return null;
}

export default Ripples
