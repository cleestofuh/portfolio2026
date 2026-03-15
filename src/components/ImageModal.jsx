import { useEffect } from 'react'
import './ImageModal.css'

function ImageModal({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <img
        src={src}
        alt={alt}
        className="image-modal-img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default ImageModal
