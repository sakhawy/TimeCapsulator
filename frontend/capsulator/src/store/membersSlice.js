import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'

import { selectUser } from './authSlice';
import {instance as axios} from "../api/axios"
import endpoints from '../api/endpoints'
import { selectProfile } from './profileSlice';
import { addCapsuleMember } from './capsulesSlice';
import {formatManyMembers} from "../formatters/membersFormatter"

export const joinCapsule = createAsyncThunk(
    'member/joinCapsule',
    async ({capsuleKey}, thunkAPI) => {
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
                    key: capsuleKey,
                }
            });
            if (response.status === 201){
                // TODO: Update the capsule
                
                // If it's a member or an admin (meaning the capsule is already created)
                if (response.data.state === "M" || response.data.state === "A"){
                    thunkAPI.dispatch(addCapsuleMember({
                        memberId: response.data.id,
                        capsuleId: response.data.capsule
                    }))
                }

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

export const fetchCapsuleMembers = createAsyncThunk(
    'members/fetchCapsuleMembers',
    async({capsuleKey}, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())
            const profile = selectProfile(thunkAPI.getState())

            const response = await axios({
                url: `${endpoints.capsules}${capsuleKey}/`,
                method: 'GET',
                headers: {
                    'Authorization': `Token ${user.access_token}`
                },
            });
            if (response.status === 200){
                const members = formatManyMembers(response.data)
                return members
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        }
        catch (e){
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
        }
    }
)

export const updateMemberState = createAsyncThunk(
    'members/updateMemberState',
    async ({memberId, state}, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())
            const profile = selectProfile(thunkAPI.getState())

            const response = await axios({
                url: `${endpoints.member}${memberId}/`,
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${user.access_token}`
                },
                data: {
                    state: state
                }
            });
            if (response.status === 200){
                const members = formatManyMembers([response.data])
                return members[0]
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        }
        catch (e){
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
        }
    }
)

export const updateMemberStatus = createAsyncThunk(
    'members/updateMemberStatus',
    async ({memberId, status}, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())
            const profile = selectProfile(thunkAPI.getState())

            const response = await axios({
                url: `${endpoints.member}${memberId}/`,
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${user.access_token}`
                },
                data: {
                    status: status
                }
            });
            if (response.status === 200){
                const members = formatManyMembers([response.data])
                return members[0]
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        }
        catch (e){
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
        status: 'fulfilled',
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
        [fetchCapsuleMembers.pending]: (state) => {
            state.status = 'pending'
        },
        [fetchCapsuleMembers.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            memberAdapter.addMany(state, action.payload)
            
            
        },
        [fetchCapsuleMembers.rejected]: (state, action) => {
            state.status = 'rejected'

            state.error = action.payload
        },
        [updateMemberState.pending]: (state) => {
            state.status = 'pending'
        },
        [updateMemberState.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            memberAdapter.upsertOne(state, action.payload)
            
            
        },
        [updateMemberState.rejected]: (state, action) => {
            state.status = 'rejected'

            state.error = action.payload
        },
        [updateMemberStatus.pending]: (state) => {
            state.status = 'pending'
        },
        [updateMemberStatus.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            memberAdapter.upsertOne(state, action.payload)
            
            
        },
        [updateMemberStatus.rejected]: (state, action) => {
            state.status = 'rejected'

            state.error = action.payload
        },
    }
})

export const selectMembers = (state) => state.members.entities
export const selectMembersIds = (state) => state.members.ids
export const selectMembersStatus = (state) => state.members.status
export const selectMembersError = (state) => state.members.error


export const {addMember, addMembers, setMember, setMembers, updateMember} = membersSlice.actions

export default membersSlice.reducer;