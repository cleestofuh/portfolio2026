import { useState } from 'react'
import DraggableFrame from './DraggableFrame'
import ThemeSwitch from '../ThemeSwitch'
import ExperimentModal from '../ExperimentModal'
import GameModal from '../GameModal'
import TextBulge from '../../experiments/002-text-bulge'
import ShikakuPreview from '../ShikakuPreview'

// The experiments section, translated into the grid (Figma-canvas) style.
// Holds the theme toggle — so the grid view can switch back to freg — plus
// the interactive text-transformations card.
function GridExperiments() {
  const [openExp, setOpenExp] = useState(null)
  const [gameOrigin, setGameOrigin] = useState(null)

  const openGame = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setGameOrigin({ top: r.top, left: r.left, width: r.width, height: r.height })
  }

  const openText = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOpenExp({
      id: 'text',
      title: 'Text Transformations',
      origin: { top: r.top, left: r.left, width: r.width, height: r.height },
    })
  }

  return (
    <div className="grid-experiments">
      <DraggableFrame className="grid-exp-frame" frameLabel="Experiments">
        <div className="grid-exp-cards">
          <DraggableFrame className="grid-exp-card" frameLabel="Text Transformations" noResize cursorTip="click to expand">
            <button
              type="button"
              className="grid-exp-open"
              onClick={openText}
              aria-label="Open Text Transformations experiment"
            >
              <div className="grid-exp-stage">
                <TextBulge preview />
              </div>
            </button>
            <span className="grid-dimension grid-dimension--card">360 &times; 300</span>
          </DraggableFrame>

          <DraggableFrame className="grid-exp-card" frameLabel="Shikaku Days" noResize cursorTip="play the game">
            <button
              type="button"
              className="grid-exp-game"
              onClick={openGame}
              aria-label="Play Shikaku Days"
            >
              <ShikakuPreview />
            </button>
            <span className="grid-dimension grid-dimension--card">360 &times; 300</span>
          </DraggableFrame>

          <DraggableFrame className="grid-exp-card" frameLabel="Theme" noResize cursorTip="click freg.md to toggle">
            <div className="grid-exp-toggle">
              <ThemeSwitch />
            </div>
            <span className="grid-dimension grid-dimension--card">360 &times; 300</span>
          </DraggableFrame>
        </div>
      </DraggableFrame>

      {openExp && <ExperimentModal exp={openExp} onClose={() => setOpenExp(null)} />}
      {gameOrigin && <GameModal origin={gameOrigin} onClose={() => setGameOrigin(null)} />}
    </div>
  )
}

export default GridExperiments
