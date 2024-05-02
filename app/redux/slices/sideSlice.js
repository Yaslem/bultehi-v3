import { createSlice } from '@reduxjs/toolkit';
export const sideSlice = createSlice({
    name: 'sideSlice',
    initialState: {
        isOpen: false,
    },
    reducers: {
        isOpen: (state, action) => {
            state.isOpen = action.payload;
        },
    },
})

export const sideActions = sideSlice.actions

export default sideSlice.reducer