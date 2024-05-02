import {createSlice} from '@reduxjs/toolkit';

export const statesSlice = createSlice({
    name: 'states',
    initialState: {
        data: [],
        items: [],
    },
    reducers: {
        setStates: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const statesActions = statesSlice.actions

export default statesSlice.reducer