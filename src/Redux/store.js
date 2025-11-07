import { createStore, combineReducers } from 'redux'
import cartReducer from './cartReducer'
import wishlistReducer from './wishlistReducer'

// Combine Reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer
})

// Create Redux Store
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
