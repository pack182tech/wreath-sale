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
          <h1>About Our Holiday Sale</h1>
          <div className="about-text">
            <p>{config.content.aboutText}</p>
          </div>

          <div className="campaign-details">
            <div className="detail-card">
              <h3>Sale Period</h3>
              <p>{config.campaign.startDate} - {config.campaign.endDate}</p>
            </div>
            <div className="detail-card">
              <h3>Pickup Information</h3>
              <p><strong>Date:</strong> {config.campaign.pickupDate}</p>
              <p><strong>Time:</strong> {config.campaign.pickupTime}</p>
              <p><strong>Location:</strong> {config.campaign.pickupLocation}</p>
            </div>
            <div className="detail-card">
              <h3>Contact Us</h3>
              <p><strong>Pack Leader:</strong> {config.pack.leaderName}</p>
              <p><strong>Email:</strong> {config.pack.leaderEmail}</p>
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

        {/* Donation Section */}
        {config.donation.enabled && (
          <section className="donation-section">
            <h2>Support Our Community</h2>
            <p>{config.donation.description}</p>
            <div className="donation-recipient">
              <p><strong>Recipient Organization:</strong> {config.donation.recipient}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default FAQ
