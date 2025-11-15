// Data Service - Unified interface for scout and order data
// Switches between Google Sheets (production) and localStorage (development/testing)

import * as sheetsService from '../services/sheetsService'
import * as mockData from './mockData'

// Check if we should use Google Sheets
const USE_SHEETS = import.meta.env.VITE_USE_GOOGLE_SHEETS === 'true'
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

// Verify sheets config if sheets mode is enabled
const sheetsConfigured = USE_SHEETS && SHEET_ID && API_KEY

if (USE_SHEETS && !sheetsConfigured) {
  console.warn('Google Sheets mode enabled but not properly configured. Falling back to localStorage.')
}

// Get all scouts
export async function getScouts() {
  if (sheetsConfigured) {
    try {
      console.log('[DataService] Fetching scouts from Google Sheets...')
      const scouts = await sheetsService.getScouts()
      console.log(`[DataService] Loaded ${scouts.length} scouts from Google Sheets`)
      return scouts
    } catch (error) {
      console.error('[DataService] Failed to fetch from Google Sheets, falling back to localStorage:', error)
    }
  }

  // Fallback to localStorage
  return mockData.getScouts()
}

// Get all orders
export async function getOrders() {
  if (sheetsConfigured) {
    try {
      console.log('[DataService] Fetching orders from Google Sheets...')
      const orders = await sheetsService.getOrders()
      console.log(`[DataService] Loaded ${orders.length} orders from Google Sheets`)
      return orders
    } catch (error) {
      console.error('[DataService] Failed to fetch orders from Google Sheets, falling back to localStorage:', error)
    }
  }

  // Fallback to localStorage
  return mockData.getOrders()
}

// Save order
export async function saveOrder(order) {
  if (sheetsConfigured) {
    try {
      console.log('[DataService] Saving order to Google Sheets...')
      const result = await sheetsService.createOrder(order)
      console.log('[DataService] Order saved to Google Sheets:', result)
      return result
    } catch (error) {
      console.error('[DataService] Failed to save to Google Sheets, falling back to localStorage:', error)
    }
  }

  // Fallback to localStorage
  return mockData.saveOrder(order)
}

// Update order
export function updateOrder(orderId, updates) {
  // For now, only localStorage supports updates
  // In production with sheets, you'd need a server-side endpoint
  return mockData.updateOrder(orderId, updates)
}

// Delete order
export function deleteOrder(orderId) {
  // For now, only localStorage supports deletes
  return mockData.deleteOrder(orderId)
}

// Save scout
export function saveScout(scout) {
  // For now, only localStorage supports scout updates
  return mockData.saveScout(scout)
}

// Delete scout
export function deleteScout(scoutId) {
  // For now, only localStorage supports scout deletes
  return mockData.deleteScout(scoutId)
}

// Get config
export async function getConfig() {
  if (sheetsConfigured) {
    try {
      const config = await sheetsService.getConfig()
      if (config) {
        console.log('[DataService] Loaded config from Google Sheets')
        return config
      }
    } catch (error) {
      console.error('[DataService] Failed to fetch config from Google Sheets:', error)
    }
  }

  // Fallback to local config
  return mockData.getConfig()
}

// Save config
export function saveConfig(config) {
  // For now, only localStorage supports config updates
  return mockData.saveConfig(config)
}

// Initialize data
export function initializeMockData() {
  return mockData.initializeMockData()
}

export default {
  getScouts,
  getOrders,
  saveOrder,
  updateOrder,
  deleteOrder,
  saveScout,
  deleteScout,
  getConfig,
  saveConfig,
  initializeMockData
}
