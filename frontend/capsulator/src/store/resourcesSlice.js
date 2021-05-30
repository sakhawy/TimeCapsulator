import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'

import { selectUser } from './authSlice';
import {instance as axios} from "../api/axios"
import endpoints from '../api/endpoints'
import { selectProfile } from './profileSlice';
import {formatManyResources} from "../formatters/resourcesFormatter"

export const fetchResource = createAsyncThunk(
    'resources/fetchResource',
    async({memberId}, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())

            const response = await axios({
                url: `${endpoints.resource}${memberId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Token ${user.access_token}`,
                },
                
            });
            if (response.status === 200){
                const {resources} = formatManyResources([response.data])
                return resources[0]
            }
            else{
                return thunkAPI.rejectWithValue(response.data)
            }
        }
        catch (e){
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
            }
    }
)

export const uploadResource = createAsyncThunk(
    'resources/uploadResource',
    async({
        memberId,
        // message,
        images
    }, thunkAPI) => {
        try{

            const user = selectUser(thunkAPI.getState())

            let formData = new FormData()

            // Add multiple images
            for (var i=0; i<images.length; i++){
                formData.append('content', images[i])
            }

            formData.append('member', memberId)

            const response = await axios({
                url: endpoints.resource,
                method: 'POST',
                headers: {
                    'Authorization': `Token ${user.access_token}`,

                    // Form-data post request for file upload
                    'Content-Type': 'multipart/form-data'
                },
                data: formData,
                
            });
            if (response.status === 200){
                const {resources} = formatManyResources([response.data])
                return resources[0]
            }
            else{
                return thunkAPI.rejectWithValue(response.data)
            }
        }
        catch (e){
            return thunkAPI.rejectWithValue({data: e.response.data, status: e.response.status})
            }
        }
)


export const resourceAdapter = createEntityAdapter({
    selectId: (resource) => resource.id
})

export const resourcesSlice = createSlice({
    name: 'resources',
    initialState: resourceAdapter.getInitialState({
        status: 'fulfilled',
        error: null
    }),
    reducers: {
        addResource: resourceAdapter.addOne,
        updateResource: resourceAdapter.updateOne,
        setResources: resourceAdapter.setAll,
        addResources: resourceAdapter.addMany
    },
    extraReducers: {
        [uploadResource.pending]: (state) => {
            state.status = 'pending'
        },
        [uploadResource.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            resourceAdapter.addOne(state, action.payload)
            
            
        },
        [uploadResource.rejected]: (state, action) => {
            state.status = 'rejected'

            state.error = action.payload
        },
        [fetchResource.pending]: (state) => {
            state.status = 'pending'
        },
        [fetchResource.fulfilled]: (state, action) => {
            state.status = 'fulfilled'
            resourceAdapter.addOne(state, action.payload)
            
        },
        [fetchResource.rejected]: (state, action) => {
            state.status = 'rejected'

            state.error = action.payload
        },
    }
})

export const selectResources = (state) => state.resources.entities
export const selectResourcesIds = (state) => state.resources.ids
export const selectResourcesStatus = (state) => state.resources.status
export const selectResourcesError = (state) => state.resources.error


export const {addResource, addResources, setResource, setResources} = resourcesSlice.actions

export default resourcesSlice.reducer;