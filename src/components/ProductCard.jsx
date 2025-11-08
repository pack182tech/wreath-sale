import { useCart } from '../context/CartContext'

function ProductCard({ product, basePath }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: `${basePath}images/products/${product.image}`
    })
  }

  return (
    <div className="product-card">
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
      <button className="btn btn-primary btn-add-to-cart" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard
