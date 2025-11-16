// Production Readiness Check
// Verifies that the application is properly configured for production deployment

import { healthCheck } from '../services/appsScriptService'

export async function verifyProductionReadiness() {
  const issues = []
  const warnings = []

  // Check 1: Apps Script Configuration
  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL
  const useAppsScript = import.meta.env.VITE_USE_APPS_SCRIPT === 'true'

  if (!useAppsScript) {
    issues.push('❌ VITE_USE_APPS_SCRIPT is not set to "true"')
  }

  if (!appsScriptUrl) {
    issues.push('❌ VITE_APPS_SCRIPT_URL is not configured')
  }

  // Check 2: localStorage Scout Data
  if (localStorage.getItem('scouts')) {
    warnings.push('⚠️ localStorage contains scout data - this should come from Apps Script')
  }

  // Check 3: localStorage Orders
  if (localStorage.getItem('orders')) {
    warnings.push('⚠️ localStorage contains order data - this should come from Apps Script')
  }

  // Check 4: Apps Script Connection
  if (useAppsScript && appsScriptUrl) {
    try {
      console.log('[ProductionCheck] Testing Apps Script connection...')
      await healthCheck()
      console.log('[ProductionCheck] ✅ Apps Script connection successful')
    } catch (error) {
      issues.push(`❌ Apps Script connection failed: ${error.message}`)
      console.error('[ProductionCheck] Apps Script health check failed:', error)
    }
  }

  return {
    isReady: issues.length === 0,
    issues,
    warnings
  }
}

export function displayProductionStatus(status) {
  console.log('='.repeat(60))
  console.log('PRODUCTION READINESS CHECK')
  console.log('='.repeat(60))

  if (status.isReady) {
    console.log('✅ System is READY for production deployment')
  } else {
    console.error('❌ System is NOT READY for production')
    console.error('\nCRITICAL ISSUES:')
    status.issues.forEach(issue => console.error(issue))
  }

  if (status.warnings.length > 0) {
    console.warn('\nWARNINGS:')
    status.warnings.forEach(warning => console.warn(warning))
  }

  console.log('='.repeat(60))

  return status.isReady
}

export async function runProductionCheck() {
  const status = await verifyProductionReadiness()
  const isReady = displayProductionStatus(status)

  if (!isReady) {
    const message = `Production check failed:\n${status.issues.join('\n')}`
    console.error(message)

    // Show user-friendly alert
    if (status.issues.some(issue => issue.includes('connection failed'))) {
      alert('⚠️ Unable to connect to the data backend. Please check your internet connection and try again.')
    }
  }

  return status
}
