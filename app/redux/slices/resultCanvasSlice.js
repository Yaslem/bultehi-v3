import { createSlice } from '@reduxjs/toolkit';
export const resultCanvasSlice = createSlice({
    name: 'resultCanvasSlice',
    initialState: {
        right: 0,
        top: 0,
        left: 0,
        bottom: 0,
        width: 0,
    },
    reducers: {
        setTop: (state, action) => {
            state.top = action.payload;
        },
        setRight: (state, action) => {
            state.right = action.payload;
        },
        setLeft: (state, action) => {
            state.left = action.payload;
        },
        setBottom: (state, action) => {
            state.bottom = action.payload;
        },
        setWidth: (state, action) => {
            state.width = action.payload;
        },
    },
})

export const resultCanvasActions = resultCanvasSlice.actions

export default resultCanvasSlice.reducer