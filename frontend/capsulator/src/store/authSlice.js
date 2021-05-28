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
    async({ code }, thunkAPI) => {
        try {
            // Authenticate
            const response = await axios({
                url: endpoints.auth,
                method: 'POST',
                data:
                {
                    code: code,
                },
            });
            if (response.status === 200){
                // TODO: Add formatter
                const access_token = response.data.key

                localStorage.setItem("access_token", access_token)
                
                return {access_token: response.data.key}
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        } 
        catch (e) {
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
        }
    }
)

export const loadToken = createAsyncThunk(
    'auth/loadToken',
    async (_, thunkAPI) => {
        const access_token = localStorage.getItem("access_token")
        if (access_token)
            return access_token
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
        
        [loadToken.pending]: (state) => {
            state.status = 'pending'
        },
        [loadToken.fulfilled]: (state, {payload}) => {
            state.status = 'fulfilled'
            state.user.access_token = payload
            
        },
        [loadToken.rejected]: (state, {payload}) => {
            state.status = 'rejected'
        },
        

    }
})

export const selectUser = (state) => state.auth.user

export const selectAuthStatus = (state) => state.auth.status

export const {setToken, resetToken} = authSlice.actions

export default authSlice.reducer;