import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, LOAD_CART, CLEAR_CART } from './cartActions'

// Initial State
const initialState = {
  items: []
}

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    return []
  }
}

// Save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

// Cart Reducer
const cartReducer = (state = { items: loadCartFromStorage() }, action) => {
  let newItems

  switch (action.type) {
    case ADD_TO_CART:
      newItems = [...state.items, action.payload]
      saveCartToStorage(newItems)
      return {
        ...state,
        items: newItems
      }

    case REMOVE_FROM_CART:
      newItems = state.items.filter((_, index) => index !== action.payload)
      saveCartToStorage(newItems)
      return {
        ...state,
        items: newItems
      }

    case UPDATE_QUANTITY:
      newItems = state.items.map((item, index) => 
        index === action.payload.index 
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      saveCartToStorage(newItems)
      return {
        ...state,
        items: newItems
      }

    case LOAD_CART:
      return {
        ...state,
        items: action.payload
      }

    case CLEAR_CART:
      saveCartToStorage([])
      return {
        ...state,
        items: []
      }

    default:
      return state
  }
}

export default cartReducer
