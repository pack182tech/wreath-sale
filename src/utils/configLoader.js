// PRODUCTION: Configuration loaded from Google Sheets
// Local content.json is used as FALLBACK ONLY if Sheets unavailable

import defaultConfig from '../config/content.json'
import { getConfig as getConfigFromSheets } from './dataService'

// Cache configuration in memory to avoid repeated API calls
let configCache = null
let cacheTimestamp = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const getConfig = async () => {
  // Check if we have a valid cache
  if (configCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    console.log('[ConfigLoader] Using cached config')
    return configCache
  }

  // Try to fetch from Google Sheets
  try {
    console.log('[ConfigLoader] Fetching config from Google Sheets...')
    const sheetsConfig = await getConfigFromSheets()

    if (sheetsConfig) {
      console.log('[ConfigLoader] ✅ Loaded config from Google Sheets')
      configCache = sheetsConfig
      cacheTimestamp = Date.now()
      return sheetsConfig
    }
  } catch (error) {
    console.error('[ConfigLoader] Failed to fetch config from Sheets:', error)
  }

  // Fallback to local config
  console.warn('[ConfigLoader] ⚠️ Using fallback local config - Google Sheets unavailable')
  return defaultConfig
}

// For components that need synchronous access (should migrate to async)
export const getConfigSync = () => {
  if (configCache) {
    console.log('[ConfigLoader] Returning cached config (sync)')
    return configCache
  }
  console.warn('[ConfigLoader] ⚠️ No cached config available, using fallback')
  return defaultConfig
}

export const clearConfigCache = () => {
  console.log('[ConfigLoader] Clearing config cache')
  configCache = null
  cacheTimestamp = null
}

// PRODUCTION: Config saving disabled - update directly in Google Sheets
export const saveConfig = () => {
  throw new Error('Config editing disabled. Please update configuration directly in Google Sheets.')
}

export const resetConfig = () => {
  clearConfigCache()
  return defaultConfig
}
