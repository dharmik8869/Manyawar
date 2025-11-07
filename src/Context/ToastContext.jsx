import React, { createContext, useContext, useState } from 'react'
import '../Component/Toast.css'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'info', title = '') => {
    const id = Date.now()
    const newToast = { id, message, type, title }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (message, title = 'Success!') => {
    showToast(message, 'success', title)
  }

  const error = (message, title = 'Error!') => {
    showToast(message, 'error', title)
  }

  const info = (message, title = 'Info') => {
    showToast(message, 'info', title)
  }

  const warning = (message, title = 'Warning!') => {
    showToast(message, 'warning', title)
  }

  const getIcon = (type) => {
    switch(type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      case 'info': return 'ℹ'
      default: return 'ℹ'
    }
  }

  const getProgressBar = (type) => {
    const colors = {
      success: 'rgba(255, 255, 255, 0.3)',
      error: 'rgba(255, 255, 255, 0.3)',
      warning: 'rgba(255, 255, 255, 0.3)',
      info: 'rgba(255, 255, 255, 0.3)'
    }
    return colors[type] || colors.info
  }

  return (
    <ToastContext.Provider value={{ success, error, info, warning, showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-progress" style={{ background: getProgressBar(toast.type) }}></div>
            <span className="toast-icon">{getIcon(toast.type)}</span>
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
