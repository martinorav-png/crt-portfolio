import { useEffect } from 'react'

/**
 * Terminal-styled modal for viewing gallery items.
 * Press Escape or click outside to close.
 */
export default function GalleryModal({ item, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!item) return null

  const isVideo = item.image_url?.endsWith('.mp4') || item.image_url?.endsWith('.webm')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-header__title">
            FILE://{item.title?.toUpperCase().replace(/ /g, '_')}
          </span>
          <button className="modal-close" onClick={onClose}>[CLOSE]</button>
        </div>
        <div className="modal-body">
          {isVideo ? (
            <video src={item.image_url} controls autoPlay loop />
          ) : (
            <img src={item.image_url} alt={item.title} />
          )}
          {item.description && (
            <p className="modal-description">{item.description}</p>
          )}
          {item.client && (
            <p className="modal-description">CLIENT: {item.client}</p>
          )}
        </div>
      </div>
    </div>
  )
}