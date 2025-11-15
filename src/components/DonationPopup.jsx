import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getConfig } from '../utils/configLoader'
import './DonationPopup.css'

function DonationPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [wantsToDonate, setWantsToDonate] = useState(
    sessionStorage.getItem('wantsToDonate') === 'true'
  )
  const location = useLocation()
  const config = getConfig()

  // Don't auto-popup on load - only show when button is clicked
  // useEffect(() => {
  //   const donationResponse = sessionStorage.getItem('donationResponse')
  //   if (!donationResponse) {
  //     const timer = setTimeout(() => {
  //       setIsOpen(true)
  //     }, 2000)
  //     return () => clearTimeout(timer)
  //   }
  // }, [])

  const handleYes = () => {
    sessionStorage.setItem('donationResponse', 'yes')
    sessionStorage.setItem('wantsToDonate', 'true')
    setWantsToDonate(true)
    setIsOpen(false)
  }

  const handleNo = () => {
    sessionStorage.setItem('donationResponse', 'no')
    sessionStorage.setItem('wantsToDonate', 'false')
    setWantsToDonate(false)
    setIsOpen(false)
  }

  const handleManualOpen = () => {
    setIsOpen(true)
  }

  // Don't show on admin routes, leaderboard, confirmation page, login, or scout portal
  if (location.pathname.includes('/admin') ||
      location.pathname.includes('/leaderboard') ||
      location.pathname.includes('/confirmation') ||
      location.pathname.includes('/login') ||
      location.pathname.includes('/scout-portal')) return null

  if (!config.donation?.enabled) return null

  return (
    <>
      {/* Donation Button - Always visible */}
      <button className="donation-trigger-button" onClick={handleManualOpen}>
        {wantsToDonate ? "You're donating! 🎁" : "Looking to Donate?"}
      </button>

      {/* Donation Popup Modal */}
      {isOpen && (
        <div className="donation-popup-overlay" onClick={() => setIsOpen(false)}>
          <div className="donation-popup" onClick={(e) => e.stopPropagation()}>
            <button className="donation-popup-close" onClick={() => setIsOpen(false)}>
              ×
            </button>

            <div className="donation-popup-content">
              <h2>Support Our Community</h2>

              <div className="donation-popup-text">
                <p>{config.donation.popupText || `You can direct your donation to ${config.donation.recipient} at checkout.`}</p>
              </div>

              <div className="donation-popup-buttons">
                <button className="btn btn-primary" onClick={handleYes}>
                  Yes, I want to donate
                </button>
                <button className="btn btn-secondary-outline" onClick={handleNo}>
                  Maybe another time
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DonationPopup
