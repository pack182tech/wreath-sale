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
import AdminDashboard from './pages/AdminDashboard' // New admin dashboard
import ScoutLawAnimated from './components/ScoutLawAnimated'
import VersionDisplay from './components/VersionDisplay'
import SnowEffect from './components/SnowEffect'
import { getConfig, getConfigSync } from './utils/configLoader'
import { runProductionCheck } from './utils/productionCheck'
import './styles/App.css'

function App() {
  const basePath = import.meta.env.BASE_URL
  const [configLoaded, setConfigLoaded] = useState(false)
  const [config, setConfig] = useState(null)

  // PRODUCTION: Load configuration from Google Sheets on app startup
  useEffect(() => {
    const initialize = async () => {
      // Run production checks
      await runProductionCheck()

      // Load config from Google Sheets (will cache it)
      const loadedConfig = await getConfig()
      setConfig(loadedConfig)
      setConfigLoaded(true)
    }

    initialize()
  }, [])

  // Show loading state while config loads
  if (!configLoaded || !config) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #1a2332 0%, #2d3e50 100%)',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Heavy Snow Effect */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-10px',
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                background: 'white',
                borderRadius: '50%',
                opacity: Math.random() * 0.6 + 0.4,
                animation: `snowfall ${Math.random() * 3 + 2}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Campfire */}
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 30px' }}>
            {/* Flames */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '25px',
              height: '40px',
              background: 'linear-gradient(to top, #ff4500, #ff6b00, #ffa500, #ffff00)',
              borderRadius: '50% 50% 0 0 / 60% 60% 0 0',
              animation: 'flicker 1.5s infinite alternate',
              boxShadow: '0 0 20px #ff6b00, 0 0 40px #ff4500'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '30%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '35px',
              background: 'linear-gradient(to top, #ff4500, #ff6b00, #ffa500)',
              borderRadius: '50% 50% 0 0 / 60% 60% 0 0',
              animation: 'flicker 1.3s infinite alternate',
              animationDelay: '0.3s',
              boxShadow: '0 0 15px #ff6b00'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '70%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '35px',
              background: 'linear-gradient(to top, #ff4500, #ff6b00, #ffa500)',
              borderRadius: '50% 50% 0 0 / 60% 60% 0 0',
              animation: 'flicker 1.7s infinite alternate',
              animationDelay: '0.6s',
              boxShadow: '0 0 15px #ff6b00'
            }}></div>
            {/* Logs */}
            <div style={{
              position: 'absolute',
              bottom: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '12px',
              background: '#654321',
              borderRadius: '6px',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3)'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '0px',
              left: '40%',
              transform: 'translateX(-50%) rotate(-20deg)',
              width: '50px',
              height: '10px',
              background: '#5a3a1a',
              borderRadius: '5px',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3)'
            }}></div>
          </div>

          <p style={{
            color: 'white',
            fontSize: '18px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            margin: 0
          }}>
            Setting Up Camp for the Wreath Sale...
          </p>

          <style>{`
            @keyframes flicker {
              0% { transform: translateX(-50%) scaleY(1) scaleX(1); opacity: 1; }
              25% { transform: translateX(-50%) scaleY(1.1) scaleX(0.95); opacity: 0.95; }
              50% { transform: translateX(-50%) scaleY(0.95) scaleX(1.05); opacity: 0.9; }
              75% { transform: translateX(-50%) scaleY(1.05) scaleX(0.9); opacity: 0.95; }
              100% { transform: translateX(-50%) scaleY(1) scaleX(1); opacity: 1; }
            }
            @keyframes snowfall {
              0% { transform: translateY(-10px) translateX(0); }
              100% { transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px); }
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

  // Safety check for config
  if (!config || !config.content || !config.products) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <p>Loading site content...</p>
      </div>
    )
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
