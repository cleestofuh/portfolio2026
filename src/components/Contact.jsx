import { useState } from 'react'
import './Contact.css'

// Paths designed for ~560x50 (input) — viewBox "0 0 560 50", corner radius ~10
const inputBorder = "M 11,3 C 200,1 360,2 549,4 C 555,4 557,6 557,11 C 559,25 559,33 557,39 C 557,44 555,47 549,47 C 360,49 200,48 11,47 C 5,47 3,44 3,39 C 1,33 1,25 3,11 C 3,6 5,3 11,3 Z"
const inputClip   = "M 0.020,0.060 C 0.357,0.020 0.643,0.040 0.980,0.080 C 0.991,0.080 0.995,0.120 0.995,0.220 C 0.998,0.500 0.998,0.660 0.995,0.780 C 0.995,0.880 0.991,0.940 0.980,0.940 C 0.643,0.980 0.357,0.960 0.020,0.940 C 0.009,0.940 0.005,0.880 0.005,0.780 C 0.002,0.660 0.002,0.500 0.005,0.220 C 0.005,0.120 0.009,0.080 0.020,0.080 Z"

// Paths designed for ~560x140 (textarea) — viewBox "0 0 560 140", corner radius ~12
const textareaBorder = "M 11,5 C 200,2 360,3 549,6 C 555,6 558,9 558,14 C 561,55 562,92 558,126 C 558,132 555,135 549,135 C 360,138 200,137 11,135 C 5,135 2,132 2,126 C -1,92 0,55 2,14 C 2,9 5,5 11,5 Z"
const textareaClip   = "M 0.020,0.036 C 0.357,0.014 0.643,0.021 0.980,0.043 C 0.991,0.043 0.996,0.064 0.996,0.100 C 1.002,0.393 1.004,0.657 0.996,0.900 C 0.996,0.943 0.991,0.964 0.980,0.964 C 0.643,0.986 0.357,0.979 0.020,0.964 C 0.009,0.964 0.004,0.943 0.004,0.900 C -0.002,0.657 0.000,0.393 0.004,0.100 C 0.004,0.064 0.009,0.036 0.020,0.036 Z"

function FieldWrap({ id, viewBox, borderPath, clipPath, children }) {
  const clipId = `field-clip-${id}`
  return (
    <div className="contact-field-wrap" style={{ clipPath: `url(#${clipId})` }}>
      <svg className="contact-field-border" viewBox={viewBox} preserveAspectRatio="none">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={clipPath} />
          </clipPath>
        </defs>
        <path d={borderPath} fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {children}
    </div>
  )
}

function Contact() {
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
    <div className="contact">
      <img src="/grass 1.svg" alt="" className="contact-grass contact-grass--1" />
      <img src="/grass 2.svg" alt="" className="contact-grass contact-grass--2" />
      <img src="/grass 3.svg" alt="" className="contact-grass contact-grass--3" />
      <img src="/grass 4.svg" alt="" className="contact-grass contact-grass--4" />
      <img src="/grass 5.svg" alt="" className="contact-grass contact-grass--5" />
      <img src="/grass 1.svg" alt="" className="contact-grass contact-grass--6" />
      <img src="/grass 3.svg" alt="" className="contact-grass contact-grass--7" />
      <div className="contact-inner">
        <h2 className="contact-heading reveal">Get in touch</h2>
        <form className="contact-form reveal" onSubmit={handleSubmit}>
          <FieldWrap id="email" viewBox="0 0 560 50" borderPath={inputBorder} clipPath={inputClip}>
            <input
              className="contact-input"
              type="email"
              name="email"
              placeholder="your email"
              required
            />
          </FieldWrap>
          <FieldWrap id="msg" viewBox="0 0 560 140" borderPath={textareaBorder} clipPath={textareaClip}>
            <textarea
              className="contact-textarea"
              name="message"
              placeholder="your message"
              rows={5}
              required
            />
          </FieldWrap>
          <button className="contact-btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'sending…' : 'send'}
          </button>
          {status === 'success' && <p className="contact-feedback contact-feedback--ok">Message sent!</p>}
          {status === 'error' && <p className="contact-feedback contact-feedback--err">Something went wrong. Try again.</p>}
        </form>
      </div>
    </div>
  )
}

export default Contact
