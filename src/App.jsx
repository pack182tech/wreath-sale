import { BrowserRouter as Router } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Cart from './components/Cart'
import CartIcon from './components/CartIcon'
import ProductCard from './components/ProductCard'
import './styles/App.css'
import config from './config/content.json'

function App() {
  const basePath = import.meta.env.BASE_URL

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <CartIcon />
          <Cart />
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
              <button className="btn btn-primary">Shop All Products</button>
              <button className="btn btn-secondary">Make a Donation</button>
            </div>
          </div>
        </section>

        {/* Products Preview */}
        <section className="products-preview">
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
      </Router>
    </CartProvider>
  )
}

export default App
