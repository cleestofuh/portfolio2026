import { Link } from 'react-router-dom'

function GridNavbar({ forceVisible }) {
  return (
    <nav className="grid-navbar">
      <div className="grid-navbar-left">
        <Link to="/" className="grid-navbar-logo">Chris Lo</Link>
        <span className="grid-navbar-divider" />
        <span className="grid-navbar-role">Product Designer</span>
      </div>
      <div className="grid-navbar-right">
        <Link to="/about" className="grid-navbar-link">About</Link>
        <a href={forceVisible ? '/#work' : '#work'} className="grid-navbar-link">Work</a>
        <a href={forceVisible ? '/#contact' : '#contact'} className="grid-navbar-link">Contact</a>
      </div>
    </nav>
  )
}

export default GridNavbar
