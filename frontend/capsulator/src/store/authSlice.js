import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import {instance as axios} from "../api/axios"
import endpoints from "../api/endpoints"

const initialState = {
    user: {},
    status: 'pending', // pending, fulfilled, rejected
    errorData: null
}

export const authenticate = createAsyncThunk(
    'auth/authenticate',
    async({ token }, thunkAPI) => {
        try {
            // Try to authenticate from localStorage
            if (token === null){
                const access_token = localStorage.getItem("access_token")
                if (access_token)
                    return { access_token: access_token }
                
                // Don't continue
                return {}
            } 

            // Authenticate
            const response = await axios({
                url: endpoints.auth,
                method: 'POST',
                data:
                {
                    grant_type: "convert_token",
                    client_id: process.env.REACT_APP_CLIENT_ID,
                    client_secret: process.env.REACT_APP_CLIENT_SECRET,
                    backend: "google-oauth2",
                    token: token,
                },
            });
            if (response.status === 200){

                const access_token = response.data.access_token

                localStorage.setItem("access_token", response.data.access_token)
                return response.data
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        } 
        catch (e) {
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.user.access_token = action.payload 
        },
        resetToken: (state) => {
            state.user.access_token = null
        }
    },
    extraReducers: {
        [authenticate.pending]: (state) => {
            state.status = 'pending'
        },
        [authenticate.fulfilled]: (state, {payload}) => {
            state.status = 'fulfilled'
            state.user = payload
        },
        [authenticate.rejected]: (state, {payload}) => {
            state.status = 'rejected'
            state.errorData = payload
        },

    }
})

export const selectUser = (state) => state.auth.user

export const selectAuthStatus = (state) => state.auth.status

export const {setToken, resetToken} = authSlice.actions

export default authSlice.reducer;