// Action Types
export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY'
export const LOAD_CART = 'LOAD_CART'
export const CLEAR_CART = 'CLEAR_CART'

// Action Creators
export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product
})

export const removeFromCart = (index) => ({
  type: REMOVE_FROM_CART,
  payload: index
})

export const updateQuantity = (index, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { index, quantity }
})

export const loadCart = (cartItems) => ({
  type: LOAD_CART,
  payload: cartItems
})

export const clearCart = () => ({
  type: CLEAR_CART
})
