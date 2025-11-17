import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getConfigSync } from '../utils/configLoader'
import './OrderConfirmation.css'

function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // PRODUCTION: Emails are sent server-side, no modal display needed
  const order = location.state?.order
  const config = getConfigSync()

  useEffect(() => {
    if (!order) {
      // Preserve scout parameter when redirecting
      const scoutSlug = searchParams.get('scout')
      navigate(scoutSlug ? `/?scout=${scoutSlug}` : '/')
      return
    }
    // PRODUCTION: Email sent server-side when order is created
  }, [order, navigate, searchParams])

  if (!order) {
    return null
  }

  // PRODUCTION: Email template rendering removed - emails are sent server-side
  // All email logic is now in APPS_SCRIPT_BACKEND.js

  // Get scout name from session storage if available
  const scoutName = sessionStorage.getItem('scoutName')

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

          {scoutName && (
            <div className="scout-thank-you">
              🎗️ Thank you for supporting {scoutName}!
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <button className="btn btn-primary" onClick={() => {
            const scoutSlug = searchParams.get('scout')
            navigate(scoutSlug ? `/?scout=${scoutSlug}` : '/')
          }}>
            Go Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
