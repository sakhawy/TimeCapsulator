import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'

import { selectUser } from './authSlice';
import {instance as axios} from "../api/axios"
import endpoints from '../api/endpoints'
import { selectProfile } from './profileSlice';

export const joinCapsule = createAsyncThunk(
    'member/joinCapsule',
    async ({capsuleId, capsuleKey }, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())
            const profile = selectProfile(thunkAPI.getState())

            const response = await axios({
                url: endpoints.member,
                method: 'POST',
                headers: {
                    'Authorization': `Token ${user.access_token}`
                },
                data: {
                    user: profile.id,
                    capsule: capsuleId,
                    key: capsuleKey,
                    state: 'W',
                    status: 'N'

                }
            });
            if (response.status === 201){
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

const memberAdapter = createEntityAdapter({
    selectId: (member) => member.id
})

const initialState = {
    entities: memberAdapter.getInitialState(),
    status: 'pending',
    error: null
}

export const memberSlice = createSlice({
    name: 'member',
    initialState,
    reducers: {
        addMember: memberAdapter.addOne,
        updateMember: memberAdapter.updateOne,
        setMembers: memberAdapter.setAll,
        addMembers: memberAdapter.addMany
    },
    extraReducers: {
        [joinCapsule.pending]: (state) => {
            state.status = 'pending'
        },
        [joinCapsule.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            memberAdapter.addOne(state.entities, action.payload)
            
        },
        [joinCapsule.rejected]: (state, action) => {
            state.status = 'rejected'
            // state.error = payload
        },
    }
})

export const selectMember = (state) => state.member.entity
export const selectMemberStatus = (state) => state.member.status
export const selectMemberError = (state) => state.member.error


export const {changeTab} = memberSlice.actions

export default memberSlice.reducer;