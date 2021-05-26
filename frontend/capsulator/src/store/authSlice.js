import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const initialState = {
    user: {},
    state: null
}

export const authenticate = createAsyncThunk(
    'auth/authenticate',
    async({ token }, thunkAPI) => {
        try {
            // Authenticate
            const response = await fetch(
                'http://localhost:8000/auth/convert-token',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        grant_type: "convert_token",
                        client_id: process.env.REACT_APP_CLIENT_ID,
                        client_secret: process.env.REACT_APP_CLIENT_SECRET,
                        backend: "google-oauth2",
                        token: token,
                    }),
                }
            );

            let data = await response.json();
            console.log("data", data);
        } 
        catch {
            // Error
        }
    }
)

export const navbarSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    }
})

export const selectActiveTab = (state) => state.navbar.activeTab

export const {changeTab} = navbarSlice.actions

export default navbarSlice.reducer;