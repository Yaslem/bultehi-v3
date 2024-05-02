import {createSlice} from '@reduxjs/toolkit';

export const schoolsSlice = createSlice({
    name: 'schools',
    initialState: {
        data: [],
    },
    reducers: {
        setSchools: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const schoolsActions = schoolsSlice.actions

export default schoolsSlice.reducer