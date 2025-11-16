// Pack 182 Wreath Sale Platform
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CartProvider } from './context/CartContext'
import { ScoutProvider } from './context/ScoutContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Cart from './components/Cart'
import CartIcon from './components/CartIcon'
import ScoutAttributionBanner from './components/ScoutAttributionBanner'
import DonationPopup from './components/DonationPopup'
import ProductCard from './components/ProductCard'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import Leaderboard from './pages/Leaderboard'
import FAQ from './pages/FAQ'
import Login from './pages/Login'
import ScoutPortal from './pages/ScoutPortal'
import AdminDashboard from './pages/AdminDashboard'
import ScoutLawAnimated from './components/ScoutLawAnimated'
import VersionDisplay from './components/VersionDisplay'
import SnowEffect from './components/SnowEffect'
import { getConfig, getConfigSync } from './utils/configLoader'
import { runProductionCheck } from './utils/productionCheck'
import './styles/App.css'

function App() {
  const basePath = import.meta.env.BASE_URL
  const [configLoaded, setConfigLoaded] = useState(false)

  // PRODUCTION: Load configuration from Google Sheets on app startup
  useEffect(() => {
    const initialize = async () => {
      // Run production checks
      await runProductionCheck()

      // Load config from Google Sheets (will cache it)
      await getConfig()
      setConfigLoaded(true)
    }

    initialize()
  }, [])

  // Use sync version (returns cached config after initial load)
  const config = getConfigSync()

  // Show loading state while config loads
  if (!configLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #1a472a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading Pack 182 Wreath Sale...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router basename="/wreath-sale">
          <ScoutProvider>
            <SnowEffect />
            <VersionDisplay />
            <ScoutAttributionBanner />
            <DonationPopup />
            <CartIcon />
            <Cart />

            <Routes>
              <Route path="/" element={<HomePage basePath={basePath} config={config} />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<OrderConfirmation />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/scout-portal"
                element={
                  <ProtectedRoute>
                    <ScoutPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ScoutProvider>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

function HomePage({ basePath, config }) {
  const handleShopClick = (e) => {
    e.preventDefault()
    const productsSection = document.getElementById('products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="App">
      {/* Hero Section with Background */}
      <section className="hero">
          <div className="hero-overlay">
            <img
              src={`${basePath}images/branding/pack182logo.png`}
              alt="Pack 182 Logo"
              className="hero-logo"
            />
            <h1>{config.content.heroTitle}</h1>
            <p className="hero-subtitle">{config.content.heroSubtitle}</p>
            <p className="hero-location">{config.pack.location}</p>
            <div className="hero-cta">
              <a href="#products" className="btn btn-primary shop-btn" onClick={handleShopClick}>
                <span>Shop All Products</span>
                <span className="down-arrow">↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* Products Preview */}
        <section id="products" className="products-preview">
          <h2>Our Holiday Products</h2>
          <p className="product-disclaimer">{config.productDisclaimer}</p>

          {/* Wreaths Section */}
          <div className="product-category">
            <h3 className="category-title">Wreaths - $35 Each</h3>
            <div className="products-grid">
              {config.products.filter(p => p.category === 'wreaths' && p.active !== false).map(product => (
                <ProductCard key={product.id} product={product} basePath={basePath} />
              ))}
            </div>
          </div>

          {/* Poinsettias Section */}
          <div className="product-category">
            <h3 className="category-title">Poinsettias</h3>
            <div className="products-grid">
              {config.products.filter(p => p.category === 'poinsettias' && p.active !== false).map(product => (
                <ProductCard key={product.id} product={product} basePath={basePath} />
              ))}
            </div>
          </div>

          {/* Other Plants Section */}
          <div className="product-category">
            <h3 className="category-title">Other Plants</h3>
            <div className="products-grid">
              {config.products.filter(p => p.category === 'plants' && p.active !== false).map(product => (
                <ProductCard key={product.id} product={product} basePath={basePath} />
              ))}
            </div>
          </div>
        </section>

      {/* Scout Law Animated Display */}
      <ScoutLawAnimated examples={config.scoutLaw.examples} />

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/faq" className="footer-link">Frequently Asked Questions</Link>
          </div>
          <div className="footer-info">
            <p>&copy; 2025 {config.pack.name} - {config.pack.location}</p>
            <p className="footer-small">Supporting our scouts through the holiday season</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
