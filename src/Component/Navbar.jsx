import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";
import "./CSS/Navbar.css"

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const toast = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get cart and wishlist items from Redux store
  const cartItems = useSelector(state => state.cart.items);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Logo Banner */}
      <div className="top-logo-banner">
        <img 
          src="https://www.manyavar.com/on/demandware.static/-/Library-Sites-ManyavarSharedLibrary/default/dw387c7af1/images/Manvayar-Crest-Mohey_Horizontal_3D_logo_Desktop.png" 
          alt="Manyavar Logo" 
          className="banner-logo"
        />
      
      </div>

      <div className="navbar">
        {/* Left Logo + Menu */}
        <div className="navbar-left">
        <Link to="/">
          <img
            src="https://www.manyavar.com/on/demandware.static/-/Library-Sites-ManyavarSharedLibrary/default/dw4de42c59/images/Crest_3D_1.svg"
            alt="logo"
            className="logo"
          />
        </Link>
        <Link to="/products?category=men">MEN</Link>
        <Link to="/products?category=women">WOMEN</Link>
        <Link to="/products?category=kids">KIDS</Link>
      </div>

      {/* Middle Extra Links */}
      <div className="navbar-middle">
        <span className="new">NEW WEDDING CLOSET</span>
        <span>APPOINTMENTS</span>
        <span>STORES</span>
      </div>

      {/* Search Box */}
      <form className="search-box" onSubmit={handleSearch}>
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search for products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Right Icons */}
      <div className="navbar-right">
        {isAuthenticated ? (
          <div className="user-menu">
            <div 
              className="user-profile" 
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FaUser />
              <span className="username">{user?.name}</span>
            </div>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-item" onClick={() => {
                  setShowUserMenu(false);
                  navigate('/profile');
                }}>
                  My Profile
                </div>
                <div className="dropdown-item" onClick={() => {
                  setShowUserMenu(false);
                  navigate('/orders');
                }}>
                  My Orders
                </div>
                <div className="dropdown-item logout" onClick={() => {
                  logout();
                  setShowUserMenu(false);
                  toast.info('You have been logged out successfully', 'Logged Out');
                  navigate('/');
                }}>
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="icon user" onClick={() => navigate('/login')}>
            <FaUser />
          </div>
        )}
        
        <div className="icon wishlist-icon" onClick={() => navigate('/wishlist')}>
          <FaHeart />
          {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </div>
        <div className="icon cart-icon" onClick={() => navigate('/cart')}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </div>
      </div>
    </div>
    </>
  );
}
