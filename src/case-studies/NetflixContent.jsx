import { useState } from 'react'
import ImageModal from '../components/ImageModal'
import VideoModal from '../components/VideoModal'

function NetflixContent() {
  const [modalSrc, setModalSrc] = useState(null)
  const [modalAlt, setModalAlt] = useState('')
  const [videoModal, setVideoModal] = useState(false)

  const openModal = (src, alt) => { setModalSrc(src); setModalAlt(alt) }
  const closeModal = () => setModalSrc(null)

  return (
    <>
      <div className="cs-sections">

        <section className="cs-section" id="overview">
          <div className="cs-section-label">01  overview</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">project overview</h2>
            <p className="cs-section-body">
              Netflix approached our team with a "blue sky" brief: explore innovative ways to increase user engagement within the Netflix environment. Over the course of the project, we ideated, researched, and validated a product concept, culminating in a presentation to the Netflix design team. The concept we landed on was Ask Me Live!, a live Q&A platform that connects fans directly with the cast and crew of their favorite shows.
            </p>
          </div>
        </section>

        <section className="cs-section" id="problem">
          <div className="cs-section-label">02  problem</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">the problem</h2>
            <p className="cs-section-body">
              Passionate Netflix fans have no structured way to engage with the talent behind the shows they love. Extended content like behind-the-scenes footage, interviews, and cast reactions is scattered across different platforms and rarely feels personal. There's a gap between watching a show and feeling genuinely connected to the people who made it.
            </p>
            <blockquote className="cs-callout">
              How might we create a Q&A platform that further connects Netflix watchers with their favorite shows and actors in an engaging and satisfying way?
            </blockquote>
          </div>
        </section>

        <section className="cs-section" id="research">
          <div className="cs-section-label">03  research</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">research & discovery</h2>
            <p className="cs-section-body">
              We ran two rounds of research. First, 14 semi-structured exploratory interviews with streaming users (ages 19 to 68). Then a second round of scenario-based interviews designed to validate our Q&A concept specifically. Our goal was to understand how people consume extended content, what motivates fandom, and how a live Q&A experience would fit into their lives.
            </p>
            <ul className="cs-insights">
              <li className="cs-insight">Authenticity over production. Participants strongly preferred an intimate, unscripted feel over polished content.</li>
              <li className="cs-insight">Most people (70%) want to watch, not participate. Only 30% said they'd actively ask questions, but nearly all valued the option.</li>
              <li className="cs-insight">Discovery happens on social media. Users find events through celebrities they already follow, not through the platform itself.</li>
              <li className="cs-insight">Live is preferred, but recordings matter. People want to tune in live, but expect to catch up if they miss it.</li>
              <li className="cs-insight">Actors and personal stories win. Fans want to hear from cast members about their personal lives and experiences, not just technical crew.</li>
            </ul>
            <div className="cs-metrics">
              <div className="cs-metric">
                <span className="cs-metric-value">28</span>
                <span className="cs-metric-label">research participants across two rounds</span>
              </div>
              <div className="cs-metric">
                <span className="cs-metric-value">3</span>
                <span className="cs-metric-label">concepts evaluated before converging</span>
              </div>
              <div className="cs-metric">
                <span className="cs-metric-value">5</span>
                <span className="cs-metric-label">key design themes guiding the solution</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cs-section" id="process">
          <div className="cs-section-label">04  process</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">design process</h2>
            <p className="cs-section-body">
              We started with a wide ideation phase, brainstorming three concepts: a short-form video creation platform, a social watch party feature, and an extended content hub. We then evaluated them against an effort/impact matrix. The extended content idea resonated most with Netflix's goals and user needs. From there, we mapped user journeys around two behavioral archetypes: the Convenience Participant (casual and passive) and the Engaged Fan (active and invested). These archetypes shaped the feature set we built toward. A Crazy 8s exercise helped us rapidly explore the "during event" experience before converging on a feature diagram and wireframes.
            </p>
            <div className="cs-img-grid">
              <button className="cs-img-btn" onClick={() => openModal('/netflix/user-journey.png', 'User journey map')}>
                <img src="/netflix/user-journey.png" alt="User journey map" className="cs-section-img" />
                <span className="cs-img-caption">user journey map</span>
              </button>
              <button className="cs-img-btn" onClick={() => openModal('/netflix/crazy-8.png', 'Crazy 8s ideation exercise')}>
                <img src="/netflix/crazy-8.png" alt="Crazy 8s ideation exercise" className="cs-section-img" />
                <span className="cs-img-caption">crazy 8s ideation</span>
              </button>
            </div>
            <button className="cs-img-btn" onClick={() => openModal('/netflix/ux-flowchart.png', 'Q&A platform UX flow chart')}>
              <img src="/netflix/ux-flowchart.png" alt="Q&A platform UX flow chart" className="cs-section-img" />
              <span className="cs-img-caption">Q&A platform flow chart</span>
            </button>
          </div>
        </section>

        <section className="cs-section" id="solution">
          <div className="cs-section-label">05  solution</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">final design</h2>
            <p className="cs-section-body">
              Ask Me Live! is a live Q&A experience embedded within Netflix that lets fans engage with cast and crew around their favorite shows. Key features include a question queue with community upvoting, a current-question display during the live stream, a pre-event page for submitting questions and setting reminders, a post-event recording with timestamped Q&A bookmarks, emoji reactions, and social sharing of clips. The design prioritizes passive consumption while keeping participation accessible for fans who want it.
            </p>
            <button className="cs-video-btn" onClick={() => setVideoModal(true)}>
              <div className="cs-video-center">
                <video
                  className="cs-section-video"
                  src="/netflix/netflix-flow.mov"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </button>
          </div>
        </section>

        <section className="cs-section" id="impact">
          <div className="cs-section-label">06  impact</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">impact</h2>
            <p className="cs-section-body">
              The final concept was presented to Netflix's design team and received strong positive feedback. The team validated that Ask Me Live! addressed a real gap in the engagement landscape and differentiated Netflix from existing live-streaming platforms. Our research findings were incorporated into Netflix's broader user engagement initiatives, contributing to the strategic direction that preceded the launch of <a href="https://www.tudum.com" target="_blank" rel="noreferrer" className="cs-inline-link">Tudum</a>, Netflix's official fan destination for exclusive news, previews, and talent Q&As.
            </p>
          </div>
        </section>

        <section className="cs-section">
          <div className="cs-section-label">08  full report</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">want to go deeper?</h2>
            <p className="cs-section-body">
              The full capstone report covers our complete research methodology, key themes, ideation, and annotated wireframes in detail.
            </p>
            <a
              href="/netflix/Netflix Capstone.pdf"
              target="_blank"
              rel="noreferrer"
              className="cs-pdf-link"
            >
              view full capstone report ↗
            </a>
          </div>
        </section>

        <section className="cs-section" id="reflection">
          <div className="cs-section-label">09  reflection</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">what i learned</h2>
            <p className="cs-section-body">
              This project reinforced how much early research shapes the entire design direction. Our decision to pivot from a broad engagement platform to a focused Q&A experience came entirely from what users told us about authenticity and parasocial connection. I also learned a lot about designing for two very different user types at the same time: the casual viewer who just wants to watch, and the devoted fan who wants to participate. Balancing those needs without alienating either was the most interesting design challenge of the project.
            </p>
          </div>
        </section>

      </div>

      {modalSrc && <ImageModal src={modalSrc} alt={modalAlt} onClose={closeModal} />}
      {videoModal && <VideoModal src="/netflix/netflix-flow.mov" onClose={() => setVideoModal(false)} />}
    </>
  )
}

export default NetflixContent
