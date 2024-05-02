import {createSlice} from '@reduxjs/toolkit';

export const typesSlice = createSlice({
    name: 'types',
    initialState: {
        data: [],
    },
    reducers: {
        setTypes: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const typesActions = typesSlice.actions

export default typesSlice.reducer