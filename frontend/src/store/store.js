import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/authSlice.js'
import profileReducer from '../store/profileSlice.js'
import cartReducer from '../store/cartSlice.js'

const store = configureStore({
    reducer : {
        auth : authReducer,
        profile : profileReducer,
        cart : cartReducer
    }
})

export default store