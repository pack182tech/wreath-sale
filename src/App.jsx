import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { ScoutProvider } from './context/ScoutContext'
import Cart from './components/Cart'
import CartIcon from './components/CartIcon'
import ProductCard from './components/ProductCard'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import Leaderboard from './pages/Leaderboard'
import FAQ from './pages/FAQ'
import { initializeMockData } from './utils/mockData'
import './styles/App.css'
import config from './config/content.json'

function App() {
  const basePath = import.meta.env.BASE_URL

  useEffect(() => {
    // Initialize mock data on app load
    initializeMockData()
  }, [])

  return (
    <CartProvider>
      <Router>
        <ScoutProvider>
          <CartIcon />
          <Cart />

          <Routes>
            <Route path="/" element={<HomePage basePath={basePath} config={config} />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </ScoutProvider>
      </Router>
    </CartProvider>
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
              <a href="/leaderboard" className="btn btn-secondary">View Leaderboard</a>
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
              {config.products.filter(p => p.category === 'wreaths').map(product => (
                <ProductCard key={product.id} product={product} basePath={basePath} />
              ))}
            </div>
          </div>

          {/* Poinsettias Section */}
          <div className="product-category">
            <h3 className="category-title">Poinsettias</h3>
            <div className="products-grid">
              {config.products.filter(p => p.category === 'poinsettias').map(product => (
                <ProductCard key={product.id} product={product} basePath={basePath} />
              ))}
            </div>
          </div>

          {/* Other Plants Section */}
          <div className="product-category">
            <h3 className="category-title">Other Plants</h3>
            <div className="products-grid">
              {config.products.filter(p => p.category === 'plants').map(product => (
                <ProductCard key={product.id} product={product} basePath={basePath} />
              ))}
            </div>
          </div>
        </section>

      {/* Scout Law Scroll */}
      <div className="scout-law-scroll">
        <div className="scroll-content">
          {config.scoutLaw.text} • {config.scoutLaw.text} • {config.scoutLaw.text}
        </div>
      </div>
    </div>
  )
}

export default App
