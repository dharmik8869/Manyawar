import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateQuantity, removeFromCart } from '../Redux/cartActions'
import { useToast } from '../Context/ToastContext'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const cartItems = useSelector(state => state.cart.items)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateQuantity(index, newQuantity))
  }

  const handleRemoveItem = (index, itemName) => {
    dispatch(removeFromCart(index))
    toast.success(`${itemName} removed from cart`, 'Item Removed')
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateGST = () => {
    return cartItems.reduce((total, item) => {
      const gstRate = item.gst || 12 // Default to 12% if not specified
      const gstAmount = (item.price * item.quantity * gstRate) / 100
      return total + gstAmount
    }, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const gst = calculateGST()
    const shipping = subtotal > 200 ? 0 : 15
    return subtotal + gst + shipping
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.images?.[0] || item.img} alt={item.name} />
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <p className="item-size">Size: {item.selectedSize}</p>
                <p className="item-price">
                  ₹{(item.price * 83).toFixed(2)}
                  <span className="gst-badge">+{item.gst || 12}% GST</span>
                </p>
              </div>

              <div className="item-quantity">
                <button onClick={() => handleUpdateQuantity(index, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(index, item.quantity + 1)}>+</button>
              </div>

              <div className="item-total">
                <p>₹{(item.price * item.quantity * 83).toFixed(2)}</p>
              </div>

              <button className="remove-btn" onClick={() => handleRemoveItem(index, item.name)} title="Remove from cart">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{(calculateSubtotal() * 83).toFixed(2)}</span>
          </div>

          <div className="summary-row gst-row">
            <span>GST (Tax)</span>
            <span>₹{(calculateGST() * 83).toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{calculateSubtotal() > 200 ? 'FREE' : `₹${(15 * 83).toFixed(2)}`}</span>
          </div>

          {calculateSubtotal() > 200 && (
            <div className="free-shipping-msg">
              🎉 You've qualified for FREE shipping!
            </div>
          )}

          {calculateSubtotal() <= 200 && (
            <div className="shipping-msg">
              Add ₹{((200 - calculateSubtotal()) * 83).toFixed(2)} more for FREE shipping
            </div>
          )}

          <hr />

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{(calculateTotal() * 83).toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>

          <button className="continue-shopping" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>

          <div className="payment-icons">
            <p>We Accept:</p>
            <div className="icons">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
