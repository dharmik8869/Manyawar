import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { useToast } from '../Context/ToastContext'
import './Orders.css'

export default function Orders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [trackingOrder, setTrackingOrder] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Load orders from localStorage (in real app, fetch from API)
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [isAuthenticated, navigate])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered'
      case 'Shipped':
        return 'status-shipped'
      case 'Processing':
        return 'status-processing'
      case 'Cancelled':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return '✓'
      case 'Shipped':
        return '🚚'
      case 'Processing':
        return '⏳'
      case 'Cancelled':
        return '✕'
      default:
        return '📦'
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'Cancelled' } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    
    // Update selected order if modal is open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'Cancelled' })
    }
    
    toast.info(`Order #${orderId} has been cancelled`, 'Order Cancelled')
  }

  const handleRemoveOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId)
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    
    // Close modal if the removed order was being viewed
    if (selectedOrder && selectedOrder.id === orderId) {
      closeModal()
    }
    
    toast.success(`Order #${orderId} removed from history`, 'Order Removed')
  }

  const handleTrackOrder = (order) => {
    setTrackingOrder(order)
    setShowTrackingModal(true)
  }

  const closeTrackingModal = () => {
    setShowTrackingModal(false)
    setTrackingOrder(null)
  }

  const getTrackingSteps = (status) => {
    const steps = [
      { label: 'Order Placed', status: 'completed', icon: '📦' },
      { label: 'Processing', status: 'completed', icon: '⚙️' },
      { label: 'Shipped', status: status === 'Shipped' || status === 'Delivered' ? 'completed' : status === 'Processing' ? 'current' : 'pending', icon: '🚚' },
      { label: 'Out for Delivery', status: status === 'Delivered' ? 'completed' : status === 'Shipped' ? 'current' : 'pending', icon: '🏃' },
      { label: 'Delivered', status: status === 'Delivered' ? 'completed' : 'pending', icon: '✓' }
    ]

    if (status === 'Cancelled') {
      return [
        { label: 'Order Placed', status: 'completed', icon: '📦' },
        { label: 'Cancelled', status: 'cancelled', icon: '✕' }
      ]
    }

    return steps
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-orders-content">
          <div className="order-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>Looks like you haven't placed any orders yet.</p>
          <button onClick={() => navigate('/products')}>
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
      </div>

      <div className="orders-container">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header-section">
              <div className="order-info-left">
                <h3>Order #{order.id}</h3>
                <p className="order-date">Placed on {order.date}</p>
              </div>
              <div className="order-info-right">
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.images?.[0] || item.img} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-meta">
                      Size: {item.selectedSize} | Qty: {item.quantity}
                    </p>
                    <p className="item-price">₹{(item.price * 83).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>Total Amount:</span>
                <span className="total-price">₹{order.total ? (order.total * 83).toFixed(2) : '0.00'}</span>
              </div>
              <div className="order-actions">
                <button className="view-details-btn" onClick={() => handleViewDetails(order)}>View Details</button>
                {order.status === 'Delivered' && (
                  <button className="reorder-btn">Reorder</button>
                )}
                {(order.status === 'Processing' || order.status === 'Shipped') && (
                  <button className="cancel-btn" onClick={() => handleCancelOrder(order.id)}>Cancel Order</button>
                )}
                {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                  <button className="remove-order-btn" onClick={() => handleRemoveOrder(order.id)}>Remove</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-header">
              <h2>Order Details</h2>
              <span className={`order-status ${getStatusColor(selectedOrder.status)}`}>
                {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
              </span>
            </div>

            <div className="modal-body">
              {/* Order Info */}
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value">#{selectedOrder.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Order Date:</span>
                    <span className="detail-value">{selectedOrder.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">
                      {selectedOrder.paymentMethod === 'card' ? '💳 Card' : 
                       selectedOrder.paymentMethod === 'upi' ? '📱 UPI' : '💵 Cash on Delivery'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="detail-section">
                  <h3>Shipping Address</h3>
                  <div className="address-box">
                    <p><strong>{selectedOrder.shippingAddress.name}</strong></p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="detail-section">
                <h3>Order Items ({selectedOrder.items.length})</h3>
                <div className="modal-items">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="modal-item">
                      <img src={item.images?.[0] || item.img} alt={item.name} />
                      <div className="modal-item-details">
                        <h4>{item.name}</h4>
                        <p className="modal-item-category">{item.category}</p>
                        <p className="modal-item-meta">
                          Size: <strong>{item.selectedSize}</strong> | Quantity: <strong>{item.quantity}</strong>
                        </p>
                        <p className="modal-item-price">₹{(item.price * 83).toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="modal-item-total">
                        <span>₹{(item.price * item.quantity * 83).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="detail-section">
                <h3>Price Details</h3>
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.total ? ((selectedOrder.total - (selectedOrder.total * 0.12) - 15) * 83).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="price-row">
                    <span>GST (12%):</span>
                    <span>₹{selectedOrder.total ? ((selectedOrder.total * 0.12) * 83).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="price-row">
                    <span>Shipping:</span>
                    <span>₹{(15 * 83).toFixed(2)}</span>
                  </div>
                  <div className="price-row total-row">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.total ? (selectedOrder.total * 83).toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-action-buttons">
                {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                  <button className="track-order-btn" onClick={() => handleTrackOrder(selectedOrder)}>
                    📍 Track Order
                  </button>
                )}
                {(selectedOrder.status === 'Processing' || selectedOrder.status === 'Shipped') && (
                  <button className="modal-cancel-btn" onClick={() => handleCancelOrder(selectedOrder.id)}>
                    ✕ Cancel Order
                  </button>
                )}
                {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') && (
                  <button className="modal-remove-btn" onClick={() => handleRemoveOrder(selectedOrder.id)}>
                    🗑️ Remove Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && trackingOrder && (
        <div className="modal-overlay" onClick={closeTrackingModal}>
          <div className="tracking-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeTrackingModal}>✕</button>
            
            <div className="tracking-header">
              <h2>Track Your Order</h2>
              <p className="tracking-order-id">Order #{trackingOrder.id}</p>
              <span className={`order-status ${getStatusColor(trackingOrder.status)}`}>
                {getStatusIcon(trackingOrder.status)} {trackingOrder.status}
              </span>
            </div>

            <div className="tracking-body">
              <div className="tracking-timeline">
                {getTrackingSteps(trackingOrder.status).map((step, index) => (
                  <div key={index} className={`tracking-step ${step.status}`}>
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-content">
                      <h4>{step.label}</h4>
                      {step.status === 'completed' && (
                        <p className="step-time">Completed</p>
                      )}
                      {step.status === 'current' && (
                        <p className="step-time">In Progress</p>
                      )}
                      {step.status === 'cancelled' && (
                        <p className="step-time">Order Cancelled</p>
                      )}
                    </div>
                    {index < getTrackingSteps(trackingOrder.status).length - 1 && (
                      <div className="step-line"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="tracking-info">
                <h3>Delivery Information</h3>
                <div className="info-box">
                  <p><strong>Order Date:</strong> {trackingOrder.date}</p>
                  {trackingOrder.shippingAddress && (
                    <>
                      <p><strong>Delivery Address:</strong></p>
                      <p>{trackingOrder.shippingAddress.name}</p>
                      <p>{trackingOrder.shippingAddress.address}</p>
                      <p>{trackingOrder.shippingAddress.city}, {trackingOrder.shippingAddress.state} {trackingOrder.shippingAddress.zipCode}</p>
                    </>
                  )}
                  {trackingOrder.status === 'Shipped' && (
                    <p className="estimated-delivery">
                      <strong>Estimated Delivery:</strong> 2-3 Business Days
                    </p>
                  )}
                  {trackingOrder.status === 'Delivered' && (
                    <p className="delivered-message">
                      ✓ Your order has been delivered successfully!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
