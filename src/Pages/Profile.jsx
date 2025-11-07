import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { useToast } from '../Context/ToastContext'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateUser } = useAuth()
  const toast = useToast()

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Load user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'India'
      })
    }
  }, [isAuthenticated, user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // Validate
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required', 'Validation Error')
      return
    }

    // Update user (in real app, call API)
    if (updateUser) {
      updateUser(formData)
    }
    
    // Save to localStorage
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    setIsEditing(false)
    toast.success('Profile updated successfully!', 'Success')
  }

  const handleCancel = () => {
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'India'
      })
    }
    setIsEditing(false)
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{formData.name.charAt(0).toUpperCase()}</span>
          </div>
          <h1>{formData.name}</h1>
          <p className="profile-email">{formData.email}</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    ✓ Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    ✕ Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{formData.name || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{formData.email || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                    />
                  ) : (
                    <p>{formData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Country</label>
                  {isEditing ? (
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  ) : (
                    <p>{formData.country || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                  />
                ) : (
                  <p>{formData.address || 'Not provided'}</p>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{formData.city || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{formData.state || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{formData.zipCode || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-quick-links">
            <h3>Quick Links</h3>
            <div className="quick-link-card" onClick={() => navigate('/orders')}>
              <span className="link-icon">📦</span>
              <div>
                <h4>My Orders</h4>
                <p>Track and manage your orders</p>
              </div>
            </div>
            <div className="quick-link-card" onClick={() => navigate('/wishlist')}>
              <span className="link-icon">♡</span>
              <div>
                <h4>My Wishlist</h4>
                <p>View your saved items</p>
              </div>
            </div>
            <div className="quick-link-card" onClick={() => navigate('/cart')}>
              <span className="link-icon">🛒</span>
              <div>
                <h4>Shopping Cart</h4>
                <p>View items in your cart</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
