import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useScout } from '../context/ScoutContext'
import { getConfig } from '../utils/configLoader'
import './ScoutAttributionBanner.css'

function ScoutAttributionBanner() {
  const { scoutAttribution } = useScout()
  const [scoutName, setScoutName] = useState(null)
  const location = useLocation()
  const config = getConfig()

  useEffect(() => {
    if (scoutAttribution?.name) {
      setScoutName(scoutAttribution.name)
    } else {
      const name = sessionStorage.getItem('scoutName')
      setScoutName(name)
    }
  }, [scoutAttribution])

  // Don't show banner on admin routes or leaderboard
  if (location.pathname.includes('/admin') || location.pathname.includes('/leaderboard')) return null

  // Handle scout not found case
  if (scoutName === 'SCOUT_NOT_FOUND') {
    const notFoundText = config.scoutAttributionBanner?.notFoundText || "We'll attribute to the correct scout at pick up"
    return (
      <div className="scout-attribution-corner-banner">
        {notFoundText}
      </div>
    )
  }

  // Use default message if no scout attributed
  if (!scoutName) {
    const defaultText = config.scoutAttributionBanner?.defaultText || "Supporting Pack 182's Scouting adventure!"
    return (
      <div className="scout-attribution-corner-banner">
        {defaultText}
      </div>
    )
  }

  // Determine proper possessive form based on whether name ends in 's'
  const possessiveSuffix = scoutName.toLowerCase().endsWith('s') ? "'" : "'s"

  // Replace $scoutname placeholder with actual scout name
  const bannerTemplate = config.scoutAttributionBanner?.scoutText || `Supporting $scoutname${possessiveSuffix} Scouting adventure!`
  const displayText = bannerTemplate.replace(/\$scoutname/g, scoutName)

  return (
    <div className="scout-attribution-corner-banner">
      {displayText.split(scoutName).map((part, index, array) => {
        if (index < array.length - 1) {
          return (
            <span key={index}>
              {part}
              <strong>{scoutName}</strong>
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </div>
  )
}

export default ScoutAttributionBanner
