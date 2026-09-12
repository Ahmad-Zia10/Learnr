import {createSlice} from '@reduxjs/toolkit'

//The token survives a refresh in localStorage, so the profile has to as well.
//Without this the app comes back holding a valid token but no user, and every
//check of the form `user && ...` silently fails: no profile menu, no cart, and
//an instructor looks like a signed-out visitor.
const readUser = () => {
    try {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        return JSON.parse(stored);
    } catch {
        //a malformed entry must never throw at import time and take the app down
        return null;
    }
}

const initialState = {
    user: readUser()
}

const profileSlice = createSlice({
    name : 'profile',
    initialState,
    reducers : {
        setProfile : (state, action) => {
            state.user = action.payload;

            //keep localStorage in step, the same way setToken does
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user");
            }
        }
    }
})

export const {setProfile} = profileSlice.actions;

export default profileSlice.reducer;
