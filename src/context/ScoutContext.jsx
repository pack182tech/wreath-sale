import { createContext, useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

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

  useEffect(() => {
    // Clear old scout attribution if it's from the demo/example scouts
    const existingScoutName = sessionStorage.getItem('scoutName')
    const demoScouts = ['Tommy Anderson', 'Sarah Martinez', 'Michael Chen', 'Emma Johnson', 'Alex Rivera']
    if (existingScoutName && demoScouts.includes(existingScoutName)) {
      sessionStorage.removeItem('scoutAttribution')
      sessionStorage.removeItem('scoutName')
    }

    // Check if there's a scout parameter in the URL
    const scoutSlug = searchParams.get('scout')
    if (scoutSlug) {
      // Load scout data from localStorage (would be from API in production)
      const scouts = JSON.parse(localStorage.getItem('scouts') || '[]')
      const scout = scouts.find(s => s.slug === scoutSlug)

      if (scout) {
        setScoutAttribution(scout)
        // Store in sessionStorage to persist across page navigation
        sessionStorage.setItem('scoutAttribution', scout.id)
        sessionStorage.setItem('scoutName', scout.name)
      }
    } else {
      // Check if there's existing attribution in sessionStorage
      const existingScoutId = sessionStorage.getItem('scoutAttribution')
      const cleanScoutName = sessionStorage.getItem('scoutName')
      if (existingScoutId && cleanScoutName) {
        setScoutAttribution({ id: existingScoutId, name: cleanScoutName })
      }
    }
  }, [searchParams])

  const clearAttribution = () => {
    setScoutAttribution(null)
    sessionStorage.removeItem('scoutAttribution')
    sessionStorage.removeItem('scoutName')
  }

  return (
    <ScoutContext.Provider value={{ scoutAttribution, clearAttribution }}>
      {children}
    </ScoutContext.Provider>
  )
}
