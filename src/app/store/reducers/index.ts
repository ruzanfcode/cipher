import authReducer from "@/app/store/slices/authSlice";
import themeReducer from "@/app/store/slices/themeSlice";
import collectionReducer from "@/app/store/slices/collectionSlice";
import searchReducer from "@/app/store/slices/searchSlice";
import uiReducer from "@/app/store/slices/uiSlice";
import usersReducer from "@/app/store/slices/usersSlice";

export const rootReducer = {
  auth:       authReducer,
  theme:      themeReducer,
  collection: collectionReducer,
  search:     searchReducer,
  ui:         uiReducer,
  users:      usersReducer,
};
