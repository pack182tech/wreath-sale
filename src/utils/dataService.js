// Data Service - PRODUCTION ONLY interface for scout and order data
// ALL data comes from Google Apps Script → Google Sheets
// NO localStorage fallbacks - failures throw errors to alert users

import * as appsScriptService from '../services/appsScriptService'

// PRODUCTION: Only Apps Script is supported
const USE_APPS_SCRIPT = import.meta.env.VITE_USE_APPS_SCRIPT === 'true'
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

// Verify configuration
const appsScriptConfigured = USE_APPS_SCRIPT && APPS_SCRIPT_URL

if (!appsScriptConfigured) {
  console.error('❌ PRODUCTION ERROR: Apps Script not configured! Set VITE_USE_APPS_SCRIPT=true and VITE_APPS_SCRIPT_URL')
  throw new Error('Production backend not configured. Please contact support.')
}

// Get all scouts
export async function getScouts() {
  try {
    console.log('[DataService] Fetching scouts from Apps Script...')
    const scouts = await appsScriptService.getScouts()
    console.log(`[DataService] Loaded ${scouts.length} scouts from Apps Script`)
    return scouts
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to fetch scouts from Apps Script:', error)
    throw new Error('Unable to load scout data. Please check your internet connection and try again.')
  }
}

// Get all orders
export async function getOrders() {
  try {
    console.log('[DataService] Fetching orders from Apps Script...')
    const orders = await appsScriptService.getOrders()
    console.log(`[DataService] Loaded ${orders.length} orders from Apps Script`)
    return orders
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to fetch orders from Apps Script:', error)
    throw new Error('Unable to load order data. Please check your internet connection and try again.')
  }
}

// Save order
export async function saveOrder(order) {
  try {
    console.log('[DataService] Saving order to Apps Script...')
    const result = await appsScriptService.createOrder(order)
    console.log('[DataService] Order saved to Apps Script:', result)
    return result
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to save order to Apps Script:', error)
    throw new Error('Unable to save order. Please check your internet connection and try again.')
  }
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  try {
    console.log('[DataService] Updating order status via Apps Script...')
    const result = await appsScriptService.updateOrderStatus(orderId, status)
    console.log('[DataService] Order status updated:', result)
    return result
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to update order status:', error)
    throw new Error('Unable to update order status. Please try again.')
  }
}

// Delete order
export async function deleteOrder(orderId) {
  try {
    console.log('[DataService] Deleting order via Apps Script...')
    const result = await appsScriptService.deleteOrder(orderId)
    console.log('[DataService] Order deleted:', result)
    return result
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to delete order:', error)
    throw new Error('Unable to delete order. Please try again.')
  }
}

// Save scout (create or update)
export async function saveScout(scout) {
  try {
    console.log('[DataService] Saving scout via Apps Script...')
    const result = scout.id
      ? await appsScriptService.updateScout(scout)
      : await appsScriptService.createScout(scout)
    console.log('[DataService] Scout saved:', result)
    return result
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to save scout:', error)
    throw new Error('Unable to save scout. Please try again.')
  }
}

// Delete scout
export async function deleteScout(scoutId) {
  try {
    console.log('[DataService] Deleting scout via Apps Script...')
    const result = await appsScriptService.deleteScout(scoutId)
    console.log('[DataService] Scout deleted:', result)
    return result
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to delete scout:', error)
    throw new Error('Unable to delete scout. Please try again.')
  }
}

// Get config
export async function getConfig() {
  try {
    const config = await appsScriptService.getConfig()
    console.log('[DataService] Loaded config from Apps Script')
    return config
  } catch (error) {
    console.error('[DataService] ❌ WARNING: Failed to fetch config from Apps Script:', error)
    // Config is less critical - return null and let local config file be used
    return null
  }
}

// Save configuration
export async function saveConfig(config) {
  try {
    console.log('[DataService] Saving config via Apps Script...')
    const result = await appsScriptService.saveConfig(config)
    console.log('[DataService] Config saved:', result)
    return result
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to save config:', error)
    throw new Error('Unable to save configuration. Please try again.')
  }
}

// Save email template
export async function saveEmailTemplate(templateKey, templateData) {
  try {
    console.log('[DataService] Saving email template via Apps Script...')
    const result = await appsScriptService.saveEmailTemplate(templateKey, templateData)
    console.log('[DataService] Email template saved:', result)
    return result
  } catch (error) {
    console.error('[DataService] ❌ CRITICAL: Failed to save email template:', error)
    throw new Error('Unable to save email template. Please try again.')
  }
}

export default {
  getScouts,
  getOrders,
  saveOrder,
  updateOrderStatus,
  deleteOrder,
  saveScout,
  deleteScout,
  getConfig,
  saveConfig,
  saveEmailTemplate
}
