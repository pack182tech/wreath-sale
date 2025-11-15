import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import './VersionDisplay.css'

function VersionDisplay() {
  const [searchParams] = useSearchParams()
  const [showVersion, setShowVersion] = useState(false)

  useEffect(() => {
    // Check if showVersion=true is in URL
    const shouldShow = searchParams.get('showVersion') === 'true'
    setShowVersion(shouldShow)
  }, [searchParams])

  const handleClick = () => {
    // Clear all storage and reload page for testing
    if (window.confirm('Reset all data and reload as a new user?')) {
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    }
  }

  if (!showVersion) return null

  return (
    <div
      className="version-display"
      onClick={handleClick}
      title="Click to reset all data and reload as new user"
      style={{ cursor: 'pointer' }}
    >
      v{import.meta.env.VITE_APP_VERSION || '1.3.0'}
    </div>
  )
}

export default VersionDisplay
