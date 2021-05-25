import {configureStore} from '@reduxjs/toolkit'
import navbarReducer from './navbarSlice'

console.log(navbarReducer)
export const store = configureStore({
    reducer: {
        navbar: navbarReducer
    }
})