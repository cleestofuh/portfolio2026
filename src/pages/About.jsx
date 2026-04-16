import Navbar from '../components/Navbar'
import ThemeToggle from '../components/ThemeToggle'
import Footer from '../components/Footer'
import DraggableFrame from '../components/grid/DraggableFrame'
import { useTheme } from '../context/ThemeContext'
import resumePdf from '../assets/Christopher Lo Resume.pdf'
import './About.css'

function AboutFreg() {
  return (
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
            <p>I'm currently leading a team at LinkedIn designing enterprise and AI-powered experiences that help go-to-market and employee-facing teams move faster with more confidence.</p>
            <p>I love 0 to 1 problems where both the problem and solution are still taking shape, moving quickly to bring ideas to life. With a background in HCI and computer science, I thrive at the intersection of design, and engineering to ship pragmatic, scalable solutions. I'm also continuously curious, experimenting with emerging technologies and AI tooling to evolve my processes make better decisions, faster.</p>
          </div>
          <div className="about-page-skills">
            <div className="about-page-skills-col">
              <h2 className="about-page-skills-heading">skills</h2>
              <ul className="about-page-skills-list">
                <li>Product Vision & Strategy</li>
                <li>Interaction Design</li>
                <li>Visual Design</li>
                <li>Design Systems</li>
                <li>Prototyping</li>
                <li>UX Research</li>
                <li>Usability Testing</li>
                <li>Accessiblity</li>
                <li>Competitive Analysis</li>
              </ul>
            </div>
            <div className="about-page-skills-col">
              <h2 className="about-page-skills-heading">tools</h2>
              <ul className="about-page-skills-list">
                <li>Figma</li>
                <li>React</li>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>Git</li>
                <li>Cursor</li>
                <li>Claude Code</li>
              </ul>
            </div>
          </div>
          <div className="about-page-outside">
            <h2 className="about-page-skills-heading">outside the screen</h2>
            <p className="about-page-outside-text">outside the screen, i'm mostly serving as unpaid staff to my two cats, haku and juni, who have very strong opinions about when it's time for snacks, zoomies, or sitting directly on my keyboard. when they allow it, i'm usually wandering toward a quiet spot to watch the sky wind down for the day. the rest of the time, i'm over-invested in dialing in my coffee setup, tweaking grind size, water temp, and pour angles like it's going to change my life.</p>
            <div className="about-page-outside-photos">
              <figure className="about-page-outside-figure">
                <img src="/cats.jpg" alt="Haku and Juni" className="about-page-outside-img" />
                <figcaption>haku & juni</figcaption>
              </figure>
              <figure className="about-page-outside-figure">
                <img src="/sunset.jpeg" alt="Sunset" className="about-page-outside-img" />
                <figcaption>golden hour</figcaption>
              </figure>
              <figure className="about-page-outside-figure">
                <img src="/coffee.jpg" alt="Coffee" className="about-page-outside-img" />
                <figcaption>morning ritual</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function AboutGrid() {
  return (
    <main className="about-page about-page--grid">
      <div className="about-page-inner">
        <DraggableFrame className="about-grid-frame about-page-photo" frameLabel="Photo">
          <img src="/chris.JPG" alt="Chris Lo" className="about-page-photo-img" />
        </DraggableFrame>
        <div className="about-page-content">
          <DraggableFrame className="about-grid-frame about-grid-header" frameLabel="Header">
            <h1 className="about-page-name">Chris Lo</h1>
            <p className="about-page-role">Product Designer</p>
            <div className="about-page-links">
              <a href="https://www.linkedin.com/in/cleestofuh/" target="_blank" rel="noopener noreferrer" className="about-page-link">LinkedIn</a>
              <span className="about-page-link-dot">·</span>
              <a href={resumePdf} target="_blank" rel="noopener noreferrer" className="about-page-link">Resume</a>
              <span className="about-page-link-dot">·</span>
              <a href="/#contact" className="about-page-link">Contact</a>
            </div>
          </DraggableFrame>
          <DraggableFrame className="about-grid-frame about-page-bio" frameLabel="Bio">
            <p>I'm currently leading a team at LinkedIn designing enterprise and AI-powered experiences that help go-to-market and employee-facing teams move faster with more confidence.</p>
            <p>I love 0 to 1 problems where both the problem and solution are still taking shape, moving quickly to bring ideas to life. With a background in HCI and computer science, I thrive at the intersection of design, and engineering to ship pragmatic, scalable solutions. I'm also continuously curious, experimenting with emerging technologies and AI tooling to evolve my processes make better decisions, faster.</p>
          </DraggableFrame>
          <DraggableFrame className="about-grid-frame about-page-skills" frameLabel="Skills">
            <div className="about-page-skills-col">
              <h2 className="about-page-skills-heading">skills</h2>
              <ul className="about-page-skills-list">
                <li>Product Vision & Strategy</li>
                <li>Interaction Design</li>
                <li>Visual Design</li>
                <li>Design Systems</li>
                <li>Prototyping</li>
                <li>UX Research</li>
                <li>Usability Testing</li>
                <li>Accessiblity</li>
                <li>Competitive Analysis</li>
              </ul>
            </div>
            <div className="about-page-skills-col">
              <h2 className="about-page-skills-heading">tools</h2>
              <ul className="about-page-skills-list">
                <li>Figma</li>
                <li>React</li>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>Git</li>
                <li>Cursor</li>
                <li>Claude Code</li>
              </ul>
            </div>
          </DraggableFrame>
          <DraggableFrame className="about-grid-frame about-page-outside" frameLabel="Outside the Screen">
            <h2 className="about-page-skills-heading">outside the screen</h2>
            <p className="about-page-outside-text">outside the screen, i'm mostly serving as unpaid staff to my two cats, haku and juni, who have very strong opinions about when it's time for snacks, zoomies, or sitting directly on my keyboard. when they allow it, i'm usually wandering toward a quiet spot to watch the sky wind down for the day. the rest of the time, i'm over-invested in dialing in my coffee setup, tweaking grind size, water temp, and pour angles like it's going to change my life.</p>
            <div className="about-page-outside-photos">
              <DraggableFrame className="about-grid-frame about-page-outside-figure" frameLabel="Cats">
                <img src="/cats.jpg" alt="Haku and Juni" className="about-page-outside-img" />
                <figcaption>haku & juni</figcaption>
              </DraggableFrame>
              <DraggableFrame className="about-grid-frame about-page-outside-figure" frameLabel="Sunset">
                <img src="/sunset.jpeg" alt="Sunset" className="about-page-outside-img" />
                <figcaption>golden hour</figcaption>
              </DraggableFrame>
              <DraggableFrame className="about-grid-frame about-page-outside-figure" frameLabel="Coffee">
                <img src="/coffee.jpg" alt="Coffee" className="about-page-outside-img" />
                <figcaption>morning ritual</figcaption>
              </DraggableFrame>
            </div>
          </DraggableFrame>
        </div>
      </div>
    </main>
  )
}

function About() {
  const { theme } = useTheme()

  return (
    <>
      <ThemeToggle />
      <Navbar forceVisible />
      {theme === 'grid' ? <AboutGrid /> : <AboutFreg />}
      <Footer />
    </>
  )
}

export default About
