import { createContext, useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ScoutNotFoundModal from '../components/ScoutNotFoundModal'

const ScoutContext = createContext()

export const useScout = () => {
  const context = useContext(ScoutContext)
  if (!context) {
    throw new Error('useScout must be used within a ScoutProvider')
  }
  return context
}

export const ScoutProvider = ({ children }) => {
  const [searchParams] = useSearchParams()
  const [scoutAttribution, setScoutAttribution] = useState(null)
  const [showNotFoundModal, setShowNotFoundModal] = useState(false)

  useEffect(() => {
    // Check data version and clear sessionStorage if mismatched
    const CURRENT_DATA_VERSION = '2.7'
    const storedVersion = localStorage.getItem('scoutDataVersion')

    if (storedVersion !== CURRENT_DATA_VERSION) {
      console.log('[ScoutContext] Data version mismatch, clearing sessionStorage')
      sessionStorage.clear()
    }

    // Clear old scout attribution if it's from the demo/example scouts
    const existingScoutName = sessionStorage.getItem('scoutName')
    const demoScouts = ['Tommy Anderson', 'Sarah Martinez', 'Michael Chen', 'Emma Johnson', 'Alex Rivera']
    if (existingScoutName && demoScouts.includes(existingScoutName)) {
      sessionStorage.removeItem('scoutAttribution')
      sessionStorage.removeItem('scoutName')
    }

    // Check if there's a scout parameter in the URL
    const scoutSlug = searchParams.get('scout')
    console.log('[ScoutContext] Scout slug from URL:', scoutSlug)

    if (scoutSlug) {
      // Mark that this session was initiated with a scout slug
      sessionStorage.setItem('hasActiveScoutSession', 'true')

      // Load scout data from localStorage (would be from API in production)
      const scouts = JSON.parse(localStorage.getItem('scouts') || '[]')
      console.log('[ScoutContext] Total scouts in localStorage:', scouts.length)

      const scout = scouts.find(s => s.slug === scoutSlug)
      console.log('[ScoutContext] Found scout:', scout)

      if (scout) {
        setScoutAttribution(scout)
        // Store in sessionStorage to persist across page navigation
        sessionStorage.setItem('scoutAttribution', scout.id)
        sessionStorage.setItem('scoutName', scout.name)
        console.log('[ScoutContext] Set scout attribution:', scout.name)
      } else {
        // Scout slug provided but not found - still allow order with placeholder
        console.warn('[ScoutContext] No scout found with slug:', scoutSlug)

        const notFoundName = 'SCOUT_NOT_FOUND'
        setScoutAttribution({ id: 'not-found', name: notFoundName, slug: scoutSlug })
        sessionStorage.setItem('scoutAttribution', 'not-found')
        sessionStorage.setItem('scoutName', notFoundName)
        sessionStorage.setItem('scoutSlug', scoutSlug)

        // Show modal notification (only once per session)
        if (!sessionStorage.getItem('scoutNotFoundModalShown')) {
          setTimeout(() => {
            setShowNotFoundModal(true)
            sessionStorage.setItem('scoutNotFoundModalShown', 'true')
          }, 500)
        }
      }
    } else {
      // No scout slug in URL
      // Only restore from sessionStorage if this session was initiated with a scout slug
      const hasActiveSession = sessionStorage.getItem('hasActiveScoutSession') === 'true'

      if (hasActiveSession) {
        // Restore attribution for internal navigation within scout session
        const existingScoutId = sessionStorage.getItem('scoutAttribution')
        const cleanScoutName = sessionStorage.getItem('scoutName')
        if (existingScoutId && cleanScoutName) {
          setScoutAttribution({ id: existingScoutId, name: cleanScoutName })
          console.log('[ScoutContext] Restored scout attribution from session:', cleanScoutName)
        }
      } else {
        // No active scout session, clear any stale attribution
        console.log('[ScoutContext] No scout slug and no active session - clearing attribution')
        setScoutAttribution(null)
      }
    }
  }, [searchParams])

  const clearAttribution = () => {
    setScoutAttribution(null)
    sessionStorage.removeItem('scoutAttribution')
    sessionStorage.removeItem('scoutName')
    sessionStorage.removeItem('hasActiveScoutSession')
  }

  return (
    <ScoutContext.Provider value={{ scoutAttribution, clearAttribution }}>
      <ScoutNotFoundModal
        show={showNotFoundModal}
        onClose={() => setShowNotFoundModal(false)}
      />
      {children}
    </ScoutContext.Provider>
  )
}
