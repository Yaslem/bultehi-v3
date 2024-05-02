import {createSlice} from '@reduxjs/toolkit';
export const paginationSlice = createSlice({
    name: 'paginationSlice',
    initialState: {
        pageIndex: 0,
        maxPage: 0,
        data: [],
        isPagination: false,
        globals: {
            stateId: 0,
            countyId: 0,
            schoolId: 0,
            centerId: 0,
        }
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setMaxPage: (state, action) => {
            state.maxPage = action.payload;
        },
        setPageIndex: (state, action) => {
            state.pageIndex = action.payload;
        },
        setIncrementPageIndex: (state, action) => {
            state.pageIndex = action.payload;
        },
        setDecrementPageIndex: (state, action) => {
            state.pageIndex = action.payload;
        },
        setIsPagination: (state, action) => {
            state.isPagination = action.payload;
        },
        setStateId: (state, action) => {
            state.globals.stateId = action.payload;
        },
        setCountyId: (state, action) => {
            state.globals.countyId = action.payload;
        },
        setSchoolId: (state, action) => {
            state.globals.schoolId = action.payload;
        },
        setCenterId: (state, action) => {
            state.globals.centerId = action.payload;
        },
    },
})

export const paginationActions = paginationSlice.actions

export default paginationSlice.reducer