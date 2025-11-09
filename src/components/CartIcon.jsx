import { useCart } from '../context/CartContext'
import { useLocation } from 'react-router-dom'
import './CartIcon.css'

function CartIcon() {
  const { getCartCount, setIsCartOpen } = useCart()
  const location = useLocation()
  const count = getCartCount()

  // Don't show cart icon on admin routes
  if (location.pathname.includes('/admin')) return null

  return (
    <button className="cart-icon-button" onClick={() => setIsCartOpen(true)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {count > 0 && <span className="cart-icon-badge">{count}</span>}
    </button>
  )
}

export default CartIcon
