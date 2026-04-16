import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isGrid = theme === 'grid'

  return (
    <div className="theme-toggle-fixed">
      <div className={`theme-toggle-indicator ${isGrid ? 'theme-toggle-indicator--bottom' : ''}`} />
      <button
        className={`theme-toggle-btn ${!isGrid ? 'theme-toggle-btn--active' : ''}`}
        onClick={isGrid ? toggleTheme : undefined}
        aria-label="Switch to freg theme"
      >
        freg.md
      </button>
      <button
        className={`theme-toggle-btn ${isGrid ? 'theme-toggle-btn--active' : ''}`}
        onClick={!isGrid ? toggleTheme : undefined}
        aria-label="Switch to grid theme"
      >
        grid.md
      </button>
    </div>
  )
}

export default ThemeToggle
