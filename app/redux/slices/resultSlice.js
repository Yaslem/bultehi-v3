import { createSlice } from '@reduxjs/toolkit';
export const resultSlice = createSlice({
    name: 'resultSlice',
    initialState: {
        isOpen: false,
        result: {}
    },
    reducers: {
        setOpen: (state, action) => {
            state.isOpen = action.payload;
        },
        setResult: (state, action) => {
            state.result = action.payload;
        },
    },
})

export const resultActions = resultSlice.actions

export default resultSlice.reducer