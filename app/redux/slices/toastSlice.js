import { createSlice } from '@reduxjs/toolkit';
export const toastSlice = createSlice({
    name: 'toastSlice',
    initialState: {
        isShow: false,
        message: "",
        status: "",
    },
    reducers: {
        setIsShow: (state, action) => {
            state.isShow = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
    },
})

export const toastActions = toastSlice.actions

export default toastSlice.reducer