import { useState, useEffect } from 'react'
import './ScoutAttributionBanner.css'

function ScoutAttributionBanner() {
  const [scoutName, setScoutName] = useState(null)

  useEffect(() => {
    const name = sessionStorage.getItem('scoutName')
    setScoutName(name)
  }, [])

  if (!scoutName) return null

  return (
    <div className="scout-attribution-corner-banner">
      Supporting <strong>{scoutName}</strong> in his scout journey!
    </div>
  )
}

export default ScoutAttributionBanner
