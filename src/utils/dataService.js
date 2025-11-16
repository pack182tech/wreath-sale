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

// Update order status (PRODUCTION ONLY - used by Admin Dashboard)
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

// PRODUCTION: Admin functions disabled - manage scouts/orders directly in Google Sheets
// These functions are intentionally removed to prevent localStorage usage
export function updateOrder() {
  throw new Error('Order editing disabled. Please update orders directly in Google Sheets.')
}

export function deleteOrder() {
  throw new Error('Order deletion disabled. Please delete orders directly in Google Sheets.')
}

export function saveScout() {
  throw new Error('Scout editing disabled. Please update scouts directly in Google Sheets.')
}

export function deleteScout() {
  throw new Error('Scout deletion disabled. Please delete scouts directly in Google Sheets.')
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

// PRODUCTION: Config editing disabled - update config directly in Google Sheets
export function saveConfig() {
  throw new Error('Config editing disabled. Please update configuration directly in Google Sheets.')
}

export default {
  getScouts,
  getOrders,
  saveOrder,
  updateOrderStatus,
  getConfig
  // REMOVED: updateOrder, deleteOrder, saveScout, deleteScout, saveConfig, initializeMockData
  // These functions are disabled in production - use Google Sheets directly
}
