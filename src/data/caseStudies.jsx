import LinkedInContent from '../case-studies/LinkedInContent'
import NetflixContent from '../case-studies/NetflixContent'
import WhovaContent from '../case-studies/WhovaContent'
import AgentTeamContent from '../case-studies/AgentTeamContent'

const caseStudies = {
  linkedin: {
    slug: 'linkedin',
    company: 'LinkedIn',
    title: 'Enterprise GTM & AI Agents',
    tagline: 'Shaping product vision for 0→1 enterprise AI workflows for GTM teams through design.',
    image: '/linkedin-logo.jpg',
    heroImage: '/linkedin/glass-pane.png',
    Content: LinkedInContent,
  },

  'agent-team': {
    slug: 'agent-team',
    company: 'LinkedIn',
    title: 'AI-Native Design Workflow',
    tagline: 'Reimagining the design workflow through agents and code, closing the gap between design handoff and implementation to own the full outcome of the experience.',
    image: '/agents.png',
    Content: AgentTeamContent,
  },

  netflix: {
    slug: 'netflix',
    company: 'Netflix',
    title: 'Ask Me Live!',
    tagline: 'A Q&A platform that brings Netflix fans closer to the talent behind their favorite shows — designed, validated, and presented to the Netflix design team as a capstone project.',
    role: 'Design Lead, Project Manager, UX Researcher',
    timeline: '6-months (part time)',
    methods: 'UX Research, Journey mapping, Competitive analysis, Crazy 8s, Interaction Design',
    image: '/netflix-logo.jpg',
    heroImage: '/netflix/nf-title.jpg',
    impactBlurb: <>Our research findings were incorporated into Netflix's user engagement initiatives ahead of the launch of <a href="https://www.tudum.com" target="_blank" rel="noreferrer" className="cs-inline-link">Tudum</a>, their official fan destination for exclusive news and talent Q&As.</>,
    Content: NetflixContent,
  },

  whova: {
    slug: 'whova',
    company: 'Whova',
    title: 'Break the ice',
    tagline: 'A low-pressure community feature that uses casual prompts to spark conversation, build event connection, and lift app engagement.',
    role: 'Lead Designer',
    timeline: '2 weeks',
    methods: 'Competitive analysis, Rapid prototyping, Usability testing, Interaction Design',
    image: '/whova-logo.png',
    heroImage: '/whova/final-design.png',
    impactBlurb: 'The feature shipped and drove a significant increase in the App Engagement Score, validating that a low-friction, personality-driven entry point could meaningfully shift participation behavior in short-lived event communities.',
    Content: WhovaContent,
  },
}

export default caseStudies
