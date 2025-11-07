import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useToast } from '../Context/ToastContext'
import { allProductsData } from './productsData'
import './Products.css'

export default function Products() {
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const genderParam = searchParams.get('category') || 'men'
  const searchQuery = searchParams.get('search') || ''
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedSize, setSelectedSize] = useState('All')
  const [gender, setGender] = useState(genderParam)

  useEffect(() => {
    window.scrollTo(0, 0)
    setGender(genderParam)
    setSelectedCategory('All')
    setPriceRange([0, 500])
    setSelectedSize('All')
  }, [genderParam])

  const allProducts = allProductsData
  const products = allProducts[gender] || allProducts.men

  const categoryOptions = {
    men: ['All', 'Sherwani', 'Kurta Sets', 'Indo Western', 'Jackets'],
    women: ['All', 'Lehenga', 'Saree', 'Anarkali'],
    kids: ['All', 'Kurta Sets', 'Sherwani', 'Lehenga', 'Anarkali', 'Jackets']
  }

  const sizeOptions = {
    men: ['All', 'S', 'M', 'L', 'XL', 'XXL'],
    women: ['All', 'S', 'M', 'L', 'XL', 'Free Size'],
    kids: ['All', '2-3Y', '4-5Y', '6-7Y', '8-9Y']
  }

  const categories = categoryOptions[gender] || categoryOptions.men
  const sizes = sizeOptions[gender] || sizeOptions.men

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    const sizeMatch = selectedSize === 'All' || product.size.includes(selectedSize)
    
    // Search functionality
    const searchMatch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && priceMatch && sizeMatch && searchMatch
  })

  return (
    <div className="products-page">
      {/* Sidebar Filter */}
      <aside className="filter-sidebar">
        <h3>Filters</h3>
        
        <div className="filter-section">
          <h4>Category</h4>
          {categories.map(cat => (
            <label key={cat}>
              <input 
                type="radio" 
                name="category" 
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h4>Price Range</h4>
          <input 
            type="range" 
            min="0" 
            max="500" 
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          />
          <p>₹{(priceRange[0] * 83).toFixed(0)} - ₹{(priceRange[1] * 83).toFixed(0)}</p>
        </div>

        <div className="filter-section">
          <h4>Size</h4>
          {sizes.map(size => (
            <label key={size}>
              <input 
                type="radio" 
                name="size" 
                checked={selectedSize === size}
                onChange={() => setSelectedSize(size)}
              />
              {size}
            </label>
          ))}
        </div>

        <button className="clear-filters" onClick={() => {
          setSelectedCategory('All')
          setPriceRange([0, 500])
          setSelectedSize('All')
        }}>
          Clear All Filters
        </button>
      </aside>

      {/* Products Grid */}
      <div className="products-container">
        <div className="products-header">
          <h1>{searchQuery ? `Search Results for "${searchQuery}"` : `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection`}</h1>
          <p>{filteredProducts.length} Products</p>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.img} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/283x395/8B0000/FFFFFF?text=Product+Image';
                  }}
                />
                <button className="wishlist-btn" onClick={(e) => {e.preventDefault(); toast.success('Added to your wishlist', 'Wishlist Updated!')}}>♡</button>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">₹{(product.price * 83).toFixed(2)} <span style={{fontSize: '0.8em', color: '#888'}}>+ {product.gst || 12}% GST</span></p>
                <p className="product-category">{product.category}</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
