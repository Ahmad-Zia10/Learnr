import {createSlice} from '@reduxjs/toolkit'

//The cart lives in localStorage: the backend has no cart/wishlist model,
//and the server is only involved at checkout.
const readCart = () => {
    try {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

const persist = (state) => {
    localStorage.setItem('cart', JSON.stringify(state.items));
}

const sumPrice = (items) => items.reduce((total, item) => total + (item.price || 0), 0);

const initialItems = readCart();

const initialState = {
    items: initialItems,
    totalItems: initialItems.length,
    total: sumPrice(initialItems)
}

const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers : {
        addToCart : (state, action) => {
            const course = action.payload;
            //a course can only sit in the cart once
            if (state.items.some((item) => item._id === course._id)) return;

            state.items.push(course);
            state.totalItems = state.items.length;
            state.total = sumPrice(state.items);
            persist(state);
        },
        removeFromCart : (state, action) => {
            state.items = state.items.filter((item) => item._id !== action.payload);
            state.totalItems = state.items.length;
            state.total = sumPrice(state.items);
            persist(state);
        },
        resetCart : (state) => {
            state.items = [];
            state.totalItems = 0;
            state.total = 0;
            persist(state);
        }
    }
})

export const {addToCart, removeFromCart, resetCart} = cartSlice.actions;

export default cartSlice.reducer;
