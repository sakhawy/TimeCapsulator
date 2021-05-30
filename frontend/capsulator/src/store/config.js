import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import capsulesReducer from './capsulesSlice'
import profileReducer from './profileSlice'
import membersReducer from './membersSlice'
import resourcesReducer from './resourcesSlice'

export const store = configureStore({
    reducer: {
        capsules: capsulesReducer,
        auth: authReducer,
        profile: profileReducer,
        members: membersReducer,
        resources: resourcesReducer,

    }
})