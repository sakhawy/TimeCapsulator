import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import capsulesReducer from './capsulesSlice'
import profileReducer from './profileSlice'
import memberReducer from './memberSlice'

export const store = configureStore({
    reducer: {
        capsules: capsulesReducer,
        auth: authReducer,
        profile: profileReducer,
        member: memberReducer

    }
})