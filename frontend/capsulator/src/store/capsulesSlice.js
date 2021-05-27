import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';

import { selectUser } from './authSlice';
import { instance as axios } from '../api/axios'
import endpoints from '../api/endpoints'

export const fetchCapsules = createAsyncThunk(
    'capsules/fetchCapsules',
    async(_, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())

            const response = await axios({
                url: endpoints.capsules,
                method: 'GET',
                headers: {
                    'Authorization': `Token fc19a4cea8c56144716879ded704efa97f76adfc`
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

const capsuleAdapter = createEntityAdapter({
    selectId: (capsule) => capsule.id
})

const initialState = {
    status: 'pending',
    ...capsuleAdapter.getInitialState()
}

export const capsulesSlice = createSlice({
    name: 'capsules',
    initialState: initialState,
    reducer: {
        addCapsule: capsuleAdapter.addOne,
        updateCapsule: capsuleAdapter.updateOne,
        setCapsules: capsuleAdapter.setAll,
        addCapsules: capsuleAdapter.addMany
    },
    extraReducers: {
        [fetchCapsules.pending]: (state, action) => {
            state.status = 'pending'
        },
        [fetchCapsules.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            capsuleAdapter.addMany(state, action.payload)
        },
        [fetchCapsules.rejected]: (state, action) => {
            state.status = "rejected"
        }
    }
}) 

export const selectCapsulesIds = (state) => state.capsules.ids // Not the whole capsules
export const selectCapsules = (state) => state.capsules.entities // Not the whole capsules
export const selectCapsulesStatus = (state) => state.capsules.status // Not the whole capsules

export const {addCapsule, updateCapsule, setCapsules} = capsulesSlice.actions

export default capsulesSlice.reducer