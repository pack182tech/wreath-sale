import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useScout } from '../context/ScoutContext'
import { getConfigSync } from '../utils/configLoader'
import './ScoutAttributionBanner.css'

function ScoutAttributionBanner() {
  const { scoutAttribution } = useScout()
  const [scoutName, setScoutName] = useState(null)
  const location = useLocation()
  const config = getConfigSync()

  useEffect(() => {
    if (scoutAttribution?.name) {
      setScoutName(scoutAttribution.name)
    } else {
      const name = sessionStorage.getItem('scoutName')
      setScoutName(name)
    }
  }, [scoutAttribution])

  // Function to trigger scout animation
  const handleBannerClick = () => {
    // Dispatch custom event to trigger scout animation in SnowEffect
    window.dispatchEvent(new CustomEvent('triggerScout'))
  }

  // Don't show banner on admin routes or leaderboard
  if (location.pathname.includes('/admin') || location.pathname.includes('/leaderboard')) return null

  // Handle scout not found case
  if (scoutName === 'SCOUT_NOT_FOUND') {
    const notFoundText = config.scoutAttributionBanner?.notFoundText || "We'll attribute to the correct scout at pick up"
    return (
      <div className="scout-attribution-corner-banner" onClick={handleBannerClick}>
        {notFoundText}
      </div>
    )
  }

  // Use default message if no scout attributed
  if (!scoutName) {
    const defaultText = config.scoutAttributionBanner?.defaultText || "Supporting Pack 182's Scouting adventure!"
    return (
      <div className="scout-attribution-corner-banner" onClick={handleBannerClick}>
        {defaultText}
      </div>
    )
  }

  // Parse scout name from "Lastname, Firstname" to "Firstname Lastname"
  const nameParts = scoutName.split(',').map(part => part.trim())
  const firstName = nameParts.length > 1 ? nameParts[1] : nameParts[0]
  const lastName = nameParts.length > 1 ? nameParts[0] : ''
  const formattedName = lastName ? `${firstName} ${lastName}` : firstName

  // Determine proper possessive form based on whether LAST NAME ends in 's'
  const possessiveSuffix = lastName.toLowerCase().endsWith('s') ? "'" : "'s"

  // Replace $scoutname placeholder with actual scout name
  const bannerTemplate = config.scoutAttributionBanner?.scoutText || `Supporting $scoutname${possessiveSuffix} Scouting adventure!`
  const displayText = bannerTemplate.replace(/\$scoutname/g, formattedName)

  return (
    <div className="scout-attribution-corner-banner" onClick={handleBannerClick}>
      {displayText.split(formattedName).map((part, index, array) => {
        if (index < array.length - 1) {
          return (
            <span key={index}>
              {part}
              <strong>{formattedName}</strong>
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </div>
  )
}

export default ScoutAttributionBanner
