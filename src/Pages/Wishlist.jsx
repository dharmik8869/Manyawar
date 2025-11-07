import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromWishlist } from '../Redux/wishlistActions'
import { addToCart } from '../Redux/cartActions'
import { useToast } from '../Context/ToastContext'
import './Wishlist.css'

export default function Wishlist() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const wishlistItems = useSelector(state => state.wishlist.items)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId))
    toast.info('Item removed from wishlist', 'Removed')
  }

  const handleMoveToCart = (product) => {
    const cartItem = {
      ...product,
      selectedSize: product.sizes?.[0] || product.size?.[0] || 'M',
      quantity: 1
    }
    dispatch(addToCart(cartItem))
    dispatch(removeFromWishlist(product.id))
    toast.success(`${product.name} moved to cart`, 'Added to Cart!')
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="empty-wishlist">
        <div className="empty-wishlist-content">
          <div className="heart-icon">♡</div>
          <h2>Your Wishlist is Empty</h2>
          <p>Save your favorite items here and shop them later.</p>
          <button onClick={() => navigate('/products')}>
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <div key={item.id} className="wishlist-card">
            <button 
              className="remove-btn"
              onClick={() => handleRemoveFromWishlist(item.id)}
            >
              ✕
            </button>
            
            <div 
              className="wishlist-image"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.images?.[0] || item.img} alt={item.name} />
            </div>

            <div className="wishlist-info">
              <h3 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
              <p className="category">{item.category}</p>
              
              <div className="price-section">
                <span className="current-price">${item.price}</span>
                {item.originalPrice && (
                  <>
                    <span className="original-price">${item.originalPrice}</span>
                    <span className="discount">{item.discount}% OFF</span>
                  </>
                )}
              </div>

              <div className="gst-info">
                <span className="gst-text">+ {item.gst || 12}% GST</span>
              </div>

              {item.inStock !== false ? (
                <button 
                  className="move-to-cart-btn"
                  onClick={() => handleMoveToCart(item)}
                >
                  Move to Cart
                </button>
              ) : (
                <button className="out-of-stock-btn" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
