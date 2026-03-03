import './Work.css'

const projects = [
  {
    title: 'Project One',
    description: 'A brief description of this project and what it involved.',
    tags: ['React', 'Design'],
  },
  {
    title: 'Project Two',
    description: 'A brief description of this project and what it involved.',
    tags: ['Illustration', 'Branding'],
  },
  {
    title: 'Project Three',
    description: 'A brief description of this project and what it involved.',
    tags: ['Full Stack', 'Mobile'],
  },
];

function Work() {
  return (
    <div className="work">
      <h2 className="work-heading">work</h2>
      <div className="work-grid">
        {projects.map((project, i) => (
          <div className="work-card" key={i}>
            <div className="work-card-preview" />
            <h3 className="work-card-title">{project.title}</h3>
            <p className="work-card-desc">{project.description}</p>
            <div className="work-card-tags">
              {project.tags.map((tag) => (
                <span className="work-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Work
