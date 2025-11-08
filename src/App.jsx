import { BrowserRouter as Router } from 'react-router-dom'
import './styles/App.css'
import config from './config/content.json'

function App() {
  const basePath = import.meta.env.BASE_URL

  return (
    <Router>
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
              <button className="btn btn-primary">Shop Wreaths</button>
              <button className="btn btn-secondary">Make a Donation</button>
            </div>
          </div>
        </section>

        {/* Products Preview */}
        <section className="products-preview">
          <h2>Our Wreaths - ${config.products[0].price} Each</h2>
          <div className="products-grid">
            {config.products.map(product => (
              <div key={product.id} className="product-card">
                <img
                  src={`${basePath}images/products/${product.image}`}
                  alt={product.name}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">${product.price.toFixed(2)}</p>
              </div>
            ))}
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
  )
}

export default App
