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

  if (!scoutName) return null

  // Replace $scoutname placeholder with actual scout name
  const bannerText = config.scoutAttributionBanner?.text || 'Supporting $scoutname in his scout journey!'
  const displayText = bannerText.replace('$scoutname', scoutName)

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
