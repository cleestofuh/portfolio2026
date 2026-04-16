import { Link } from 'react-router-dom'
import DraggableFrame from './DraggableFrame'

const projects = [
  {
    slug: 'linkedin',
    company: 'LinkedIn',
    title: 'Enterprise GTM & AI Agents',
    description: 'Shaping product vision for 0→1 enterprise AI workflows for GTM teams through design',
    image: '/linkedin-logo.jpg',
  },
  {
    slug: 'agent-team',
    company: 'LinkedIn',
    title: 'AI-Native Design Workflow',
    description: 'Reimagining the design workflow through agents and code, closing the gap between design handoff and implementation.',
    image: '/agents.png',
  },
  {
    slug: 'netflix',
    company: 'Netflix',
    title: 'Ask me live!',
    description: 'A capstone project exploring new in-app engagement opportunities, validated through research, prototyping, and a final presentation to their design team.',
    image: '/netflix-logo.jpg',
  },
  {
    slug: 'whova',
    company: 'Whova',
    title: 'Break the ice',
    description: 'A low-pressure community feature that uses casual prompts to spark conversation, build event connection, and lift app engagement.',
    image: '/whova-logo.png',
  },
]

function GridWork() {
  return (
    <div className="grid-work">
      <DraggableFrame className="grid-work-frame" frameLabel="Work">
        <div className="grid-work-cards">
          {projects.map((p) => (
            <DraggableFrame key={p.slug} className="grid-work-card" frameLabel={`${p.company} / ${p.title}`} noResize>
              <div className="grid-card-preview">
                {p.image && <img src={p.image} alt={p.title} className="grid-card-img" />}
              </div>
              <div className="grid-card-body">
                <p className="grid-card-company">{p.company}</p>
                <h3 className="grid-card-title">{p.title}</h3>
                <p className="grid-card-desc">{p.description}</p>
                <Link to={`/work/${p.slug}`} className="grid-card-link">View more &rarr;</Link>
              </div>
              <span className="grid-dimension grid-dimension--card">360 &times; 420</span>
            </DraggableFrame>
          ))}
        </div>
      </DraggableFrame>
    </div>
  )
}

export default GridWork
