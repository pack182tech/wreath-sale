const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

async function appsScriptGet(action, params = {}) {
  const url = new URL(APPS_SCRIPT_URL)
  url.searchParams.set('action', action)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Apps Script error: ${response.statusText}`)
  }
  return response.json()
}

async function appsScriptPost(action, data) {
  const url = `${APPS_SCRIPT_URL}?action=${action}`
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error(`Apps Script error: ${response.statusText}`)
  }
  return response.json()
}

export async function getScouts() {
  const result = await appsScriptGet('getScouts')
  return result.scouts || []
}

export async function getOrders() {
  const result = await appsScriptGet('getOrders')
  return result.orders || []
}

export async function getConfig() {
  const result = await appsScriptGet('getConfig')
  return result.config
}

export async function createOrder(order) {
  const result = await appsScriptPost('createOrder', order)
  return result
}

export async function sendOrderConfirmationEmail(order) {
  console.log('[AppsScript] Sending order confirmation email for order:', order.orderId)
  const result = await appsScriptPost('sendOrderConfirmationEmail', order)
  return result
}

export async function sendScoutWelcomeEmail(emailData) {
  console.log('[AppsScript] Sending scout welcome email for scout:', emailData.scoutName)
  const result = await appsScriptPost('sendScoutWelcomeEmail', emailData)
  return result
}

export async function updateOrderStatus(orderId, status) {
  console.log('[AppsScript] Updating order status:', orderId, status)
  const result = await appsScriptPost('updateOrderStatus', { orderId, status })
  return result
}

export async function deleteOrder(orderId) {
  console.log('[AppsScript] Deleting order:', orderId)
  const result = await appsScriptPost('deleteOrder', { orderId })
  return result
}

export async function createScout(scout) {
  console.log('[AppsScript] Creating scout:', scout.name)
  const result = await appsScriptPost('createScout', scout)
  return result
}

export async function updateScout(scout) {
  console.log('[AppsScript] Updating scout:', scout.name)
  const result = await appsScriptPost('updateScout', scout)
  return result
}

export async function deleteScout(scoutId) {
  console.log('[AppsScript] Deleting scout:', scoutId)
  const result = await appsScriptPost('deleteScout', { scoutId })
  return result
}

export async function saveConfig(config) {
  console.log('[AppsScript] Saving configuration')
  const result = await appsScriptPost('saveConfig', config)
  return result
}

export async function saveEmailTemplate(templateKey, templateData) {
  console.log('[AppsScript] Saving email template:', templateKey)
  const result = await appsScriptPost('saveEmailTemplate', { templateKey, templateData })
  return result
}

export async function healthCheck() {
  try {
    const result = await appsScriptGet('healthCheck')
    return result
  } catch (error) {
    console.error('[AppsScript] Health check failed:', error)
    throw error
  }
}

export default {
  getScouts,
  getOrders,
  getConfig,
  createOrder,
  sendOrderConfirmationEmail,
  sendScoutWelcomeEmail,
  updateOrderStatus,
  deleteOrder,
  createScout,
  updateScout,
  deleteScout,
  saveConfig,
  saveEmailTemplate,
  healthCheck
}
