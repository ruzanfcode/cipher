import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product, SavedCollection } from "@/app/types";
import { INITIAL_SAVED } from "@/data/mockData";

interface CollectionState {
  tempCollection: Product[];
  savedCollections: SavedCollection[];
}

const initialState: CollectionState = {
  tempCollection: [],
  savedCollections: INITIAL_SAVED,
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    addToCollection: (state, action: PayloadAction<Product>) => {
      if (!state.tempCollection.some(p => p.id === action.payload.id)) {
        state.tempCollection.push(action.payload);
      }
    },
    removeFromCollection: (state, action: PayloadAction<number>) => {
      state.tempCollection = state.tempCollection.filter(p => p.id !== action.payload);
    },
    saveCollection: (state, action: PayloadAction<SavedCollection>) => {
      state.savedCollections.push(action.payload);
      state.tempCollection = [];
    },
    deleteSavedCollection: (state, action: PayloadAction<number>) => {
      state.savedCollections = state.savedCollections.filter(collection => collection.id !== action.payload);
    },
  },
});

export const { addToCollection, removeFromCollection, saveCollection, deleteSavedCollection } = collectionSlice.actions;
export default collectionSlice.reducer;
