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
                <div key={product.id} className="product-card">
                  <img
                    src={`${basePath}images/products/${product.image}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = `${basePath}images/products/placeholder.png`
                      e.target.style.opacity = '0.5'
                    }}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Poinsettias Section */}
          <div className="product-category">
            <h3 className="category-title">Poinsettias</h3>
            <div className="products-grid">
              {config.products.filter(p => p.category === 'poinsettias').map(product => (
                <div key={product.id} className="product-card">
                  <img
                    src={`${basePath}images/products/${product.image}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = `${basePath}images/products/placeholder.png`
                      e.target.style.opacity = '0.5'
                    }}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Plants Section */}
          <div className="product-category">
            <h3 className="category-title">Other Plants</h3>
            <div className="products-grid">
              {config.products.filter(p => p.category === 'plants').map(product => (
                <div key={product.id} className="product-card">
                  <img
                    src={`${basePath}images/products/${product.image}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = `${basePath}images/products/placeholder.png`
                      e.target.style.opacity = '0.5'
                    }}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>
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
  )
}

export default App
