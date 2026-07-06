// Thunk: add product with duplicate/capacity guard + toast
import { addToCollection, deleteSavedCollection, removeFromCollection } from "@/app/store/slices/collectionSlice";
import { showToast } from "@/app/store/slices/uiSlice";
import { saveCollection } from "@/app/store/slices/collectionSlice";
import type { AppDispatch, RootState } from "@/app/store";
import type { Product, Role } from "@/app/types";

export const addToCollectionAction =
  (product: Product) => (dispatch: AppDispatch, getState: () => RootState) => {
    const { tempCollection } = getState().collection;
    if (tempCollection.some(p => p.id === product.id)) return;
    if (tempCollection.length >= 10) {
      dispatch(showToast({ message: "Collection is full - max 10 products", variant: "warning" }));
      return;
    }
    dispatch(addToCollection(product));
    dispatch(showToast({ message: `"${product.name}" added to collection`, variant: "success" }));
  };

export const removeFromCollectionAction =
  (id: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    const product = getState().collection.tempCollection.find(item => item.id === id);
    dispatch(removeFromCollection(id));
    dispatch(showToast({ message: product ? `"${product.name}" removed from collection` : "Product removed from collection", variant: "success" }));
  };

// Thunk: save collection + toast
export const saveCollectionAction =
  (name: string, role: Role | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { tempCollection } = getState().collection;
    const owner =
      role === "sbu_admin" ? "Alex Chen" :
      role === "sbu_user"  ? "Maria Santos" : "Jordan Lee";
    dispatch(
      saveCollection({
        id: Date.now(),
        name,
        owner,
        created: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        productIds: tempCollection.map(p => p.id),
      })
    );
    dispatch(showToast({ message: `Collection "${name}" saved`, variant: "success" }));
  };

export const deleteSavedCollectionAction =
  (id: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    const collection = getState().collection.savedCollections.find(item => item.id === id);
    dispatch(deleteSavedCollection(id));
    dispatch(showToast({ message: collection ? `Collection "${collection.name}" deleted` : "Collection deleted", variant: "success" }));
  };
