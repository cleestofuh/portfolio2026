import { useState } from 'react'
import DraggableFrame from './DraggableFrame'

function GridContact() {
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const form = e.target
    const data = new FormData(form)
    try {
      const res = await fetch('https://formspree.io/f/xwvrqree', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="grid-contact">
      <DraggableFrame className="grid-contact-frame" frameLabel="Contact">
        <div className="grid-contact-header">
          <h2 className="grid-contact-heading">Get in touch</h2>
          <span className="grid-contact-note">Fill in the fields below or reach out directly.</span>
        </div>
        <form className="grid-contact-form" onSubmit={handleSubmit}>
          <div className="grid-input-group">
            <label className="grid-input-label" htmlFor="grid-email">Email</label>
            <input
              className="grid-input"
              type="email"
              id="grid-email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="grid-input-group">
            <label className="grid-input-label" htmlFor="grid-message">Message</label>
            <textarea
              className="grid-input grid-textarea"
              id="grid-message"
              name="message"
              placeholder="What's on your mind?"
              rows={5}
              required
            />
          </div>
          <button className="grid-submit-btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send'}
          </button>
          {status === 'success' && <p className="grid-feedback grid-feedback--ok">Message sent!</p>}
          {status === 'error' && <p className="grid-feedback grid-feedback--err">Something went wrong. Try again.</p>}
        </form>
      </DraggableFrame>
    </div>
  )
}

export default GridContact
