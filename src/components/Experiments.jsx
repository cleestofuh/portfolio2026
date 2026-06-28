import { useState } from 'react'
import './Experiments.css'
import { borderPaths } from './Work'
import ExperimentModal from './ExperimentModal'
import GameModal from './GameModal'
import TextBulge from '../experiments/002-text-bulge'
import ThemeSwitch from './ThemeSwitch'
import ShikakuPreview from './ShikakuPreview'

// The card surface IS the experiment's first page (magnetic), interactive on
// hover. Rendered at a "virtual screen" size and scaled into the card. Each
// experiment maps to the preview component shown in its card.
const PREVIEWS = {
  text: () => (
    <div className="exp-live-stage">
      <TextBulge preview />
    </div>
  ),
}

// Same hand-drawn clip outlines the Work cards use, scoped to their own ids.
const clipPaths = [
  "M 0.13,0.03 C 0.45,0.01 0.65,0.02 0.87,0.04 C 0.94,0.04 0.97,0.07 0.97,0.13 C 0.99,0.45 1.00,0.65 0.97,0.87 C 0.97,0.93 0.94,0.97 0.87,0.97 C 0.55,0.99 0.35,0.98 0.13,0.97 C 0.06,0.97 0.03,0.93 0.03,0.87 C 0.01,0.55 0.00,0.35 0.03,0.13 C 0.03,0.07 0.06,0.03 0.13,0.03 Z",
  "M 0.15,0.04 C 0.42,0.02 0.62,0.03 0.85,0.05 C 0.93,0.05 0.96,0.08 0.96,0.15 C 0.98,0.42 0.99,0.62 0.96,0.85 C 0.96,0.93 0.93,0.96 0.85,0.96 C 0.58,0.99 0.38,0.97 0.15,0.96 C 0.07,0.96 0.04,0.93 0.04,0.85 C 0.02,0.58 0.01,0.38 0.04,0.15 C 0.04,0.08 0.07,0.04 0.15,0.04 Z",
]

const experiments = [
  {
    id: 'text',
    title: 'Text Transformations',
  },
]

function Experiments() {
  const [openExp, setOpenExp] = useState(null)
  const [gameOrigin, setGameOrigin] = useState(null)

  const openGame = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setGameOrigin({ top: r.top, left: r.left, width: r.width, height: r.height })
  }

  const handleOpen = (exp, e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOpenExp({
      ...exp,
      origin: { top: r.top, left: r.left, width: r.width, height: r.height },
    })
  }

  return (
    <div className="experiments">
      <div className="blob work-blob">
        <h2 className="work-heading reveal">experiments</h2>
        <div className="work-grid experiments-grid">
          {experiments.map((exp, i) => (
            <button
              key={exp.id}
              type="button"
              className="work-card exp-card reveal"
              style={{ position: 'relative', clipPath: `url(#exp-card-clip-${i})` }}
              onClick={(e) => handleOpen(exp, e)}
              aria-label={`Open ${exp.title} experiment`}
              data-cursor-tip="click to expand"
            >
              <svg className="work-card-border" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <clipPath id={`exp-card-clip-${i}`} clipPathUnits="objectBoundingBox">
                    <path d={clipPaths[i % clipPaths.length]} />
                  </clipPath>
                </defs>
                <path d={borderPaths[i % borderPaths.length]} fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
              <div className="exp-card-surface">
                {PREVIEWS[exp.id]?.()}
              </div>
            </button>
          ))}

          {/* A game I made — opens shikakudays.com in a phone-style modal. */}
          <button
            type="button"
            className="work-card exp-card exp-game-card reveal"
            style={{ position: 'relative', clipPath: 'url(#exp-card-clip-game)' }}
            data-cursor-tip="play the game"
            onClick={openGame}
            aria-label="Play Shikaku Days"
          >
            <svg className="work-card-border" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <clipPath id="exp-card-clip-game" clipPathUnits="objectBoundingBox">
                  <path d={clipPaths[0]} />
                </clipPath>
              </defs>
              <path d={borderPaths[0]} fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <div className="exp-card-surface exp-game-surface">
              <ShikakuPreview />
            </div>
          </button>

          {/* Theme toggle, presented as an experiment card (split freg/grid). */}
          <div
            className="work-card exp-card exp-toggle-card reveal"
            style={{ position: 'relative', clipPath: 'url(#exp-card-clip-toggle)' }}
            data-cursor-tip="click grid.md to toggle"
          >
            <svg className="work-card-border" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <clipPath id="exp-card-clip-toggle" clipPathUnits="objectBoundingBox">
                  <path d={clipPaths[1]} />
                </clipPath>
              </defs>
              <path d={borderPaths[1]} fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <div className="exp-card-surface exp-toggle-surface">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>

      {openExp && <ExperimentModal exp={openExp} onClose={() => setOpenExp(null)} />}
      {gameOrigin && <GameModal origin={gameOrigin} onClose={() => setGameOrigin(null)} />}
    </div>
  )
}

export default Experiments
