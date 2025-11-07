import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../Redux/cartActions'
import { addToWishlist, removeFromWishlist } from '../Redux/wishlistActions'
import { useToast } from '../Context/ToastContext'
import { useAuth } from '../Context/AuthContext'
import './ProductDetail.css'

// Import all products data
import { getAllProducts } from './productsData'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const { isAuthenticated } = useAuth()
  const cartItems = useSelector(state => state.cart.items)
  const wishlistItems = useSelector(state => state.wishlist.items)
  
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState(null)

  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    // Get all products and find the one with matching ID
    const allProducts = getAllProducts()
    const foundProduct = allProducts.find(p => p.id === parseInt(id))
    
    if (foundProduct) {
      setProduct({
        ...foundProduct,
        sizes: foundProduct.size || ["S", "M", "L", "XL"],
        originalPrice: Math.round(foundProduct.price * 1.3),
        discount: 23,
        description: `Elevate your ethnic wardrobe with this stunning ${foundProduct.name}. Perfect for weddings, festivals, and special occasions. Crafted with premium fabric and intricate detailing.`,
        images: [foundProduct.img, foundProduct.img, foundProduct.img],
        colors: ["Default"],
        features: [
          "Premium quality fabric",
          "Intricate design",
          "Comfortable fit",
          "Dry clean only",
          "Made in India"
        ],
        inStock: true
      })

      // Get related products from same category, excluding current product
      const related = allProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4)
      
      // If not enough products in same category, add random products
      if (related.length < 4) {
        const additionalProducts = allProducts
          .filter(p => p.id !== foundProduct.id && !related.includes(p))
          .slice(0, 4 - related.length)
        setRelatedProducts([...related, ...additionalProducts])
      } else {
        setRelatedProducts(related)
      }
    }
  }, [id])

  if (!product) {
    return <div className="loading">Loading product...</div>
  }

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart', 'Login Required')
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    if (!selectedSize) {
      toast.warning('Please select a size before adding to cart', 'Size Required')
      return
    }
    
    const cartItem = {
      ...product,
      selectedSize,
      quantity
    }
    
    // Check if item already exists in Redux store
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.selectedSize === selectedSize
    )
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newQuantity = cartItems[existingItemIndex].quantity + quantity
      dispatch({ type: 'UPDATE_QUANTITY', payload: { index: existingItemIndex, quantity: newQuantity } })
      toast.success(`Updated quantity to ${newQuantity}`, 'Cart Updated!')
    } else {
      // Add new item to cart
      dispatch(addToCart(cartItem))
      toast.success(`${product.name} added to cart`, 'Added to Cart!')
    }
    
    setTimeout(() => navigate('/cart'), 1000)
  }

  return (
    <div className="product-detail-page">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> / 
        <span onClick={() => navigate('/products')}> Products</span> / 
        <span> {product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Image Gallery */}
        <div className="product-images">
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
          </div>
          <div className="thumbnail-images">
            {product.images.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`${product.name} ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-detail">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          
          <div className="price-section">
            <span className="current-price">₹{(product.price * 83).toFixed(2)}</span>
            <span className="original-price">₹{(product.originalPrice * 83).toFixed(2)}</span>
            <span className="discount">{product.discount}% OFF</span>
          </div>
          
          <div className="gst-info">
            <p>Base Price: <strong>₹{(product.price * 83).toFixed(2)}</strong></p>
            <p>GST ({product.gst || 12}%): <strong>₹{((product.price * 83 * (product.gst || 12)) / 100).toFixed(2)}</strong></p>
            <p style={{fontWeight: 'bold', fontSize: '16px'}}>Total Price (incl. GST): ₹{((product.price * 83) + (product.price * 83 * (product.gst || 12)) / 100).toFixed(2)}</p>
          </div>

          <div className="stock-status">
            {product.inStock ? (
              <span className="in-stock">✓ In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="size-selector">
            <h3>Select Size</h3>
            <div className="size-options">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className={selectedSize === size ? 'active' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <a href="#" className="size-guide">Size Guide</a>
          </div>

          <div className="quantity-selector">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button 
              className={`wishlist-btn ${wishlistItems.find(item => item.id === product.id) ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                
                // Check if user is logged in
                if (!isAuthenticated) {
                  toast.warning('Please login to add items to wishlist', 'Login Required')
                  setTimeout(() => navigate('/login'), 1500)
                  return
                }
                
                const isInWishlist = wishlistItems.find(item => item.id === product.id)
                if (isInWishlist) {
                  dispatch(removeFromWishlist(product.id))
                  toast.info(`${product.name} removed from wishlist`, 'Removed')
                } else {
                  dispatch(addToWishlist(product))
                  toast.success(`${product.name} added to wishlist`, 'Added to Wishlist!')
                }
              }}
            >
              {wishlistItems.find(item => item.id === product.id) ? '♥' : '♡'} 
              {wishlistItems.find(item => item.id === product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          <div className="product-description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-features">
            <h3>Features</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="related-products">
        <h2>You May Also Like</h2>
        <div className="related-grid">
          {relatedProducts.map(item => (
            <div 
              key={item.id} 
              className="related-card" 
              onClick={() => {
                navigate(`/product/${item.id}`)
                window.scrollTo(0, 0)
              }}
            >
              <img src={item.img} alt={item.name} />
              <p className="related-name">{item.name}</p>
              <p className="related-category">{item.category}</p>
              <p className="price">₹{(item.price * 83).toFixed(2)} <span className="gst-text">+ {item.gst}% GST</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
