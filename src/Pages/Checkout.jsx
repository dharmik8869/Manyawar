import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useToast } from '../Context/ToastContext'
import './Checkout.css'

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const cartItems = useSelector(state => state.cart.items)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    phone: '',
    
    // Shipping Address
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Method
    paymentMethod: 'card',
    
    // Card Details (if card payment)
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Additional
    saveInfo: false,
    newsletter: false
  })

  const [errors, setErrors] = useState({})
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  // Valid coupons with discount percentages
  const validCoupons = {
    'dharmik0406': { discount: 20, description: '20% OFF' }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateGST = () => {
    return cartItems.reduce((total, item) => {
      const gstRate = item.gst || 12
      const gstAmount = (item.price * item.quantity * gstRate) / 100
      return total + gstAmount
    }, 0)
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    return subtotal > 200 ? 0 : 15
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    const subtotal = calculateSubtotal()
    return (subtotal * appliedCoupon.discount) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST() + calculateShipping() - calculateDiscount()
  }

  const handleApplyCoupon = () => {
    const trimmedCode = couponCode.trim()
    
    if (!trimmedCode) {
      setCouponError('Please enter a coupon code')
      return
    }

    if (validCoupons[trimmedCode]) {
      const coupon = validCoupons[trimmedCode]
      setAppliedCoupon(coupon)
      setCouponError('')
      
      // Calculate discount amount
      const subtotal = calculateSubtotal()
      const discountAmount = (subtotal * coupon.discount) / 100
      
      toast.success(`Coupon applied! You saved ₹${(discountAmount * 83).toFixed(2)}`, 'Discount Applied')
    } else {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
    toast.info('Coupon removed', 'Coupon')
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    // Required fields
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode']
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })

    // Card validation (if card payment selected)
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required'
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits'
      }

      if (!formData.cardName) {
        newErrors.cardName = 'Cardholder name is required'
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required'
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Format: MM/YY'
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required'
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3-4 digits'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly', 'Validation Error')
      return
    }

    // Create order object
    const order = {
      id: Date.now().toString().slice(-8),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      status: 'Processing',
      items: cartItems,
      total: calculateTotal(),
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      paymentMethod: formData.paymentMethod
    }

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    existingOrders.unshift(order)
    localStorage.setItem('orders', JSON.stringify(existingOrders))

    // Simulate order processing
    toast.success('Order placed successfully!', 'Success')
    
    // Clear cart
    dispatch({ type: 'CLEAR_CART' })
    
    // Navigate to orders page
    setTimeout(() => {
      navigate('/orders')
      toast.info('Thank you for your order! Check your email for confirmation.', 'Order Confirmed')
    }, 1500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <div className="empty-checkout-content">
          <h2>Your Cart is Empty</h2>
          <p>Add items to your cart before checking out.</p>
          <button onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Side - Form */}
        <div className="checkout-form-section">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <button className="back-to-cart" onClick={() => navigate('/cart')}>
              ← Back to Cart
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="form-section">
              <h2>Shipping Address</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="apartment">Apartment, suite, etc. (optional)</label>
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <label className={`payment-option ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  <span>💳 Credit/Debit Card</span>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'upi' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                  />
                  <span>📱 UPI</span>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <span>💵 Cash on Delivery</span>
                </label>
              </div>

              {/* Card Details (shown only if card payment is selected) */}
              {formData.paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardName">Cardholder Name *</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date *</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={errors.expiryDate ? 'error' : ''}
                      />
                      {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="cvv">CVV *</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        className={errors.cvv ? 'error' : ''}
                      />
                      {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="form-section">
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                  />
                  <span>Save this information for next time</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                  />
                  <span>Subscribe to our newsletter for exclusive offers</span>
                </label>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order - ₹{(calculateTotal() * 83).toFixed(2)}
            </button>
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div className="checkout-summary-section">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {cartItems.map((item, index) => (
              <div key={index} className="summary-item">
                <img src={item.images?.[0] || item.img} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Size: {item.selectedSize} | Qty: {item.quantity}</p>
                  <p className="item-price">₹{(item.price * item.quantity * 83).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="coupon-section">
            <h3>Have a Coupon?</h3>
            {!appliedCoupon ? (
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value)
                    setCouponError('')
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button onClick={handleApplyCoupon}>Apply</button>
              </div>
            ) : (
              <div className="applied-coupon">
                <div className="coupon-info">
                  <span className="coupon-code">🎉 {couponCode.toUpperCase()}</span>
                  <span className="coupon-discount">{appliedCoupon.description}</span>
                </div>
                <button className="remove-coupon" onClick={handleRemoveCoupon}>✕</button>
              </div>
            )}
            {couponError && <span className="coupon-error">{couponError}</span>}
          </div>

          <div className="summary-calculations">
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{(calculateSubtotal() * 83).toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>GST (Tax)</span>
              <span>₹{(calculateGST() * 83).toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{calculateShipping() === 0 ? 'FREE' : `₹${(calculateShipping() * 83).toFixed(2)}`}</span>
            </div>

            {appliedCoupon && (
              <div className="summary-row discount-row">
                <span>Discount ({appliedCoupon.description})</span>
                <span className="discount-amount">-₹{(calculateDiscount() * 83).toFixed(2)}</span>
              </div>
            )}

            {calculateSubtotal() > 200 && (
              <div className="free-shipping-badge">
                🎉 FREE Shipping Applied!
              </div>
            )}

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(calculateTotal() * 83).toFixed(2)}</span>
            </div>
          </div>

          <div className="secure-checkout">
            <p>🔒 Secure Checkout</p>
            <p className="secure-text">Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  )
}
