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
    createSavedCollection: (state, action: PayloadAction<SavedCollection>) => {
      state.savedCollections.push(action.payload);
    },
    shareSavedCollection: (state, action: PayloadAction<SavedCollection[]>) => {
      state.savedCollections.push(...action.payload);
    },
    stopSharingSavedCollection: (state, action: PayloadAction<number>) => {
      state.savedCollections = state.savedCollections.filter(collection => collection.sharedFromId !== action.payload);
    },
    removeProductFromSavedCollection: (state, action: PayloadAction<{ collectionId: number; productId: number }>) => {
      state.savedCollections = state.savedCollections.map(collection => {
        const isTargetCollection = collection.id === action.payload.collectionId || collection.sharedFromId === action.payload.collectionId;
        if (!isTargetCollection) return collection;
        return { ...collection, productIds: collection.productIds.filter(id => id !== action.payload.productId) };
      });
    },
    setProductCollectionAssignments: (state, action: PayloadAction<{ productId: number; collectionIds: number[]; owner: string; ownerId: string }>) => {
      state.savedCollections = state.savedCollections.map(collection => {
        const isOwner = collection.ownerId ? collection.ownerId === action.payload.ownerId : collection.owner === action.payload.owner;
        if (!isOwner) return collection;
        if (collection.sharedBy) return collection;
        const shouldInclude = action.payload.collectionIds.includes(collection.id);
        const hasProduct = collection.productIds.includes(action.payload.productId);
        if (shouldInclude && !hasProduct) {
          return { ...collection, productIds: [...collection.productIds, action.payload.productId] };
        }
        if (!shouldInclude && hasProduct) {
          return { ...collection, productIds: collection.productIds.filter(id => id !== action.payload.productId) };
        }
        return collection;
      });
    },
    deleteSavedCollection: (state, action: PayloadAction<number>) => {
      state.savedCollections = state.savedCollections.filter(collection => collection.id !== action.payload);
    },
  },
});

export const { addToCollection, removeFromCollection, saveCollection, createSavedCollection, shareSavedCollection, stopSharingSavedCollection, removeProductFromSavedCollection, setProductCollectionAssignments, deleteSavedCollection } = collectionSlice.actions;
export default collectionSlice.reducer;
