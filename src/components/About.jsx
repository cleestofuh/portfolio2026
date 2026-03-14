import './About.css'

function About() {
  return (
    <div className="about">
      <div className="about-blob">
      <p className="about-text">
        <span className="about-text-serif reveal">I&apos;m a product designer who cares about people, thinks in systems, sweats the details, and believes even complex workflows deserve a bit of <span className="about-delight">delight<img src="/bulb.svg" alt="" className="about-delight-bulb" /></span>.</span>
        <br />
        <span className="about-text-sans reveal" data-reveal-delay="250">Leading enterprise AI and employee experience design at <a href="https://www.linkedin.com/in/cleestofuh/" target="_blank" rel="noopener noreferrer" className="about-link" style={{textTransform: 'none'}}>LinkedIn</a>.
        </span>
      </p>
      </div>
    </div>
  )
}

export default About
