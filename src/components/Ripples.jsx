import { useEffect, useRef, useCallback } from 'react'
import './Ripples.css'

function Ripples({ containerRef }) {
  const lastSpawn = useRef(0);
  const rippleId = useRef(0);

  const spawnRipple = useCallback((x, y) => {
    const container = containerRef.current;
    if (!container) return;

    const rings = [
      { delay: 0, size: 80 },
      { delay: 150, size: 140 },
      { delay: 300, size: 200 },
    ];

    rings.forEach(({ delay, size }) => {
      setTimeout(() => {
        const ring = document.createElement('div');
        ring.className = 'ripple-ring';
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.marginLeft = `${-size / 2}px`;
        ring.style.marginTop = `${-size / 2}px`;
        container.appendChild(ring);

        ring.addEventListener('animationend', () => ring.remove());
      }, delay);
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastSpawn.current < 180) return;
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
