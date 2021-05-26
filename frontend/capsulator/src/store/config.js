import {configureStore} from '@reduxjs/toolkit'
import navbarReducer from './navbarSlice'
import authReducer from './authSlice'

console.log(navbarReducer)
export const store = configureStore({
    reducer: {
        navbar: navbarReducer,
        auth: authReducer
    }
})