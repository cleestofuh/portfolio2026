function AgentTeamContent() {
  return (
    <div className="cs-sections">

      <section className="cs-section cs-section--full" id="overview">
        <div className="cs-section-content">
          <h2 className="cs-section-heading">project overview</h2>
          <p className="cs-section-body">
            This is a multi-agent system designed to reimagine how designers on my team work, moving toward an AI-native workflow where agents and code close the gap between design and implementation. The goal is for designers to own the full outcome of the experience, not hand it off and hope the intent survives.
          </p>
          <p className="cs-section-body">
            The system connects to the design systems, theming, component patterns, and design principles the team already works within, so every output is grounded in the right foundations. Designers can start from a prompt, a PRD, or a Figma file and move through a full end-to-end workflow, or drop into a specific workflow that fits the needs of their project.
          </p>
        </div>
      </section>

      <section className="cs-section cs-section--full" id="architecture">
        <div className="cs-section-content">
          <h2 className="cs-section-heading">architecture</h2>
          <p className="cs-section-body">
            Built on Claude Code, the system is structured around an orchestrator agent that routes work to specialized agents based on the task. Each agent draws from a shared resource layer of design system documentation, design tokens, principles, and templates, so outputs stay consistent and aligned with the team's standards.
          </p>
          <div className="agent-tree">
            <div className="agent-tree-row agent-tree-root">
              <span className="agent-tree-icon">📁</span>
              <span className="agent-tree-name">ux-agent-teams/</span>
            </div>
            <div className="agent-tree-row">
              <span className="agent-tree-indent" />
              <span className="agent-tree-icon">📄</span>
              <span className="agent-tree-name">orchestrator.md</span>
            </div>
            <div className="agent-tree-row agent-tree-folder">
              <span className="agent-tree-indent" />
              <span className="agent-tree-icon">📁</span>
              <span className="agent-tree-name">agents/</span>
            </div>
            {['research.md', 'planning.md', 'ux-design.md', 'ideation.md', 'prototyping.md', 'usecase-walkthrough.md', 'accessibility.md'].map(name => (
              <div className="agent-tree-row" key={name}>
                <span className="agent-tree-indent agent-tree-indent--2" />
                <span className="agent-tree-icon">📄</span>
                <span className="agent-tree-name">{name}</span>
              </div>
            ))}
            <div className="agent-tree-row agent-tree-folder">
              <span className="agent-tree-indent" />
              <span className="agent-tree-icon">📁</span>
              <span className="agent-tree-name">resources/</span>
            </div>
            {[
              { folder: 'design-systems/', files: ['component-library.md', 'usage-guidelines.md'] },
              { folder: 'design-tokens/', files: ['color.md', 'typography.md', 'spacing.md', 'motion.md'] },
              { folder: 'principles/', files: ['component-usage.md', 'token-application.md', 'design-principles.md'] },
              { folder: 'templates/', files: ['research-brief.md', 'ux-spec.md', 'prototype-brief.md', 'accessibility-checklist.md', 'ideation-workshop.md', 'usecase-walkthrough.md'] },
            ].map(({ folder, files }) => (
              <div key={folder}>
                <div className="agent-tree-row agent-tree-folder">
                  <span className="agent-tree-indent agent-tree-indent--2" />
                  <span className="agent-tree-icon">📁</span>
                  <span className="agent-tree-name">{folder}</span>
                </div>
                {files.map(name => (
                  <div className="agent-tree-row" key={name}>
                    <span className="agent-tree-indent agent-tree-indent--3" />
                    <span className="agent-tree-icon">📄</span>
                    <span className="agent-tree-name">{name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-section cs-section--full" id="capabilities">
        <div className="cs-section-content">
          <h2 className="cs-section-heading">what it does</h2>
          <p className="cs-section-body">
            The workflow follows how designers actually work, but is built flexibly enough that they can start anywhere in the process depending on the needs of the project. For a net new experience, that might mean starting at research and problem framing. For a feature with a clear brief already in place, a designer might jump straight into ideation or prototyping.
          </p>
          <p className="cs-section-body">
            When starting from the beginning, agents evaluate prompts and PRDs to surface context, identify edge cases, and ensure the problem is well understood before any design decisions are made. From there, designers move through planning and ideation, exploring the solution space before committing to a direction. Once a direction is established, the workflow supports UX design and prototyping in code, giving designers direct ownership over how the experience is built and reducing what gets lost in handoff.
          </p>
          <p className="cs-section-body">
            The process closes with a validation and refinement workflow anchored by use case walkthrough templates, helping designers pressure-test their work against real scenarios the team has agreed to design for. Throughout all of it, checkpoints are placed at meaningful moments to promote clarity, context, and design thinking, keeping quality at the center rather than speed.
          </p>
        </div>
      </section>

      <section className="cs-section cs-section--full" id="status">
        <div className="cs-section-content">
          <h2 className="cs-section-heading">status</h2>
          <p className="cs-section-body">
            Actively building. If you want to hear more about the design decisions behind the system or where it's headed, I'd love to walk you through it.
          </p>
          <a href="/#contact" className="cs-pdf-link">get in touch →</a>
        </div>
      </section>

    </div>
  )
}

export default AgentTeamContent
