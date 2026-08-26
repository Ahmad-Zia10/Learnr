import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/authSlice.js'
import profileReducer from '../store/profileSlice.js'
import cartReducer from '../store/cartSlice.js'
import { authApi } from "../services/authApi.js";


const store = configureStore({
    reducer : {
        auth : authReducer,
        profile : profileReducer,
        cart : cartReducer,
        [authApi.reducerPath] : authApi.reducer
    },
    //RTK Query needs its middleware registered for caching, invalidation and polling to work.
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
})

export default store
