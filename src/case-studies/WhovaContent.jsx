import { useState } from 'react'
import ImageModal from '../components/ImageModal'

function WhovaContent() {
  const [modalSrc, setModalSrc] = useState(null)
  const [modalAlt, setModalAlt] = useState('')

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
              Break the Ice! was a 2-week design sprint at Whova focused on improving early community engagement in the Whova event app. As Lead Designer, I partnered with a Product Manager and App Team Lead to design a feature that would encourage event attendees to participate in the Community from the moment they joined, turning an empty space into an active and welcoming one.
            </p>
          </div>
        </section>

        <section className="cs-section" id="problem">
          <div className="cs-section-label">02  problem</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">the problem</h2>
            <p className="cs-section-body">
              Early adopters of the Whova app were hesitant to initiate discussions in the Community because there was little engaging content when they first arrived. Without a critical mass of activity, the space felt empty and uninviting. This led to low overall participation and reduced value for attendees across the board.
            </p>
            <p className="cs-section-body">
              The existing solution had clear gaps. Introductions were often generic and gave people little to respond to, making it hard to start a real conversation with someone you had never met.
            </p>
            <blockquote className="cs-callout">
              How can we improve our existing solution to encourage a more active Community?
            </blockquote>
            <button className="cs-img-btn" onClick={() => openModal('/whova/existing-solution.png', 'Existing solution')}>
              <img src="/whova/existing-solution.png" alt="Existing solution" className="cs-section-img" />
              <span className="cs-img-caption">existing solution</span>
            </button>
          </div>
        </section>

        <section className="cs-section" id="goals">
          <div className="cs-section-label">03  goals</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">goals</h2>
            <p className="cs-section-body">
              The project aimed to encourage Community participation that would foster meaningful conversation and create a genuine sense of community within each event. Two high-level goals shaped the direction: ease attendees into the Community concept so they felt comfortable initiating discussions, and make participation feel genuinely worth their time.
            </p>
            <p className="cs-section-body">
              The low-level success metric was increasing the App Engagement Score. We also mapped out three user goal categories to guide design decisions:
            </p>
            <ul className="cs-insights">
              <li className="cs-insight">Learn. Find topics of interest to read about and participate in.</li>
              <li className="cs-insight">Connect. Research attendees, form new relationships, and reconnect with former colleagues.</li>
              <li className="cs-insight">Have fun. Find others with shared interests to explore the surrounding area during off-hours.</li>
            </ul>
          </div>
        </section>

        <section className="cs-section" id="challenges">
          <div className="cs-section-label">04  challenges</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">challenges</h2>
            <p className="cs-section-body">
              The nature of Whova's product made this problem uniquely constrained. Events typically last between one and four days, giving attendees very little time to learn the app. Most people download it within a week of the event, and the majority are first-time Whova users with no prior context. Because each Community is event-specific, there is no existing discussion when attendees first open it. Every event starts from zero.
            </p>
            <p className="cs-section-body">
              This shaped four core use cases we designed for: introducing yourself to other attendees, editing or deleting your introduction, browsing other attendees' introductions, and replying to them.
            </p>
          </div>
        </section>

        <section className="cs-section" id="process">
          <div className="cs-section-label">05  process</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">design process</h2>
            <p className="cs-section-body">
              Prototyping surfaced two rounds of critical feedback. The first pass at a community onboarding flow revealed that the length risked drop-off before users even got started, and the purpose of each input field was unclear to users moving through it for the first time.
            </p>
            <p className="cs-section-body">
              A second iteration addressed deeper concerns: pre-filled message templates were not encouraging any personality in introductions, the feature was feeling too similar to the existing Attendee List, and photo quality had technical constraints that needed to be worked around. Each round of feedback pushed the design toward something that felt more personal, more distinct, and easier to act on.
            </p>
            <div className="cs-img-grid">
              <button className="cs-img-btn" onClick={() => openModal('/whova/first iteration.png', 'First iteration')}>
                <img src="/whova/first iteration.png" alt="First iteration" className="cs-section-img" />
                <span className="cs-img-caption">first iteration</span>
              </button>
              <button className="cs-img-btn" onClick={() => openModal('/whova/second-iteration.png', 'Second iteration')}>
                <img src="/whova/second-iteration.png" alt="Second iteration" className="cs-section-img" />
                <span className="cs-img-caption">second iteration</span>
              </button>
            </div>
          </div>
        </section>

        <section className="cs-section" id="solution">
          <div className="cs-section-label">06  solution</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">final design</h2>
            <p className="cs-section-body">
              The final design introduced a structured but playful ice breaker experience embedded within the Community. Rather than a blank prompt, attendees were guided through a short, low-pressure introduction format that surfaced personality without requiring effort. The experience was designed specifically for early adoption: simple enough to complete quickly, personal enough to spark real conversation.
            </p>
            <p className="cs-section-body">
              Key trade-offs were made intentionally. The UI was not designed to scale for a high volume of ice breakers, and initial customization options were limited to test usage patterns before expanding. Navigation for revisiting past conversations was also a known gap to address in a future iteration.
            </p>
            <button className="cs-img-btn" onClick={() => openModal('/whova/final-design.png', 'Final design')}>
              <img src="/whova/final-design.png" alt="Final design" className="cs-section-img" />
              <span className="cs-img-caption">final design</span>
            </button>
          </div>
        </section>

        <section className="cs-section" id="impact">
          <div className="cs-section-label">07  impact</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">impact</h2>
            <p className="cs-section-body">
              After monitoring over several months, the App Engagement Score increased significantly, meeting the success criteria set at the start of the project. The feature demonstrated that a low-friction, personality-driven entry point could meaningfully shift participation behavior even in short-lived event communities.
            </p>
            <div className="cs-metrics">
              <div className="cs-metric">
                <span className="cs-metric-value">+XX%</span>
                <span className="cs-metric-label">increase in app engagement score</span>
              </div>
              <div className="cs-metric">
                <span className="cs-metric-value">2 wks</span>
                <span className="cs-metric-label">from brief to final design</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cs-section">
          <div className="cs-section-label">09  further reading</div>
          <div className="cs-section-content">
            <h2 className="cs-section-heading">read about it</h2>
            <div className="cs-article-cards">
              <a
                href="https://whova.com/blog/icebreaker-conference-event-app/"
                target="_blank"
                rel="noreferrer"
                className="cs-article-card"
              >
                <img
                  src="https://whova.com/wp-content/uploads/2019/02/Whova-icebreaker-conference-e1549056979844.png"
                  alt="Break the Ice article"
                  className="cs-article-thumb"
                />
                <span className="cs-article-card-body">
                  <span className="cs-article-card-label">whova blog</span>
                  <span className="cs-article-card-title">How icebreakers help event attendees connect ↗</span>
                  <span className="cs-article-card-desc">A writeup on the Break the Ice feature and how it helps event attendees connect before and during events.</span>
                </span>
              </a>
              <a
                href="https://whova.com/blog/whova-wins-best-event-app-technology-2019/"
                target="_blank"
                rel="noreferrer"
                className="cs-article-card"
              >
                <img
                  src="https://whova.com/wp-content/uploads/2019/11/Cover-image_best-app-2019.png"
                  alt="Best event app 2019 article"
                  className="cs-article-thumb"
                />
                <span className="cs-article-card-body">
                  <span className="cs-article-card-label">whova blog</span>
                  <span className="cs-article-card-title">Whova wins best event app technology 2019 ↗</span>
                  <span className="cs-article-card-desc">Whova was named best event app of 2019, recognizing the full suite of features built during my time on the team.</span>
                </span>
              </a>
            </div>
          </div>
        </section>

      </div>

      {modalSrc && <ImageModal src={modalSrc} alt={modalAlt} onClose={closeModal} />}
    </>
  )
}

export default WhovaContent
