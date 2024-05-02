import {createSlice} from '@reduxjs/toolkit';

export const sidebarSlice = createSlice({
    name: 'sidebarSlice',
    initialState: {
        isOpen: false,
    },
    reducers: {
        setIsOpen: (state, action) => {
            state.isOpen = action.payload;
        },
    },
})

export const sidebarActions = sidebarSlice.actions

export default sidebarSlice.reducer