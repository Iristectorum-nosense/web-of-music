import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchInfos: []
    },
    reducers: {
        clearAllSearchInfo(state) {
            state.searchInfos = []
        },
        addSearchInfo(state, action) {
            let newSearchInfos
            if (action.payload.type) {
                newSearchInfos = [action.payload, ...state.searchInfos.filter((searchItem) =>
                    searchItem.id !== action.payload.id || searchItem.type !== action.payload.type)]
            } else {
                newSearchInfos = [action.payload, ...state.searchInfos.filter((searchItem) =>
                    searchItem.info !== action.payload.info)]
            }
            state.searchInfos = newSearchInfos
        },
        clearSeachInfo(state, action) {
            let newSearchInfos
            if (action.payload.type) {
                newSearchInfos = [...state.searchInfos.filter((searchItem) =>
                    searchItem.id !== action.payload.id || searchItem.type !== action.payload.type)]
            } else {
                newSearchInfos = [...state.searchInfos.filter((searchItem) =>
                    searchItem.info !== action.payload.info)]
            }
            state.searchInfos = newSearchInfos
        }
    }
})

export const { clearAllSearchInfo, addSearchInfo, clearSeachInfo } = searchSlice.actions;

export default searchSlice.reducer;
