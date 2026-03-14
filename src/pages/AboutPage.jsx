import Navbar from '../components/Navbar'
import resumePdf from '../assets/Christopher Lo Resume.pdf'
import './AboutPage.css'

function AboutPage() {
  return (
    <>
      <Navbar forceVisible />
      <main className="about-page">
        <div className="about-page-inner">
          <div className="about-page-photo">
            <img src="/chris.JPG" alt="Chris Lo" className="about-page-photo-img" />
          </div>
          <div className="about-page-content">
            <h1 className="about-page-name">Chris Lo</h1>
            <p className="about-page-role">Product Designer</p>
            <div className="about-page-links">
              <a href="https://www.linkedin.com/in/cleestofuh/" target="_blank" rel="noopener noreferrer" className="about-page-link">LinkedIn</a>
              <span className="about-page-link-dot">·</span>
              <a href={resumePdf} target="_blank" rel="noopener noreferrer" className="about-page-link">Resume</a>
              <span className="about-page-link-dot">·</span>
              <a href="/#contact" className="about-page-link">Contact</a>
            </div>
            <div className="about-page-bio">
              <p>
                I'm currently leading a team at LinkedIn designing enterprise and AI-powered experiences that help go-to-market and employee-facing teams move faster with more confidence.
              </p>
              <p>
                I love 0 to 1 problems where both the problem and solution are still taking shape, moving quickly to bring ideas to life. 
                With a background in HCI and computer science, I thrive at the intersection of design, and engineering to ship pragmatic, scalable solutions.  
                I'm also continuously curious, experimenting with emerging technologies and AI tooling to evolve my processes make better decisions, faster.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default AboutPage
