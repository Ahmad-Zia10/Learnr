import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/authSlice.js'
import profileReducer from '../store/profileSlice.js'
import cartReducer from '../store/cartSlice.js'
import { authApi } from "../services/authApi.js";
import { courseApi } from "../services/courseApi.js";
import { paymentApi } from "../services/paymentApi.js";
import { profileApi } from "../services/profileApi.js";


const store = configureStore({
    reducer : {
        auth : authReducer,
        profile : profileReducer,
        cart : cartReducer,
        [authApi.reducerPath] : authApi.reducer,
        [courseApi.reducerPath] : courseApi.reducer,
        [paymentApi.reducerPath] : paymentApi.reducer,
        [profileApi.reducerPath] : profileApi.reducer
    },
    //RTK Query needs its middleware registered for caching, invalidation and polling to work.
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authApi.middleware,
        courseApi.middleware,
        paymentApi.middleware,
        profileApi.middleware
    )
})

export default store
