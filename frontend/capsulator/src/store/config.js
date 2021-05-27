import {configureStore} from '@reduxjs/toolkit'
import navbarReducer from './navbarSlice'
import authReducer from './authSlice'
import capsulesReducer from './capsulesSlice'

export const store = configureStore({
    reducer: {
        capsules: capsulesReducer,
        navbar: navbarReducer,
        auth: authReducer

    }
})