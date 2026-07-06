import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SearchMode } from "@/app/types";

interface SearchState {
  query: string;
  selectedBrands: number[];
  searchMode: SearchMode;
}

const initialState: SearchState = {
  query: "",
  selectedBrands: [],
  searchMode: "keyword",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    toggleBrand: (state, action: PayloadAction<number>) => {
      const idx = state.selectedBrands.indexOf(action.payload);
      if (idx >= 0) state.selectedBrands.splice(idx, 1);
      else state.selectedBrands.push(action.payload);
    },
    clearBrands: (state) => {
      state.selectedBrands = [];
    },
    setSearchMode: (state, action: PayloadAction<SearchMode>) => {
      state.searchMode = action.payload;
    },
  },
});

export const { setQuery, toggleBrand, clearBrands, setSearchMode } = searchSlice.actions;
export default searchSlice.reducer;
