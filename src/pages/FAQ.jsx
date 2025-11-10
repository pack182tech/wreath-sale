import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getConfig } from '../utils/configLoader'
import './FAQ.css'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const config = getConfig()

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faq-container">
      <div className="faq-content">
        <Link to="/" className="back-to-home">← Back to Home</Link>

        {/* About Section */}
        <section className="about-section">
          <h1 className="about-title">About Our Holiday Sale</h1>
          <div className="about-text">
            <p>{config.content.aboutText}</p>
          </div>

          <div className="campaign-details">
            <div className="detail-card sale-period">
              <div className="card-icon">📅</div>
              <h3>Sale Period</h3>
              <p className="date-range">{config.campaign.startDate} - {config.campaign.endDate}</p>
            </div>
            <div className="detail-card pickup-info">
              <div className="card-icon">🎄</div>
              <h3>Pickup Information</h3>
              <div className="info-details">
                <p><span className="label">Date:</span> {config.campaign.pickupDate}</p>
                <p><span className="label">Time:</span> {config.campaign.pickupTime}</p>
                <p><span className="label">Location:</span> {config.campaign.pickupLocation}</p>
              </div>
            </div>
            <div className="detail-card contact-info">
              <div className="card-icon">📧</div>
              <h3>Contact Us</h3>
              <div className="info-details">
                <p><span className="label">Pack Leader:</span> {config.pack.leaderName}</p>
                <p><span className="label">Email:</span> <a href={`mailto:${config.pack.leaderEmail}`}>{config.pack.leaderEmail}</a></p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>{config.content.faqTitle}</h2>
          <div className="faq-list">
            {config.content.faq.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default FAQ
