import {createSlice} from '@reduxjs/toolkit';

export const controlsSlice = createSlice({
    name: 'controlsSlice',
    initialState: {
        controls: {
            view: "grid",
            search: false
        },
    },
    reducers: {
        setView: (state, action) => {
            state.controls.view = action.payload;
        },
        setSearch: (state, action) => {
            state.controls.search = action.payload;
        },
    },
})

export const controlsActions = controlsSlice.actions

export default controlsSlice.reducer