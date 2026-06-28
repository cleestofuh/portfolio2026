import { useEffect, useRef } from 'react'
import './ShikakuPreview.css'

// Web port of the game's RulesModal <AnimatedDemo>: a 4×4 Shikaku board whose
// solution rectangles draw themselves in (scaleX then scaleY, staggered),
// hold, then reset and loop. Original used React Native Reanimated; here it's
// the Web Animations API with the same timings.
const CELL = 40
const GAP = 4
const GRID = 4
const SIZE = CELL * GRID + GAP * (GRID - 1)
const LOOP = 7500
const pos = (i) => i * (CELL + GAP)
const EASE = 'cubic-bezier(0.215, 0.61, 0.355, 1)'

const RECT_COLORS = ['#B8ADD4', '#E09E8E', '#DEC88E', '#A3C5AD', '#D4A8A8']

const NUMBERS = [
  { row: 0, col: 1, val: 3 },
  { row: 0, col: 3, val: 2 },
  { row: 1, col: 1, val: 3 },
  { row: 2, col: 0, val: 4 },
  { row: 3, col: 3, val: 4 },
]

const RECTS = [
  { r1: 0, c1: 0, r2: 0, c2: 2, color: RECT_COLORS[0], delay: 600 },
  { r1: 0, c1: 3, r2: 1, c2: 3, color: RECT_COLORS[1], delay: 1800 },
  { r1: 1, c1: 0, r2: 1, c2: 2, color: RECT_COLORS[3], delay: 3000 },
  { r1: 2, c1: 0, r2: 3, c2: 1, color: RECT_COLORS[2], delay: 4200 },
  { r1: 2, c1: 2, r2: 3, c2: 3, color: RECT_COLORS[4], delay: 5400 },
]

function AnimatedRect({ rect }) {
  const xRef = useRef(null)
  const yRef = useRef(null)

  const cols = rect.c2 - rect.c1 + 1
  const rows = rect.r2 - rect.r1 + 1
  const width = cols * CELL + (cols - 1) * GAP
  const height = rows * CELL + (rows - 1) * GAP
  const left = rect.c1 * (CELL + GAP)
  const top = rect.r1 * (CELL + GAP)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      xRef.current.style.transform = 'scaleX(1)'
      xRef.current.style.opacity = '1'
      yRef.current.style.transform = 'scaleY(1)'
      return
    }
    const d = rect.delay
    // wrap from offset 1 back to offset 0 is instant → the reset is snappy
    const xa = xRef.current.animate(
      [
        { transform: 'scaleX(0)', opacity: 0, offset: 0 },
        { transform: 'scaleX(0)', opacity: 1, offset: d / LOOP, easing: EASE },
        { transform: 'scaleX(1)', opacity: 1, offset: (d + 400) / LOOP },
        { transform: 'scaleX(1)', opacity: 1, offset: 1 },
      ],
      { duration: LOOP, iterations: Infinity }
    )
    const ya = yRef.current.animate(
      [
        { transform: 'scaleY(0)', offset: 0 },
        { transform: 'scaleY(0)', offset: (d + 150) / LOOP, easing: EASE },
        { transform: 'scaleY(1)', offset: (d + 500) / LOOP },
        { transform: 'scaleY(1)', offset: 1 },
      ],
      { duration: LOOP, iterations: Infinity }
    )
    return () => { xa.cancel(); ya.cancel() }
  }, [rect.delay])

  return (
    <div ref={xRef} className="sk-rect-x" style={{ left, top, width, height }}>
      <div ref={yRef} className="sk-rect-y" style={{ background: rect.color }} />
    </div>
  )
}

function ShikakuPreview() {
  return (
    <div className="exp-game-inner">
      <div className="sk-grid-outer" style={{ width: SIZE + 12, height: SIZE + 12 }}>
        <div className="sk-grid" style={{ width: SIZE, height: SIZE }}>
          {Array.from({ length: GRID }, (_, row) =>
            Array.from({ length: GRID }, (_, col) => (
              <div
                key={`${row}-${col}`}
                className="sk-cell"
                style={{ left: pos(col), top: pos(row), width: CELL, height: CELL }}
              />
            ))
          )}

          {RECTS.map((rect, i) => (
            <AnimatedRect key={i} rect={rect} />
          ))}

          {NUMBERS.map((n, i) => (
            <div
              key={i}
              className="sk-num"
              style={{ left: pos(n.col) + CELL / 2 - 12, top: pos(n.row) + CELL / 2 - 12 }}
            >
              {n.val}
            </div>
          ))}
        </div>
      </div>
      <span className="exp-game-title">Shikaku Days</span>
    </div>
  )
}

export default ShikakuPreview
