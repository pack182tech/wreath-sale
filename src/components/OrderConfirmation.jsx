import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import EmailModal from './EmailModal'
import { getConfig } from '../utils/configLoader'
import { getScouts } from '../utils/mockData'
import './OrderConfirmation.css'

function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const order = location.state?.order
  const config = getConfig()

  useEffect(() => {
    if (!order) {
      // Preserve scout parameter when redirecting
      const scoutSlug = searchParams.get('scout')
      navigate(scoutSlug ? `/?scout=${scoutSlug}` : '/')
      return
    }
    // Show email modal automatically
    setShowEmailModal(true)
  }, [order, navigate, searchParams])

  if (!order) {
    return null
  }

  // Get scout info if applicable
  const getScoutInfo = () => {
    if (!order.scoutId) return { scoutName: null, scoutFirstName: null }
    const scouts = getScouts()
    const scout = scouts.find(s => s.id === order.scoutId)
    if (!scout) return { scoutName: null, scoutFirstName: null }
    return {
      scoutName: scout.name,
      scoutFirstName: scout.name.split(' ')[0]
    }
  }

  const scoutInfo = getScoutInfo()

  // Build order items table HTML
  const orderItemsTable = order.items.map(item => `
    <tr>
      <td style="padding: 0.5rem; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: center;">x${item.quantity}</td>
      <td style="padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  // Get email template
  const template = config.emailTemplates?.orderConfirmation || {}

  // Replace placeholders in subject
  let subject = template.subject || 'Order Confirmation - {{orderId}}'
  subject = subject.replace(/\{\{orderId\}\}/g, order.orderId)

  // Replace placeholders in body
  let body = template.htmlBody || ''
  body = body
    .replace(/\{\{customerName\}\}/g, order.customer.name)
    .replace(/\{\{orderId\}\}/g, order.orderId)
    .replace(/\{\{orderDate\}\}/g, new Date(order.orderDate).toLocaleDateString())
    .replace(/\{\{total\}\}/g, order.total.toFixed(2))
    .replace(/\{\{orderItemsTable\}\}/g, orderItemsTable)
    .replace(/\{\{pickupDate\}\}/g, config.campaign.pickupDate)
    .replace(/\{\{pickupTime\}\}/g, config.campaign.pickupTime)
    .replace(/\{\{pickupLocation\}\}/g, config.campaign.pickupLocation)
    .replace(/\{\{zelleRecipientFirstName\}\}/g, config.zelle.recipientFirstName || 'Boy Scouts')
    .replace(/\{\{zelleRecipientLastName\}\}/g, config.zelle.recipientLastName || 'of America')
    .replace(/\{\{zelleContact\}\}/g, config.zelle.recipientContact)
    .replace(/\{\{leaderEmail\}\}/g, config.pack.leaderEmail)
    .replace(/\{\{packName\}\}/g, config.pack.name)
    .replace(/\{\{scoutName\}\}/g, scoutInfo.scoutName || '')
    .replace(/\{\{scoutFirstName\}\}/g, scoutInfo.scoutFirstName || '')
    .replace(/\{\{donationRecipient\}\}/g, config.donation?.recipient || '')

  // Handle conditional blocks for isDonation
  if (order.isDonation) {
    body = body.replace(/\{\{#if isDonation\}\}/g, '').replace(/\{\{\/if\}\}/g, '')
  } else {
    body = body.replace(/\{\{#if isDonation\}\}[\s\S]*?\{\{\/if\}\}/g, '')
  }

  // Handle conditional blocks for scoutName
  if (scoutInfo.scoutName) {
    body = body.replace(/\{\{#if scoutName\}\}/g, '').replace(/\{\{\/if\}\}/g, '')
  } else {
    body = body.replace(/\{\{#if scoutName\}\}[\s\S]*?\{\{\/if\}\}/g, '')
  }

  const emailContent = {
    to: order.customer.email,
    subject: subject,
    body: body
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="confirmation-subtitle">
          Thank you for your order, {order.customer.name}!
        </p>

        <div className="order-number-box">
          <p>Your Order Number</p>
          <h2>{order.orderId}</h2>
        </div>

        <div className="confirmation-details">
          <div className="detail-section">
            <h3>Order Summary</h3>
            <div className="order-items-list">
              {order.items.map(item => (
                <div key={item.id} className="confirmation-item">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="confirmation-total">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="detail-section payment-section">
            <h3>Next Steps - Payment</h3>
            <p>Please send your payment via Zelle:</p>
            <div className="zelle-info">
              <p><strong>First name:</strong> {config.zelle.recipientFirstName}</p>
              <p><strong>Last name:</strong> {config.zelle.recipientLastName}</p>
              <p><strong>Email:</strong> {config.zelle.recipientContact}</p>
              <p><strong>Amount:</strong> ${order.total.toFixed(2)}</p>
              <p className="memo-reminder">
                <strong>Important:</strong> Include order number <code style={{ fontSize: '200%' }}>{order.orderId}</code> in memo
              </p>
            </div>
            <div className="zelle-qr-code">
              <p><strong>{config.zelle.qrCodeText || 'Scan to Pay'}</strong></p>
              <img
                src={`${import.meta.env.BASE_URL}images/zelle/${config.zelle.qrCodeImage}`}
                alt="Zelle QR Code"
                className="qr-code-image"
              />
            </div>
          </div>

          <div className="detail-section">
            <h3>Pickup Information</h3>
            <p><strong>Date:</strong> {config.campaign.pickupDate}</p>
            <p><strong>Time:</strong> {config.campaign.pickupTime}</p>
            <p><strong>Location:</strong> {config.campaign.pickupLocation}</p>
          </div>

          {scoutInfo.scoutName && (
            <div className="scout-thank-you">
              🎗️ Thank you for supporting {scoutInfo.scoutName}!
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <button className="btn btn-primary" onClick={() => {
            const scoutSlug = searchParams.get('scout')
            navigate(scoutSlug ? `/?scout=${scoutSlug}` : '/')
          }}>
            Return to Home
          </button>
          <button className="btn btn-secondary" onClick={() => setShowEmailModal(true)}>
            View Confirmation Email
          </button>
        </div>
      </div>

      {showEmailModal && (
        <EmailModal
          email={emailContent}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  )
}

export default OrderConfirmation
