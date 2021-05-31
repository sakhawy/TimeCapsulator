import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';

import { selectUser } from './authSlice';
import { instance as axios } from '../api/axios'
import endpoints from '../api/endpoints'
import {joinCapsule, setMembers} from './membersSlice'
import {formatManyCapsules, formatOneCapsule} from '../formatters/capsulesFormatter'
import { formatManyMembers } from '../formatters/membersFormatter';


export const fetchCapsules = createAsyncThunk(
    'capsules/fetchCapsules',
    async(_, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())

            const response = await axios({
                url: endpoints.capsules,
                method: 'GET',
                headers: {
                    'Authorization': `Token ${user.access_token}`
                },
            });
            if (response.status === 200){
                // Normalized data
                const {capsules, members} = formatManyCapsules(response.data)
                
                // Update the members
                thunkAPI.dispatch(setMembers(formatManyMembers(members)))

                return capsules
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        }
        catch (e){
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
        }
    }
)

export const createCapsule = createAsyncThunk(
    'capsules/createCapsule',
    async (data, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())

            const response = await axios({
                url: endpoints.capsules,
                method: 'POST',
                headers: {
                    'Authorization': `Token ${user.access_token}`
                },
                data: {
                    name: data.name,
                    unlock_date: data.unlockDate,
                    member: data.member,
                    is_public: data.public
                }
            });
            if (response.status === 201){
                thunkAPI.dispatch(joinCapsule({capsuleId: response.data.id, capsuleKey: response.data.key}))
                const {capsule, members} = formatOneCapsule(response.data)
                return capsule
            }
            else
                return thunkAPI.rejectWithValue(response.data)
        }
        catch (e){
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
        }
    }
)

export const lockCapsule = createAsyncThunk(
    'capsules/lockCapsule',
    async ({capsuleKey}, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())

            const response = await axios({
                url: `${endpoints.capsules}${capsuleKey}/`,
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${user.access_token}`
                },
                data: {
                    state: 1
                }
            });
            if (response.status === 200){
                const {capsule, members} = formatOneCapsule(response.data)
                return capsule
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

export const capsulesSlice = createSlice({
    name: 'capsules',
    initialState: capsuleAdapter.getInitialState({
        status: 'fulfilled',
        error: null, 
    }),
    reducers: {
        addCapsule: capsuleAdapter.addOne,
        updateCapsule: capsuleAdapter.updateOne,
        setCapsules: capsuleAdapter.setAll,
        addCapsules: capsuleAdapter.addMany,
        addCapsuleMember: (state, {payload}) => {
            state.entities[payload.capsuleId].members.push(payload.memberId)
        }
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
        },
        [createCapsule.pending]: (state, action) => {
            state.status = 'pending'
        },
        [createCapsule.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            capsuleAdapter.addOne(state, action.payload)
        },
        [createCapsule.rejected]: (state, action) => {
            state.status = "rejected"
            state.error = action.payload
        },
        [lockCapsule.pending]: (state, action) => {
            state.status = 'pending'
        },
        [lockCapsule.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            capsuleAdapter.upsertOne(state, action.payload)
        },
        [lockCapsule.rejected]: (state, action) => {
            state.status = "rejected"
            state.error = action.payload
        },
    }
}) 

export const selectCapsulesIds = (state) => state.capsules.ids // Not the whole capsules
export const selectCapsules = (state) => state.capsules.entities // Not the whole capsules
export const selectCapsulesStatus = (state) => state.capsules.status // Not the whole capsules
export const selectCapsulesError = (state) => state.capsules.error // Not the whole capsules

export const {addCapsule, updateCapsule, setCapsules, addCapsuleMember} = capsulesSlice.actions

export default capsulesSlice.reducer