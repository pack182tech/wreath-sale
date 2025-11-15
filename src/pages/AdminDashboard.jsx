import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  getScouts,
  getOrders,
  updateOrder,
  deleteOrder,
  saveScout,
  deleteScout
} from '../utils/mockData'
import { getConfig, saveConfig } from '../utils/configLoader'
import EmailTemplateEditor from '../components/EmailTemplateEditor'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [scouts, setScouts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUnits: 0,
    activeScouts: 0
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedScoutQR, setSelectedScoutQR] = useState(null)
  const [selectedScoutEmail, setSelectedScoutEmail] = useState(null)
  const [editingScout, setEditingScout] = useState(null)
  const [scoutFormData, setScoutFormData] = useState({
    name: '',
    slug: '',
    rank: '',
    email: '',
    parentName: '',
    parentEmail: '',
    active: true
  })
  const [siteConfig, setSiteConfig] = useState(getConfig())

  // Table controls state
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filterRank, setFilterRank] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const scoutsData = getScouts()
    const ordersData = getOrders()

    setScouts(scoutsData)
    setOrders(ordersData)

    // Calculate stats
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = ordersData.length
    const totalUnits = ordersData.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    )
    const activeScouts = scoutsData.filter(s => s.active).length

    setStats({ totalRevenue, totalOrders, totalUnits, activeScouts })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus })
    loadData()
  }

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId)
      loadData()
      setSelectedOrder(null)
    }
  }

  const handleEditScout = (scout) => {
    setEditingScout(scout.id)
    setScoutFormData({ ...scout })
  }

  const handleSaveScout = (e) => {
    e.preventDefault()

    const scoutData = {
      ...scoutFormData,
      id: editingScout || `scout-${Date.now()}`
    }

    saveScout(scoutData)
    setEditingScout(null)
    setScoutFormData({
      name: '',
      slug: '',
      rank: '',
      email: '',
      parentName: '',
      parentEmail: '',
      active: true
    })
    loadData()
  }

  const handleDeleteScout = (scoutId) => {
    if (window.confirm('Are you sure you want to delete this scout?')) {
      deleteScout(scoutId)
      loadData()
    }
  }

  const handleCancelEdit = () => {
    setEditingScout(null)
    setScoutFormData({
      name: '',
      slug: '',
      rank: '',
      email: '',
      parentName: '',
      parentEmail: '',
      active: true
    })
  }

  const handleConfigChange = (section, field, value, index = null) => {
    setSiteConfig(prev => {
      const updated = { ...prev }
      if (index !== null) {
        // Handle array items (like FAQ or products)
        updated[section][index] = { ...updated[section][index], [field]: value }
      } else if (field) {
        // Handle nested objects
        updated[section] = { ...updated[section], [field]: value }
      } else {
        // Handle direct assignment
        updated[section] = value
      }
      return updated
    })
  }

  const handleSaveConfigChanges = () => {
    saveConfig(siteConfig)
    alert('Configuration saved! Reloading page...')
    window.location.reload()
  }

  const getScoutOrders = (scoutId) => {
    return orders.filter(order => order.scoutId === scoutId)
  }

  const getScoutStats = (scoutId) => {
    const scoutOrders = getScoutOrders(scoutId)
    const revenue = scoutOrders.reduce((sum, order) => sum + order.total, 0)
    const units = scoutOrders.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    )
    return { revenue, units, orderCount: scoutOrders.length }
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  const getFilteredAndSortedScouts = () => {
    let filtered = [...scouts]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(scout =>
        scout.name.toLowerCase().includes(query) ||
        scout.parentName?.toLowerCase().includes(query) ||
        scout.parentEmail?.toLowerCase().includes(query) ||
        scout.rank.toLowerCase().includes(query)
      )
    }

    // Apply rank filter
    if (filterRank) {
      filtered = filtered.filter(scout => scout.rank === filterRank)
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(scout =>
        filterStatus === 'active' ? scout.active : !scout.active
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal

      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'rank':
          aVal = a.rank
          bVal = b.rank
          break
        case 'parent':
          aVal = (a.parentName || '').toLowerCase()
          bVal = (b.parentName || '').toLowerCase()
          break
        case 'orders':
          aVal = getScoutStats(a.id).orderCount
          bVal = getScoutStats(b.id).orderCount
          break
        case 'revenue':
          aVal = getScoutStats(a.id).revenue
          bVal = getScoutStats(b.id).revenue
          break
        case 'units':
          aVal = getScoutStats(a.id).units
          bVal = getScoutStats(b.id).units
          break
        case 'status':
          aVal = a.active ? 1 : 0
          bVal = b.active ? 1 : 0
          break
        default:
          return 0
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }

  const getScoutUrl = (scout) => {
    const baseUrl = window.location.origin + import.meta.env.BASE_URL
    return `${baseUrl}?scout=${scout.slug}`
  }

  const generateWelcomeEmail = (scout) => {
    // Generate QR code as data URL for email
    const canvas = document.createElement('canvas')
    const qrSize = 200
    canvas.width = qrSize
    canvas.height = qrSize

    // We'll need to render the QR code to get the data URL
    // For now, we'll include a placeholder and instructions
    const scoutUrl = getScoutUrl(scout)

    return {
      to: scout.parentEmail,
      subject: `Pack 182 Wreath Sale - ${scout.name}'s Unique Sales Link & QR Code`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a472a; border-bottom: 3px solid #d4af37; padding-bottom: 10px;">
            Welcome to Pack 182's Wreath Sale!
          </h2>

          <p>Dear ${scout.parentName},</p>

          <p>Thank you for participating in our annual wreath sale fundraiser! This email contains ${scout.name}'s unique sales tracking information.</p>

          <h3 style="color: #1a472a; margin-top: 30px;">🎯 ${scout.name}'s Personal Sales Link</h3>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #1a472a;">
            <p style="margin: 0; word-break: break-all;"><strong>Link:</strong> <a href="${scoutUrl}" style="color: #1a472a;">${scoutUrl}</a></p>
          </div>

          <h3 style="color: #1a472a; margin-top: 30px;">📱 ${scout.name}'s Personal QR Code</h3>
          <p><strong>This QR code is specific to ${scout.name}</strong> and will automatically credit all sales to them!</p>

          <div style="text-align: center; background: white; padding: 20px; border: 3px solid #d4af37; border-radius: 12px; margin: 20px 0;">
            <p style="color: #1a472a; font-weight: bold; margin-bottom: 15px;">Scan to Shop & Support ${scout.name}</p>
            <div id="qr-code-placeholder" style="margin: 0 auto;">
              <svg viewBox="0 0 256 256" width="200" height="200">
                <!-- QR Code will be generated here -->
                <rect width="256" height="256" fill="#f8f8f8"/>
                <text x="128" y="128" text-anchor="middle" font-size="14" fill="#666">
                  [QR Code for ${scout.name}]
                </text>
              </svg>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 15px;">Point your phone camera at this code to visit the sales page</p>
          </div>

          <h3 style="color: #1a472a; margin-top: 30px;">How to Use</h3>
          <ul style="line-height: 1.8;">
            <li><strong>Share the link</strong> via text, email, or social media</li>
            <li><strong>Print the QR code</strong> and share with neighbors, family, and friends</li>
            <li><strong>All orders placed</strong> through this link or QR code are automatically credited to ${scout.name}</li>
          </ul>

          <h3 style="color: #1a472a; margin-top: 30px;">What We're Selling</h3>
          <ul>
            <li>Fresh Evergreen Wreaths - $35 each</li>
            <li>Poinsettias (6" & 10") - Starting at $7</li>
            <li>Other Holiday Plants</li>
          </ul>

          <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #d4af37; margin-top: 30px;">
            <p style="margin: 0;"><strong>Pickup Date:</strong> December 15, 2025</p>
            <p style="margin: 5px 0 0 0;"><strong>Location:</strong> Readington Elementary School Parking Lot</p>
          </div>

          <p style="margin-top: 30px;">For questions, please contact:</p>
          <p style="margin: 5px 0;"><strong>Pack Leader:</strong> Walter Serafyn</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> threebridgespack182@gmail.com</p>

          <p style="margin-top: 30px; color: #1a472a; font-weight: bold;">Thank you for supporting Cub Scout Pack 182!</p>
        </div>
      `
    }
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Pack 182 Wreath Sale Management</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'scouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('scouts')}
        >
          Scouts
        </button>
        <button
          className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          Site Configuration
        </button>
        <button
          className={`tab-btn ${activeTab === 'email-templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('email-templates')}
        >
          Email Templates
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-value">{stats.totalUnits}</div>
                <div className="stat-label">Units Sold</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{stats.activeScouts}</div>
                <div className="stat-label">Active Scouts</div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Orders</h2>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Scout</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map(order => {
                      const scout = scouts.find(s => s.id === order.scoutId)
                      return (
                        <tr key={order.orderId}>
                          <td className="order-id-cell">{order.orderId}</td>
                          <td>{order.customer.name}</td>
                          <td>{scout?.name || 'N/A'}</td>
                          <td>${order.total.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${order.status || 'pending'}`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h2>All Orders</h2>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Scout</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const scout = scouts.find(s => s.id === order.scoutId)
                    return (
                      <tr key={order.orderId}>
                        <td className="order-id-cell">{order.orderId}</td>
                        <td>
                          <div>{order.customer.name}</div>
                          <div className="sub-info">{order.customer.email}</div>
                        </td>
                        <td>{scout?.name || 'No Attribution'}</td>
                        <td>{order.items.length} item(s)</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          <span className={`type-badge ${order.type || 'online'}`}>
                            {order.type || 'online'}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => handleOrderStatusUpdate(order.orderId, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="fulfilled">Fulfilled</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn-view"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.orderId)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {selectedOrder && (
              <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Order Details</h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="modal-close"
                    >
                      ×
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="detail-row">
                      <strong>Order ID:</strong>
                      <span>{selectedOrder.orderId}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Customer:</strong>
                      <div>
                        <div>{selectedOrder.customer.name}</div>
                        <div>{selectedOrder.customer.email}</div>
                        <div>{selectedOrder.customer.phone}</div>
                      </div>
                    </div>
                    <div className="detail-row">
                      <strong>Items:</strong>
                      <div>
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx}>
                            {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="detail-row">
                      <strong>Total:</strong>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    {selectedOrder.customer.comments && (
                      <div className="detail-row">
                        <strong>Comments:</strong>
                        <span>{selectedOrder.customer.comments}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scouts' && (
          <div className="scouts-tab">
            <div className="section-header">
              <h2>Scout Management</h2>
              <button
                onClick={() => setEditingScout('new')}
                className="btn btn-primary"
              >
                + Add Scout
              </button>
            </div>

            {editingScout && (
              <form onSubmit={handleSaveScout} className="scout-form">
                <h3>{editingScout === 'new' ? 'Add New Scout' : 'Edit Scout'}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Scout Name *</label>
                    <input
                      type="text"
                      value={scoutFormData.name}
                      onChange={(e) => setScoutFormData({...scoutFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Slug (URL) *</label>
                    <input
                      type="text"
                      value={scoutFormData.slug}
                      onChange={(e) => setScoutFormData({...scoutFormData, slug: e.target.value})}
                      placeholder="firstname-lastname"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rank *</label>
                    <select
                      value={scoutFormData.rank}
                      onChange={(e) => setScoutFormData({...scoutFormData, rank: e.target.value})}
                      required
                    >
                      <option value="">Select Rank</option>
                      <option value="Lion">Lion</option>
                      <option value="Tiger">Tiger</option>
                      <option value="Wolf">Wolf</option>
                      <option value="Bear">Bear</option>
                      <option value="Webelos">Webelos</option>
                      <option value="Arrow of Light">Arrow of Light</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Scout Email</label>
                    <input
                      type="email"
                      value={scoutFormData.email}
                      onChange={(e) => setScoutFormData({...scoutFormData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Parent Name</label>
                    <input
                      type="text"
                      value={scoutFormData.parentName}
                      onChange={(e) => setScoutFormData({...scoutFormData, parentName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Parent Email</label>
                    <input
                      type="email"
                      value={scoutFormData.parentEmail}
                      onChange={(e) => setScoutFormData({...scoutFormData, parentEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={scoutFormData.active}
                      onChange={(e) => setScoutFormData({...scoutFormData, active: e.target.checked})}
                    />
                    Active
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Scout
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-controls">
              <input
                type="text"
                placeholder="Search scouts, parents, rank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <select
                value={filterRank}
                onChange={(e) => setFilterRank(e.target.value)}
                className="filter-select"
              >
                <option value="">All Ranks</option>
                <option value="Lion">Lion</option>
                <option value="Tiger">Tiger</option>
                <option value="Wolf">Wolf</option>
                <option value="Bear">Bear</option>
                <option value="Webelos">Webelos</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {(searchQuery || filterRank || filterStatus) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterRank('')
                    setFilterStatus('')
                  }}
                  className="btn-clear-filters"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="scouts-table">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} className="sortable">
                      Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('rank')} className="sortable">
                      Rank {sortBy === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('parent')} className="sortable">
                      Parent {sortBy === 'parent' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('orders')} className="sortable">
                      Orders {sortBy === 'orders' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('revenue')} className="sortable">
                      Revenue {sortBy === 'revenue' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('units')} className="sortable">
                      Units {sortBy === 'units' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('status')} className="sortable">
                      Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAndSortedScouts().map(scout => {
                    const scoutStats = getScoutStats(scout.id)
                    return (
                      <tr key={scout.id}>
                        <td><strong>{scout.name}</strong></td>
                        <td>{scout.rank}</td>
                        <td>
                          <div>{scout.parentName}</div>
                          <div className="sub-info">{scout.parentEmail}</div>
                        </td>
                        <td>{scoutStats.orderCount}</td>
                        <td>${scoutStats.revenue.toFixed(2)}</td>
                        <td>{scoutStats.units}</td>
                        <td>
                          <span className={`status-badge ${scout.active ? 'active' : 'inactive'}`}>
                            {scout.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedScoutQR(scout)}
                            className="btn-view"
                          >
                            View QR
                          </button>
                          <button
                            onClick={() => setSelectedScoutEmail(scout)}
                            className="btn-view"
                          >
                            Welcome Email
                          </button>
                          <button
                            onClick={() => handleEditScout(scout)}
                            className="btn-view"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteScout(scout.id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="config-tab">
            <div className="section-header config-sticky-header">
              <h2>Site Configuration</h2>
              <button onClick={handleSaveConfigChanges} className="btn btn-primary">
                Save All Changes
              </button>
            </div>

            <div className="config-section">
              <h3>Campaign Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Campaign Name</label>
                  <input
                    type="text"
                    value={siteConfig.campaign.name}
                    onChange={(e) => handleConfigChange('campaign', 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={siteConfig.campaign.status}
                    onChange={(e) => handleConfigChange('campaign', 'status', e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={siteConfig.campaign.startDate}
                    onChange={(e) => handleConfigChange('campaign', 'startDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={siteConfig.campaign.endDate}
                    onChange={(e) => handleConfigChange('campaign', 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pickup Date</label>
                  <input
                    type="text"
                    value={siteConfig.campaign.pickupDate}
                    onChange={(e) => handleConfigChange('campaign', 'pickupDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Pickup Time</label>
                  <input
                    type="text"
                    value={siteConfig.campaign.pickupTime}
                    onChange={(e) => handleConfigChange('campaign', 'pickupTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  value={siteConfig.campaign.pickupLocation}
                  onChange={(e) => handleConfigChange('campaign', 'pickupLocation', e.target.value)}
                />
              </div>
            </div>

            <div className="config-section">
              <h3>Pack Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Pack Name</label>
                  <input
                    type="text"
                    value={siteConfig.pack.name}
                    onChange={(e) => handleConfigChange('pack', 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={siteConfig.pack.location}
                    onChange={(e) => handleConfigChange('pack', 'location', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Leader Name</label>
                  <input
                    type="text"
                    value={siteConfig.pack.leaderName}
                    onChange={(e) => handleConfigChange('pack', 'leaderName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Leader Email</label>
                  <input
                    type="email"
                    value={siteConfig.pack.leaderEmail}
                    onChange={(e) => handleConfigChange('pack', 'leaderEmail', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="config-section">
              <h3>Scout Attribution Banner</h3>

              <div className="form-group">
                <label>Banner Text for Scouts (use $scoutname as placeholder)</label>
                <input
                  type="text"
                  value={siteConfig.scoutAttributionBanner?.scoutText || ''}
                  onChange={(e) => handleConfigChange('scoutAttributionBanner', 'scoutText', e.target.value)}
                  placeholder="Supporting $scoutname Scouting adventure!"
                />
                <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                  Example: "Supporting $scoutname Scouting adventure!" → "Supporting Dylan McGowan's Scouting adventure!"
                </small>
              </div>

              <div className="form-group">
                <label>Banner Text for Pack 182 (no scout)</label>
                <input
                  type="text"
                  value={siteConfig.scoutAttributionBanner?.defaultText || ''}
                  onChange={(e) => handleConfigChange('scoutAttributionBanner', 'defaultText', e.target.value)}
                  placeholder="Supporting Pack 182's Scouting adventure!"
                />
                <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                  Shown when no scout is specified in the URL
                </small>
              </div>

              <div className="form-group">
                <label>Banner Text for Scout Not Found</label>
                <input
                  type="text"
                  value={siteConfig.scoutAttributionBanner?.notFoundText || ''}
                  onChange={(e) => handleConfigChange('scoutAttributionBanner', 'notFoundText', e.target.value)}
                  placeholder="We'll attribute to the correct scout at pick up"
                />
                <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                  Shown when scout link is invalid but order can still proceed
                </small>
              </div>
            </div>

            <div className="config-section">
              <h3>Hero Section</h3>
              <div className="form-group">
                <label>Hero Title</label>
                <input
                  type="text"
                  value={siteConfig.content.heroTitle}
                  onChange={(e) => handleConfigChange('content', 'heroTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Hero Subtitle</label>
                <input
                  type="text"
                  value={siteConfig.content.heroSubtitle}
                  onChange={(e) => handleConfigChange('content', 'heroSubtitle', e.target.value)}
                />
              </div>
            </div>

            <div className="config-section">
              <h3>About Section</h3>
              <div className="form-group">
                <label>About Title</label>
                <input
                  type="text"
                  value={siteConfig.content.aboutTitle}
                  onChange={(e) => handleConfigChange('content', 'aboutTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>About Text</label>
                <textarea
                  rows="4"
                  value={siteConfig.content.aboutText}
                  onChange={(e) => handleConfigChange('content', 'aboutText', e.target.value)}
                />
              </div>
            </div>

            <div className="config-section">
              <h3>FAQ Section</h3>
              <div className="form-group">
                <label>FAQ Title</label>
                <input
                  type="text"
                  value={siteConfig.content.faqTitle}
                  onChange={(e) => handleConfigChange('content', 'faqTitle', e.target.value)}
                />
              </div>
              {siteConfig.content.faq.map((item, index) => (
                <div key={index} className="faq-item">
                  <h4>FAQ {index + 1}</h4>
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => {
                        const newFaq = [...siteConfig.content.faq]
                        newFaq[index] = { ...newFaq[index], question: e.target.value }
                        handleConfigChange('content', 'faq', newFaq)
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Answer</label>
                    <textarea
                      rows="3"
                      value={item.answer}
                      onChange={(e) => {
                        const newFaq = [...siteConfig.content.faq]
                        newFaq[index] = { ...newFaq[index], answer: e.target.value }
                        handleConfigChange('content', 'faq', newFaq)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="config-section">
              <h3>Zelle Payment Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Recipient First Name</label>
                  <input
                    type="text"
                    value={siteConfig.zelle.recipientFirstName || 'Boy Scouts'}
                    onChange={(e) => handleConfigChange('zelle', 'recipientFirstName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Recipient Last Name</label>
                  <input
                    type="text"
                    value={siteConfig.zelle.recipientLastName || 'of America'}
                    onChange={(e) => handleConfigChange('zelle', 'recipientLastName', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Recipient Contact</label>
                <input
                  type="text"
                  value={siteConfig.zelle.recipientContact}
                  onChange={(e) => handleConfigChange('zelle', 'recipientContact', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Payment Instructions</label>
                <textarea
                  rows="3"
                  value={siteConfig.zelle.instructions}
                  onChange={(e) => handleConfigChange('zelle', 'instructions', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>QR Code Text</label>
                <input
                  type="text"
                  value={siteConfig.zelle.qrCodeText || 'Scan to Pay'}
                  onChange={(e) => handleConfigChange('zelle', 'qrCodeText', e.target.value)}
                  placeholder="e.g., Scan to Pay"
                />
                <small>Text displayed above the Zelle QR code</small>
              </div>
            </div>

            <div className="config-section">
              <h3>Donation Settings</h3>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={siteConfig.donation.enabled}
                    onChange={(e) => handleConfigChange('donation', 'enabled', e.target.checked)}
                  />
                  Enable Donations
                </label>
              </div>
              <div className="form-group">
                <label>Donation Recipient</label>
                <input
                  type="text"
                  value={siteConfig.donation.recipient}
                  onChange={(e) => handleConfigChange('donation', 'recipient', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Donation Description</label>
                <input
                  type="text"
                  value={siteConfig.donation.description}
                  onChange={(e) => handleConfigChange('donation', 'description', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Donation Popup Text</label>
                <input
                  type="text"
                  value={siteConfig.donation.popupText || ''}
                  onChange={(e) => handleConfigChange('donation', 'popupText', e.target.value)}
                  placeholder="e.g., You can direct your donation to [church name] at checkout."
                />
                <small>Text shown in the donation popup on the landing page</small>
              </div>
            </div>

            <div className="config-section">
              <h3>Product Disclaimer</h3>
              <div className="form-group">
                <textarea
                  rows="3"
                  value={siteConfig.productDisclaimer}
                  onChange={(e) => handleConfigChange('productDisclaimer', null, e.target.value)}
                />
              </div>
            </div>

            <div className="config-section">
              <h3>Scout Law</h3>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={siteConfig.scoutLaw.enabled}
                    onChange={(e) => handleConfigChange('scoutLaw', 'enabled', e.target.checked)}
                  />
                  Display Scout Law
                </label>
              </div>
              <div className="form-group">
                <label>Scout Law Text</label>
                <textarea
                  rows="2"
                  value={siteConfig.scoutLaw.text}
                  onChange={(e) => handleConfigChange('scoutLaw', 'text', e.target.value)}
                />
              </div>
            </div>

            <div className="section-header">
              <h2>Products</h2>
            </div>
            {siteConfig.products.map((product, index) => (
              <div key={product.id} className="config-section product-config">
                <h3>{product.name} <span className="product-id">({product.id})</span></h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => {
                        const newProducts = [...siteConfig.products]
                        newProducts[index] = { ...newProducts[index], name: e.target.value }
                        handleConfigChange('products', null, newProducts)
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => {
                        const newProducts = [...siteConfig.products]
                        newProducts[index] = { ...newProducts[index], price: parseFloat(e.target.value) }
                        handleConfigChange('products', null, newProducts)
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={product.description}
                    onChange={(e) => {
                      const newProducts = [...siteConfig.products]
                      newProducts[index] = { ...newProducts[index], description: e.target.value }
                      handleConfigChange('products', null, newProducts)
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={product.active}
                      onChange={(e) => {
                        const newProducts = [...siteConfig.products]
                        newProducts[index] = { ...newProducts[index], active: e.target.checked }
                        handleConfigChange('products', null, newProducts)
                      }}
                    />
                    Active
                  </label>
                </div>
              </div>
            ))}

          </div>
        )}

        {activeTab === 'email-templates' && (
          <div className="email-templates-tab">
            <h2>Email Templates</h2>
            <p className="tab-description">
              Customize email templates sent to customers and scouts. Use placeholders to insert dynamic content like customer names, order details, and scout information.
            </p>

            <EmailTemplateEditor
              templates={siteConfig.emailTemplates || {}}
              onSave={(templateKey, template) => {
                const newConfig = { ...siteConfig }
                if (!newConfig.emailTemplates) {
                  newConfig.emailTemplates = {}
                }
                newConfig.emailTemplates[templateKey] = {
                  ...newConfig.emailTemplates[templateKey],
                  ...template
                }
                setSiteConfig(newConfig)
                saveConfig(newConfig)
                alert('Email template saved successfully!')
              }}
            />
          </div>
        )}
      </div>

      <div className="admin-footer">
        <Link to="/" className="btn btn-secondary">← Back to Store</Link>
        <Link to="/leaderboard" className="btn btn-secondary">View Leaderboard</Link>
      </div>

      {/* Welcome Email Modal */}
      {selectedScoutEmail && (
        <div className="modal-overlay" onClick={() => setSelectedScoutEmail(null)}>
          <div className="modal-content email-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Welcome Email Preview - {selectedScoutEmail.name}</h2>
              <button
                onClick={() => setSelectedScoutEmail(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="email-meta">
                <p><strong>To:</strong> {generateWelcomeEmail(selectedScoutEmail).to}</p>
                <p><strong>Subject:</strong> {generateWelcomeEmail(selectedScoutEmail).subject}</p>
                <p className="email-note">This email would be sent in production</p>
              </div>
              <div className="email-preview-content">
                <div dangerouslySetInnerHTML={{ __html: generateWelcomeEmail(selectedScoutEmail).body }} />
                <div style={{ textAlign: 'center', margin: '20px 0', padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
                  <p style={{ fontWeight: 'bold', color: '#1a472a', marginBottom: '15px' }}>Live QR Code (will be embedded in actual email):</p>
                  <QRCodeSVG
                    value={getScoutUrl(selectedScoutEmail)}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedScoutQR && (
        <div className="modal-overlay" onClick={() => setSelectedScoutQR(null)}>
          <div className="modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedScoutQR.name} - QR Code</h2>
              <button
                onClick={() => setSelectedScoutQR(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body qr-modal-body">
              <div className="qr-code-container">
                <QRCodeSVG
                  value={getScoutUrl(selectedScoutQR)}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="qr-info">
                <p><strong>Scout:</strong> {selectedScoutQR.name}</p>
                <p><strong>Rank:</strong> {selectedScoutQR.rank}</p>
                <p><strong>Parent:</strong> {selectedScoutQR.parentName}</p>
                <p><strong>URL:</strong></p>
                <code className="scout-url">{getScoutUrl(selectedScoutQR)}</code>
                <p className="qr-instructions">
                  This QR code is unique to {selectedScoutQR.name}. When customers scan it,
                  all their purchases will be automatically credited to this scout.
                  Print this code or include it in emails to parents.
                </p>
              </div>
              <div className="qr-actions">
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary"
                >
                  Print QR Code
                </button>
                <button
                  onClick={() => {
                    const svg = document.querySelector('.qr-code-container svg')
                    const svgData = new XMLSerializer().serializeToString(svg)
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    const img = new Image()
                    img.onload = () => {
                      canvas.width = img.width
                      canvas.height = img.height
                      ctx.drawImage(img, 0, 0)
                      const link = document.createElement('a')
                      link.download = `${selectedScoutQR.slug}-qr-code.png`
                      link.href = canvas.toDataURL('image/png')
                      link.click()
                    }
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
                  }}
                  className="btn btn-secondary"
                >
                  Download QR Code
                </button>
                <button
                  onClick={() => {
                    const scout = selectedScoutQR
                    setSelectedScoutQR(null)
                    setSelectedScoutEmail(scout)
                  }}
                  className="btn btn-primary"
                >
                  Email to Parent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
