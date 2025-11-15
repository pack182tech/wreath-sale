import { useState, useEffect } from 'react'
import './ScoutNotFoundModal.css'

function ScoutNotFoundModal({ show, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
    }
  }, [show])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for fade out animation
  }

  if (!show) return null

  return (
    <div className={`scout-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`scout-modal ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="scout-modal-header">
          <h2>🎯 Scout Link</h2>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="scout-modal-body">
          <p className="modal-message">
            We couldn't find the specific scout associated with this link, but that's okay!
          </p>
          <p className="modal-reassurance">
            <strong>You can still place your order.</strong> We'll make sure the correct scout gets credited at pickup.
          </p>
        </div>

        <div className="scout-modal-footer">
          <button className="btn btn-primary" onClick={handleClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScoutNotFoundModal
