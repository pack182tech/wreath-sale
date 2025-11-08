import './EmailModal.css'

function EmailModal({ email, onClose }) {
  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div className="email-modal" onClick={(e) => e.stopPropagation()}>
        <div className="email-modal-header">
          <h2>Email Preview</h2>
          <p className="email-note">This email would have been sent in production</p>
          <button className="email-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="email-modal-meta">
          <div className="email-meta-row">
            <strong>To:</strong> {email.to}
          </div>
          <div className="email-meta-row">
            <strong>Subject:</strong> {email.subject}
          </div>
        </div>

        <div className="email-modal-body">
          <div dangerouslySetInnerHTML={{ __html: email.body }} />
        </div>

        <div className="email-modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailModal
