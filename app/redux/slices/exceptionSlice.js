import { createSlice } from '@reduxjs/toolkit';
export const exceptionSlice = createSlice({
    name: 'exceptionSlice',
    initialState: {
        data: [],
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const exceptionActions = exceptionSlice.actions

export default exceptionSlice.reducer