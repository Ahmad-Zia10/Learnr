import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    totalItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : 0
}

const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers : {
        setTotalItems : (state, action) => {
            state.totalItems = action.payload;
        }
    }
})

export const {setToken} = cartSlice.actions;

export default cartSlice.reducer;