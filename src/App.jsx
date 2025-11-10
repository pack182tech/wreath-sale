// Pack 182 Wreath Sale Platform
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react'
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
import { initializeMockData } from './utils/mockData'
import { getConfig } from './utils/configLoader'
import './styles/App.css'

function App() {
  const basePath = import.meta.env.BASE_URL

  useEffect(() => {
    // Initialize mock data on app load
    initializeMockData()
  }, [])

  const config = getConfig()

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScoutProvider>
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
              <a href="#products" className="btn btn-primary">Shop All Products</a>
              <Link to="/leaderboard" className="btn btn-secondary">View Leaderboard</Link>
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
