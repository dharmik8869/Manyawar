import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { useToast } from '../Context/ToastContext'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, register, isAuthenticated } = useAuth()
  const toast = useToast()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // If already logged in, redirect to home
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields', 'Validation Error')
      return
    }
    
    if (isLogin) {
      // Login logic
      const userData = {
        name: formData.email.split('@')[0], // Use email prefix as name
        email: formData.email
      }
      login(userData)
      toast.success(`Welcome back, ${userData.name}!`, 'Login Successful')
      setTimeout(() => navigate('/'), 1000)
    } else {
      // Register validation
      if (!formData.name || !formData.phone) {
        toast.error('Please fill in all required fields', 'Validation Error')
        return
      }
      
      // Register logic
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }
      register(userData)
      toast.success(`Account created successfully! Welcome, ${userData.name}!`, 'Registration Successful')
      setTimeout(() => navigate('/'), 1000)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image">
          <img 
            src="https://manyavar.scene7.com/is/image/manyavar/HP_Hero_Banner_D_NEW_06-05-2025-10-24?$WT_HP%2FMLP%2FWLP_Hero_D$" 
            alt="Manyavar"
          />
          <div className="overlay">
            <h2>Welcome to Manyavar</h2>
            <p>Discover the finest ethnic wear collection</p>
          </div>
        </div>

        <div className="login-form-container">
          <div className="form-toggle">
            <button 
              className={isLogin ? 'active' : ''}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={!isLogin ? 'active' : ''}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Enter your phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          {isLogin ? (
            <p className="switch-form">
              Don't have an account? 
              <span onClick={() => setIsLogin(false)}> Register here</span>
            </p>
          ) : (
            <p className="switch-form">
              Already have an account? 
              <span onClick={() => setIsLogin(true)}> Login here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
