import { useTheme } from '../context/ThemeContext'
import './ThemeSwitch.css'

// A split control: the freg half and the grid half, each a mini preview of
// that theme. Clicking the inactive half switches the whole UI (with a
// crossfade handled by ThemeContext). Used inside an experiment card.
function ThemeSwitch() {
  const { theme, selectTheme } = useTheme()

  return (
    <div className="theme-switch" role="group" aria-label="Site theme">
      <button
        type="button"
        className={`theme-switch-half theme-switch-half--freg${theme === 'freg' ? ' is-active' : ''}`}
        onClick={() => selectTheme('freg')}
        aria-pressed={theme === 'freg'}
      >
        <img src="/freg.svg" alt="" className="theme-switch-frog" />
        <span className="theme-switch-label">freg.md</span>
      </button>

      <button
        type="button"
        className={`theme-switch-half theme-switch-half--grid${theme === 'grid' ? ' is-active' : ''}`}
        onClick={() => selectTheme('grid')}
        aria-pressed={theme === 'grid'}
      >
        <span className="theme-switch-gridicon" aria-hidden="true" />
        <span className="theme-switch-label">grid.md</span>
      </button>
    </div>
  )
}

export default ThemeSwitch
