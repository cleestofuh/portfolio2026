import DraggableFrame from './DraggableFrame'

function GridBlurb() {
  return (
    <div className="grid-about">
      <DraggableFrame className="grid-about-frame grid-about-frame--simple" frameLabel="About">
        <div className="grid-about-content">
          <p className="grid-about-text">
            I'm a product designer who cares about people, thinks in systems, sweats the details, and believes even complex workflows deserve a bit of delight.
          </p>
          <p className="grid-about-text grid-about-text--secondary">
            Designing agentic data experiences at Roblox.
          </p>
        </div>
      </DraggableFrame>
    </div>
  )
}

export default GridBlurb
