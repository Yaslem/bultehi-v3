import {createSlice} from '@reduxjs/toolkit';

export const centersSlice = createSlice({
    name: 'centers',
    initialState: {
        data: [],
    },
    reducers: {
        setCenters: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const centersActions = centersSlice.actions

export default centersSlice.reducer