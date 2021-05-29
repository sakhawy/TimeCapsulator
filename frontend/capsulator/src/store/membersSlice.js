import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'

import { selectUser } from './authSlice';
import {instance as axios} from "../api/axios"
import endpoints from '../api/endpoints'
import { selectProfile } from './profileSlice';
import { addCapsuleMember } from './capsulesSlice';
import {formatManyMembers} from "../formatters/membersFormatter"

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


                }
            });
            if (response.status === 201){
                // TODO: Update the capsule
                thunkAPI.dispatch(addCapsuleMember({
                    memberId: response.data.id,
                    capsuleId: response.data.capsule
                }))
                return response.data
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        }
        catch (e){
            console.log(e)
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
        }
    }
)

export const memberAdapter = createEntityAdapter({
    selectId: (member) => member.id
})

export const membersSlice = createSlice({
    name: 'members',
    initialState: memberAdapter.getInitialState({
        status: 'pending',
        error: null
    }),
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
            memberAdapter.addOne(state, action.payload)
            
            
        },
        [joinCapsule.rejected]: (state, action) => {
            state.status = 'rejected'

            state.error = action.payload
        },
    }
})

export const selectMembers = (state) => state.members.entities
export const selectMembersIds = (state) => state.members.ids
export const selectMembersStatus = (state) => state.members.status
export const selectMembersError = (state) => state.members.error


export const {addMember, addMembers, setMember, setMembers} = membersSlice.actions

export default membersSlice.reducer;