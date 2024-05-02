import { createSlice } from '@reduxjs/toolkit';
export const coverPendingSlice = createSlice({
    name: 'coverPendingSlice',
    initialState: {
        isShow: false,
    },
    reducers: {
        setIsShow: (state, action) => {
            state.isShow = action.payload;
        }
    },
})

export const coverPendingActions = coverPendingSlice.actions

export default coverPendingSlice.reducer