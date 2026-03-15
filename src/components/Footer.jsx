import './Footer.css'

function Footer({ green }) {
  return (
    <footer className={`site-footer${green ? ' site-footer--green' : ''}`}>
      <span>copyright {new Date().getFullYear()} © christopher lo</span>
    </footer>
  )
}

export default Footer
