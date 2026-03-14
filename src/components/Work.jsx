import './Work.css'

const borderPaths = [
  "M 13,3 C 45,1 65,2 87,4 C 94,4 97,7 97,13 C 99,45 100,65 97,87 C 97,93 94,97 87,97 C 55,99 35,98 13,97 C 6,97 3,93 3,87 C 1,55 0,35 3,13 C 3,7 6,3 13,3 Z",
  "M 15,4 C 42,2 62,3 85,5 C 93,5 96,8 96,15 C 98,42 99,62 96,85 C 96,93 93,96 85,96 C 58,99 38,97 15,96 C 7,96 4,93 4,85 C 2,58 1,38 4,15 C 4,8 7,4 15,4 Z",
  "M 12,5 C 40,2 60,3 88,6 C 95,6 96,9 97,12 C 99,42 100,60 97,88 C 97,94 94,97 88,97 C 60,100 38,99 12,97 C 5,97 3,94 3,88 C 0,60 1,40 3,12 C 3,9 5,5 12,5 Z",
]

const clipPaths = [
  "M 0.13,0.03 C 0.45,0.01 0.65,0.02 0.87,0.04 C 0.94,0.04 0.97,0.07 0.97,0.13 C 0.99,0.45 1.00,0.65 0.97,0.87 C 0.97,0.93 0.94,0.97 0.87,0.97 C 0.55,0.99 0.35,0.98 0.13,0.97 C 0.06,0.97 0.03,0.93 0.03,0.87 C 0.01,0.55 0.00,0.35 0.03,0.13 C 0.03,0.07 0.06,0.03 0.13,0.03 Z",
  "M 0.15,0.04 C 0.42,0.02 0.62,0.03 0.85,0.05 C 0.93,0.05 0.96,0.08 0.96,0.15 C 0.98,0.42 0.99,0.62 0.96,0.85 C 0.96,0.93 0.93,0.96 0.85,0.96 C 0.58,0.99 0.38,0.97 0.15,0.96 C 0.07,0.96 0.04,0.93 0.04,0.85 C 0.02,0.58 0.01,0.38 0.04,0.15 C 0.04,0.08 0.07,0.04 0.15,0.04 Z",
  "M 0.12,0.05 C 0.40,0.02 0.60,0.03 0.88,0.06 C 0.95,0.06 0.96,0.09 0.97,0.12 C 0.99,0.42 1.00,0.60 0.97,0.88 C 0.97,0.94 0.94,0.97 0.88,0.97 C 0.60,1.00 0.38,0.99 0.12,0.97 C 0.05,0.97 0.03,0.94 0.03,0.88 C 0.00,0.60 0.01,0.40 0.03,0.12 C 0.03,0.09 0.05,0.05 0.12,0.05 Z",
]

const projects = [
  {
    company: 'LinkedIn',
    title: 'Enterprise GTM & AI Agents',
    description: 'Shaping product vision for 0→1 enterprise AI workflows for GTM teams through design',
    tags: ['React', 'Design'],
    image: '/linkedin-logo.jpg',
  },
  {
    company: 'Netflix',
    title: 'Ask me live!',
    description: 'A capstone project exploring new in-app engagement opportunities, validated through research, prototyping, and a final presentation to their design team.',
    tags: ['Illustration', 'Branding'],
    image: '/netflix-logo.jpg',
  },
  {
    company: 'Whova',
    title: 'Break the ice',
    description: 'A low-pressure community feature that uses casual prompts to spark conversation, build event connection, and lift app engagement.',
    tags: ['Full Stack', 'Mobile'],
    image: '/whova-logo.png',
  },
];

function Work() {
  return (
    <div className="work">
      <div className="work-blob">
      <h2 className="work-heading reveal">Work</h2>
      <div className="work-grid">
        {projects.map((project, i) => (
          <div
            className="work-card reveal"
            key={i}
            style={{ position: 'relative', clipPath: `url(#card-clip-${i})` }}
          >
            <svg className="work-card-border" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <clipPath id={`card-clip-${i}`} clipPathUnits="objectBoundingBox">
                  <path d={clipPaths[i % clipPaths.length]} />
                </clipPath>
              </defs>
              <path d={borderPaths[i % borderPaths.length]} fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <div className="work-card-preview">
              {project.image && <img src={project.image} alt={project.title} className="work-card-preview-img" />}
            </div>
            <div className="work-card-body">
              {project.company && <p className="work-card-company">{project.company}</p>}
              <h3 className="work-card-title">{project.title}</h3>
              <p className="work-card-desc">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default Work
