import { useEffect } from 'react'
import './VideoModal.css'

function VideoModal({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <video
        className="video-modal-video"
        src={src}
        controls
        autoPlay
        loop
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default VideoModal
