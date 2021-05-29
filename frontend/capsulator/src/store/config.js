import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import capsulesReducer from './capsulesSlice'
import profileReducer from './profileSlice'
import membersReducer from './membersSlice'

export const store = configureStore({
    reducer: {
        capsules: capsulesReducer,
        auth: authReducer,
        profile: profileReducer,
        members: membersReducer

    }
})