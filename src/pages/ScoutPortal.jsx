import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getScouts, getOrders, saveOrder } from '../utils/mockData'
import { getConfig } from '../utils/configLoader'
import './ScoutPortal.css'

function ScoutPortal() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scout, setScout] = useState(null)
  const config = getConfig()
  const [stats, setStats] = useState({ revenue: 0, units: 0, orderCount: 0 })
  const [orders, setOrders] = useState([])
  const [showOfflineSaleForm, setShowOfflineSaleForm] = useState(false)
  const [offlineFormData, setOfflineFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: []
  })

  useEffect(() => {
    // Find the scout associated with this user
    const scouts = getScouts()
    const userScout = scouts.find(s => s.email === user.email)

    if (userScout) {
      setScout(userScout)
      loadScoutData(userScout.id)
    }
  }, [user])

  const loadScoutData = (scoutId) => {
    const allOrders = getOrders()
    const scoutOrders = allOrders.filter(order => order.scoutId === scoutId)

    const revenue = scoutOrders.reduce((sum, order) => sum + order.total, 0)
    const units = scoutOrders.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    )

    setStats({
      revenue,
      units,
      orderCount: scoutOrders.length
    })
    setOrders(scoutOrders)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getScoutUrl = () => {
    if (!scout) return ''
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '')
    return `${baseUrl}?scout=${scout.slug}`
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Link copied to clipboard!')
  }

  const handleAddProduct = () => {
    setOfflineFormData({
      ...offlineFormData,
      items: [...offlineFormData.items, { productId: '', quantity: 1 }]
    })
  }

  const handleRemoveProduct = (index) => {
    const newItems = offlineFormData.items.filter((_, i) => i !== index)
    setOfflineFormData({ ...offlineFormData, items: newItems })
  }

  const handleProductChange = (index, field, value) => {
    const newItems = [...offlineFormData.items]
    newItems[index][field] = value
    setOfflineFormData({ ...offlineFormData, items: newItems })
  }

  const handleSubmitOfflineSale = (e) => {
    e.preventDefault()

    if (offlineFormData.items.length === 0) {
      alert('Please add at least one product')
      return
    }

    // Build order items with product details
    const orderItems = offlineFormData.items.map(item => {
      const product = config.products.find(p => p.id === item.productId)
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: parseInt(item.quantity)
      }
    })

    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const order = {
      orderId: `ORD-${String(Date.now()).slice(-6)}`,
      scoutId: scout.id,
      customer: {
        name: offlineFormData.customerName,
        email: offlineFormData.customerEmail,
        phone: offlineFormData.customerPhone
      },
      items: orderItems,
      total,
      status: 'pending',
      type: 'offline',
      createdAt: new Date().toISOString()
    }

    saveOrder(order)

    // Reset form
    setOfflineFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      items: []
    })
    setShowOfflineSaleForm(false)

    // Reload data
    loadScoutData(scout.id)

    alert('Offline sale recorded successfully!')
  }

  if (!scout) {
    return (
      <div className="scout-portal-container">
        <div className="scout-portal-content">
          <h1>Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="scout-portal-container">
      <div className="scout-portal-content">
        <div className="portal-header">
          <div>
            <h1>Welcome, {scout.name}!</h1>
            <p className="scout-rank-display">{scout.rank}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        {/* Stats Dashboard */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">${stats.revenue.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{stats.units}</div>
            <div className="stat-label">Units Sold</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{stats.orderCount}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        {/* Unique Scout Link */}
        <div className="scout-link-section">
          <h2>Your Unique Sales Link</h2>
          <p>Share this link to get credit for online orders:</p>
          <div className="link-display">
            <input
              type="text"
              value={getScoutUrl()}
              readOnly
              className="link-input"
            />
            <button
              onClick={() => copyToClipboard(getScoutUrl())}
              className="btn btn-primary"
            >
              Copy Link
            </button>
          </div>
          <p className="link-hint">
            When customers use your link, you'll automatically get credit for the sale!
          </p>

          <div className="qr-code-section">
            <h3>Or Share This QR Code</h3>
            <p>Customers can scan this code with their phone camera to visit your link:</p>
            <div className="qr-code-display">
              <QRCodeSVG
                value={getScoutUrl()}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-hint">
              Print this QR code and share it with friends, family, and neighbors!
            </p>
          </div>
        </div>

        {/* Offline Sales */}
        <div className="offline-sales-section">
          <div className="section-header">
            <h2>Record Offline Sales</h2>
            <button
              onClick={() => setShowOfflineSaleForm(!showOfflineSaleForm)}
              className="btn btn-primary"
            >
              {showOfflineSaleForm ? 'Cancel' : '+ Add Offline Sale'}
            </button>
          </div>

          {showOfflineSaleForm && (
            <form onSubmit={handleSubmitOfflineSale} className="offline-sale-form">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={offlineFormData.customerName}
                  onChange={(e) => setOfflineFormData({...offlineFormData, customerName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Customer Email</label>
                <input
                  type="email"
                  value={offlineFormData.customerEmail}
                  onChange={(e) => setOfflineFormData({...offlineFormData, customerEmail: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Customer Phone</label>
                <input
                  type="tel"
                  value={offlineFormData.customerPhone}
                  onChange={(e) => setOfflineFormData({...offlineFormData, customerPhone: e.target.value})}
                />
              </div>

              <div className="products-section">
                <label>Products *</label>
                {offlineFormData.items.map((item, index) => (
                  <div key={index} className="product-row">
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {config.products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.price}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="btn btn-secondary btn-add-product"
                >
                  + Add Product
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-submit">
                Record Sale
              </button>
            </form>
          )}
        </div>

        {/* Orders List */}
        <div className="orders-section">
          <h2>Your Orders</h2>
          {orders.length === 0 ? (
            <p className="no-orders">No orders yet. Share your link to get started!</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.orderId} className="order-card">
                  <div className="order-header">
                    <span className="order-id">{order.orderId}</span>
                    <span className={`order-type ${order.type || 'online'}`}>
                      {order.type === 'offline' ? 'Offline' : 'Online'}
                    </span>
                  </div>
                  <div className="order-customer">
                    <strong>{order.customer.name}</strong>
                    {order.customer.email && <span> • {order.customer.email}</span>}
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    Total: ${order.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="portal-footer">
          <Link to="/" className="btn btn-secondary">← Back to Store</Link>
          <Link to="/leaderboard" className="btn btn-secondary">View Leaderboard</Link>
        </div>
      </div>
    </div>
  )
}

export default ScoutPortal
