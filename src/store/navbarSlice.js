import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    activeTab: 0
}

export const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        changeTab: (state, action) => {
            state.activeTab = action.payload
        }
    }
})

export const selectActiveTab = (state) => state.navbar.activeTab

export const {changeTab} = navbarSlice.actions

export default navbarSlice.reducer;