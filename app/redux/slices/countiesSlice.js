import {createSlice} from '@reduxjs/toolkit';

export const countiesSlice = createSlice({
    name: 'counties',
    initialState: {
        data: [],
        items: [],
    },
    reducers: {
        setCounties: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const countiesActions = countiesSlice.actions

export default countiesSlice.reducer