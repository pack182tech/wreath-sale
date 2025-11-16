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

export default {
  getScouts,
  getOrders,
  getConfig,
  createOrder
}
