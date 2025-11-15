const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

const SHEETS = {
  SCOUTS: 'Scouts',
  ORDERS: 'Orders',
  ORDER_ITEMS: 'OrderItems',
  CONFIG: 'Config'
}

// Helper to fetch data from a sheet
async function getSheetData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch from sheet ${sheetName}: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.values || data.values.length < 2) return []

  const headers = data.values[0]
  const rows = data.values.slice(1)

  return rows.map(row => {
    const obj = {}
    headers.forEach((header, index) => {
      obj[header] = row[index] || ''
    })
    return obj
  })
}

// Helper to append data to a sheet (write operations - for admin only)
async function appendSheetData(sheetName, values) {
  // Note: This requires write permissions which need OAuth2 or Service Account
  // For now, we'll use read-only mode and handle writes through admin interface
  throw new Error('Write operations require authentication. Please use the admin interface.')
}

// Get all scouts
export async function getScouts() {
  const scouts = await getSheetData(SHEETS.SCOUTS)
  return scouts.map(s => ({
    ...s,
    // Convert parentEmails from semicolon-separated string to array
    parentEmails: s.parentEmails ? s.parentEmails.split(';').map(e => e.trim()).filter(e => e) : [],
    active: s.active === 'TRUE' || s.active === true || s.active === 'true'
  }))
}

// Get all orders
export async function getOrders() {
  try {
    const orders = await getSheetData(SHEETS.ORDERS)
    const orderItems = await getSheetData(SHEETS.ORDER_ITEMS)

    return orders.map(order => {
      const items = orderItems
        .filter(item => item.orderId === order.orderId)
        .map(item => ({
          id: item.productId,
          name: item.productName,
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 0
        }))

      return {
        orderId: order.orderId,
        scoutId: order.scoutId || '',
        customer: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          comments: order.comments || '',
          supportingScout: order.supportingScout || ''
        },
        items: items,
        total: parseFloat(order.total) || 0,
        status: order.status || 'pending',
        type: order.type || 'online',
        createdAt: order.orderDate
      }
    })
  } catch (error) {
    console.error('Error fetching orders from Google Sheets:', error)
    return []
  }
}

// Get config
export async function getConfig() {
  try {
    const configData = await getSheetData(SHEETS.CONFIG)
    const siteConfig = configData.find(row => row.key === 'siteConfig')
    return siteConfig ? JSON.parse(siteConfig.value) : null
  } catch (error) {
    console.error('Error fetching config from Google Sheets:', error)
    return null
  }
}

// Create new order (writes to sheet - requires OAuth or Service Account)
export async function createOrder(order) {
  const orderId = order.orderId || `ORD-${Date.now()}`

  // For now, we'll append to localStorage and show a message
  // In production, this would write to sheets through a server-side endpoint
  console.warn('Order write attempted. For production, implement server-side Google Sheets write endpoint.')

  return {
    success: true,
    orderId: orderId,
    message: 'Order saved locally. Implement server-side endpoint for sheet writes.'
  }
}

export default {
  getScouts,
  getOrders,
  createOrder,
  getConfig
}
