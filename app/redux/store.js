import { configureStore } from '@reduxjs/toolkit'
import sideReducer from "./slices/sideSlice";
import resultReducer from "./slices/resultSlice";
import toastReducer from "./slices/toastSlice";
import paginationReducer from "./slices/paginationSlice"
import exceptionReducer from "./slices/exceptionSlice"
import resultCanvasReducer from "./slices/resultCanvasSlice"
import controlsReducer from "./slices/controlsSlice.js"
import countiesReducer from "./slices/countiesSlice.js"
import schoolsReducer from "./slices/schoolsSlice.js"
import statesReducer from "./slices/statesSlice.js"
import centersReducer from "./slices/centersSlice.js"
import typesReducer from "./slices/typesSlice.js"
import sidebarReducer from "./slices/sidebarSlice.js"

const store = configureStore({
    reducer: {
        side: sideReducer,
        result: resultReducer,
        toast: toastReducer,
        pagination: paginationReducer,
        exception: exceptionReducer,
        resultCanvas: resultCanvasReducer,
        controls: controlsReducer,
        counties: countiesReducer,
        schools: schoolsReducer,
        states: statesReducer,
        centers: centersReducer,
        types: typesReducer,
        sidebar: sidebarReducer,

    },
})
export default store;
