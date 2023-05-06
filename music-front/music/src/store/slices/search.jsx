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
            const newSearchInfos = [action.payload, ...state.searchInfos.filter((searchItem) =>
                searchItem.id !== action.payload.id && searchItem.type !== action.payload.type && searchItem.info !== action.payload.info)]
            state.searchInfos = newSearchInfos
        },
        clearSeachInfo(state, action) {
            const newSearchInfos = [...state.searchInfos.filter((searchItem) =>
                searchItem.id !== action.payload.id && searchItem.type !== action.payload.type && searchItem.info !== action.payload.info)]
            state.searchInfos = newSearchInfos
        }
    }
})

export const { clearAllSearchInfo, addSearchInfo, clearSeachInfo } = searchSlice.actions;

export default searchSlice.reducer;
