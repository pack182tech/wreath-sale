import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import EmailModal from './EmailModal'
import './OrderConfirmation.css'
import config from '../config/content.json'

function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const order = location.state?.order

  useEffect(() => {
    if (!order) {
      navigate('/')
      return
    }
    // Show email modal automatically
    setShowEmailModal(true)
  }, [order, navigate])

  if (!order) {
    return null
  }

  const emailContent = {
    to: order.customer.email,
    subject: `Order Confirmation - ${order.orderId}`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a472a;">Order Confirmation</h2>
        <p>Dear ${order.customer.name},</p>
        <p>Thank you for your order! Your order has been received and will be ready for pickup on <strong>${config.campaign.pickupDate}</strong>.</p>

        <h3 style="color: #1a472a; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderId}</p>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>

        <h3 style="color: #1a472a; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${order.items.map(item => `
            <tr>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: center;">x${item.quantity}</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="2" style="padding: 1rem 0.5rem; font-weight: bold;">Total:</td>
            <td style="padding: 1rem 0.5rem; text-align: right; font-weight: bold; color: #c41e3a; font-size: 1.2rem;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>

        <h3 style="color: #1a472a; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem; margin-top: 2rem;">Payment Instructions</h3>
        <p>Please send payment via Zelle to complete your order:</p>
        <div style="background: #fffbeb; padding: 1rem; border-left: 4px solid #d4af37; border-radius: 4px;">
          <p style="margin: 0.5rem 0;"><strong>Recipient:</strong> Boy Scouts of America</p>
          <p style="margin: 0.5rem 0;"><strong>Email/Phone:</strong> ${config.zelle.recipientContact}</p>
          <p style="margin: 0.5rem 0;"><strong>Memo:</strong> ${order.orderId}</p>
        </div>
        <p style="color: #c41e3a; font-weight: bold;">Important: Please include your order number (${order.orderId}) in the Zelle memo field.</p>

        <h3 style="color: #1a472a; border-bottom: 2px solid #d4af37; padding-bottom: 0.5rem; margin-top: 2rem;">Pickup Information</h3>
        <p><strong>Date:</strong> ${config.campaign.pickupDate}</p>
        <p><strong>Time:</strong> ${config.campaign.pickupTime}</p>
        <p><strong>Location:</strong> ${config.campaign.pickupLocation}</p>

        ${order.scoutId ? '<p style="margin-top: 2rem; padding: 1rem; background: #f0f9ff; border-radius: 4px;">🎗️ Thank you for supporting our Cub Scout!</p>' : ''}

        <p style="margin-top: 2rem;">If you have any questions, please contact us at ${config.pack.leaderEmail}.</p>
        <p>Thank you for supporting ${config.pack.name}!</p>
      </div>
    `
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
              <p><strong>Recipient:</strong> Boy Scouts of America</p>
              <p><strong>Email:</strong> {config.zelle.recipientContact}</p>
              <p><strong>Amount:</strong> ${order.total.toFixed(2)}</p>
              <p className="memo-reminder">
                <strong>Important:</strong> Include order number <code>{order.orderId}</code> in memo
              </p>
            </div>
          </div>

          <div className="detail-section">
            <h3>Pickup Information</h3>
            <p><strong>Date:</strong> {config.campaign.pickupDate}</p>
            <p><strong>Time:</strong> {config.campaign.pickupTime}</p>
            <p><strong>Location:</strong> {config.campaign.pickupLocation}</p>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
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
