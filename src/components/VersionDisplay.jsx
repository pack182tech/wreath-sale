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

  if (!showVersion) return null

  return (
    <div className="version-display">
      v{import.meta.env.VITE_APP_VERSION || '1.3.0'}
    </div>
  )
}

export default VersionDisplay
