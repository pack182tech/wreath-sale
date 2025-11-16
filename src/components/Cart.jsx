import { useCart } from '../context/CartContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getConfig } from '../utils/configLoader'
import './Cart.css'

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, isCartOpen, setIsCartOpen } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const config = getConfig()

  const handleCheckout = () => {
    setIsCartOpen(false)
    // Preserve scout parameter when navigating to checkout
    const scoutSlug = searchParams.get('scout')
    if (scoutSlug) {
      navigate(`/checkout?scout=${scoutSlug}`)
    } else {
      navigate('/checkout')
    }
  }

  if (!isCartOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Your Cart ({getCartCount()})</h2>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>×</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <p className="cart-empty-subtitle">Add some beautiful wreaths or plants!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="cart-total-amount">${getCartTotal().toFixed(2)}</span>
              </div>
              {config.cart?.paymentInfoMessage && (
                <p className="cart-payment-info">{config.cart.paymentInfoMessage}</p>
              )}
              <button className="btn btn-primary btn-checkout" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Cart
