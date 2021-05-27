import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import capsulesReducer from './capsulesSlice'

export const store = configureStore({
    reducer: {
        capsules: capsulesReducer,
        auth: authReducer

    }
})