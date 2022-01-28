import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import { selectUser } from './authSlice';
import {instance as axios} from "../api/axios"
import endpoints from '../api/endpoints'

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async(_, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())

            const response = await axios({
                url: endpoints.profile,
                method: 'GET',
                headers: {
                    'Authorization': `Token ${user.access_token}`
                },
            });
            if (response.status === 200){
                return response.data
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        }
        catch (e){
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
        }
    }
)



const initialState = {
    entity: {},
    status: 'pending',
    error: null
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        
    },
    extraReducers: {
        [fetchProfile.pending]: (state) => {
            state.status = 'pending'
        },
        [fetchProfile.fulfilled]: (state, {payload}) => {
            state.status = 'fulfilled'
            state.entity = payload
            
        },
        [fetchProfile.rejected]: (state, {payload}) => {
            state.status = 'rejected'
            state.error = payload
        },
    }
})


export const selectProfile = (state) => state.profile.entity
export const selectProfileStatus = (state) => state.profile.status
export const selectProfileError = (state) => state.profile.error


export const {changeTab} = profileSlice.actions

export default profileSlice.reducer;