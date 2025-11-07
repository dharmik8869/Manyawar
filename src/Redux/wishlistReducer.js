import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, CLEAR_WISHLIST } from './wishlistActions'

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const savedWishlist = localStorage.getItem('wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error)
    return []
  }
}

// Save wishlist to localStorage
const saveWishlistToStorage = (items) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(items))
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error)
  }
}

// Wishlist Reducer
const wishlistReducer = (state = { items: loadWishlistFromStorage() }, action) => {
  let newItems

  switch (action.type) {
    case ADD_TO_WISHLIST:
      // Check if item already exists
      const exists = state.items.find(item => item.id === action.payload.id)
      if (exists) {
        return state
      }
      newItems = [...state.items, action.payload]
      saveWishlistToStorage(newItems)
      return {
        ...state,
        items: newItems
      }

    case REMOVE_FROM_WISHLIST:
      newItems = state.items.filter(item => item.id !== action.payload)
      saveWishlistToStorage(newItems)
      return {
        ...state,
        items: newItems
      }

    case CLEAR_WISHLIST:
      saveWishlistToStorage([])
      return {
        ...state,
        items: []
      }

    default:
      return state
  }
}

export default wishlistReducer
