import React, { useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";

import { ThemeProvider } from "@/app/components/ThemeProvider";
import { AppRoutes }     from "@/app/AppRoutes";
import { LoginPage }     from "@/app/pages/LoginPage";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setRole }                        from "@/app/store/actions/authActions";
import {
  addToCollectionAction,
  removeFromCollectionAction,
  saveCollectionAction,
} from "@/app/store/actions/collectionActions";
import { toggleBrand, clearBrands, setQuery, setSearchMode } from "@/app/store/actions/searchActions";
import type { Role, Product } from "@/app/types";

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const role       = useAppSelector(s => s.auth.role);
  const isLoggedIn = useAppSelector(s => s.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleLogin     = (r: Role)             => { dispatch(setRole(r)); navigate("/product-catalog"); };
  const handleAnalyze   = (product: Product)    => navigate(`/product/${product.id}`);
  const handleCompare   = (products: Product[]) => navigate("/comparison", { state: { products } });
  const handleAggregate = (products: Product[]) => navigate("/aggregate",  { state: { products } });

  if (!isLoggedIn || !role) {
    if (location.pathname !== "/login") return <Navigate to="/login" replace />;
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <AppRoutes
        role={role}
        onAddToCollection={product => dispatch(addToCollectionAction(product))}
        onRemoveFromCollection={id => dispatch(removeFromCollectionAction(id))}
        onSaveCollection={name => dispatch(saveCollectionAction(name, role))}
        onAnalyze={handleAnalyze}
        onCompare={handleCompare}
        onAggregate={handleAggregate}
        onQueryChange={q => dispatch(setQuery(q))}
        onToggleBrand={id => dispatch(toggleBrand(id))}
        onClearBrands={() => dispatch(clearBrands())}
        onSearchModeChange={m => dispatch(setSearchMode(m))}
        onSelectSBU={id => navigate(`/admin/user-management/${id}`)}
        onLogin={handleLogin}
      />
    </ThemeProvider>
  );
}
