import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { getConfig } from '../utils/configLoader'
import './Checkout.css'

function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const config = getConfig()
  const basePath = import.meta.env.BASE_URL

  // Check if user wants to donate from popup response
  const wantsToDonate = sessionStorage.getItem('wantsToDonate') === 'true'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    supportingScout: '',
    comments: ''
  })
  const [isDonating, setIsDonating] = useState(wantsToDonate)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    // Map specialComments back to comments for state
    const fieldName = name === 'specialComments' ? 'comments' : name
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Get scout attribution from sessionStorage
    const scoutAttribution = sessionStorage.getItem('scoutAttribution')

    // Create order object
    const order = {
      orderId: String(Date.now()).slice(-6),
      customer: formData,
      items: cart,
      total: getCartTotal(),
      scoutId: scoutAttribution || null,
      isDonation: isDonating,
      orderDate: new Date().toISOString(),
      paymentStatus: 'pending'
    }

    // Store order in localStorage (would be sent to backend)
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('orders', JSON.stringify(existingOrders))

    // Clear cart
    clearCart()

    // Navigate to confirmation
    navigate('/confirmation', { state: { order } })
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const scoutName = sessionStorage.getItem('scoutName')

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <div className="checkout-form-section">
            <h2>Contact Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              {!scoutName && (
                <div className="form-group">
                  <label htmlFor="supportingScout">If you're supporting a specific Scout, let us know who</label>
                  <input
                    type="text"
                    id="supportingScout"
                    name="supportingScout"
                    value={formData.supportingScout}
                    onChange={handleChange}
                    placeholder="Enter scout's name"
                    autoComplete="off"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="comments">Special Requests or Comments</label>
                <textarea
                  id="comments"
                  name="specialComments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows="4"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                />
              </div>

              {config.donation?.enabled && (
                <div className="form-group donation-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isDonating}
                      onChange={(e) => setIsDonating(e.target.checked)}
                    />
                    <span>Donate my purchase to {config.donation.recipient}</span>
                  </label>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-submit-order">
                Place Order
              </button>
            </form>
          </div>

          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <span>Total:</span>
              <span className="total-amount">${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="payment-info">
              <h3>Payment Instructions</h3>
              <p>Please pay via Zelle after placing your order:</p>
              <div className="zelle-details">
                <p><strong>Recipient:</strong> {config.zelle.recipientFirstName} {config.zelle.recipientLastName}</p>
                <p><strong>Email:</strong> {config.zelle.recipientContact}</p>
                <p>{config.zelle.instructions}</p>
              </div>
              {config.zelle.qrCodeImage && (
                <div className="zelle-qr-code">
                  <p><strong>{config.zelle.qrCodeText || 'Scan to Pay'}</strong></p>
                  <img
                    src={`${basePath}images/zelle/${config.zelle.qrCodeImage}`}
                    alt="Zelle QR Code"
                    className="qr-code-image"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
