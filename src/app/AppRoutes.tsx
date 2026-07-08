import React from "react";
import { Routes, Route, Navigate } from "react-router";
import { SearchPage }           from "@/app/pages/SearchPage";
import { CollectionPage }       from "@/app/pages/CollectionPage";
import { ProductAnalysisRoute } from "@/app/pages/ProductAnalysisPage";
import { ComparisonRoute }      from "@/app/pages/ComparisonPage";
import { AggregateRoute }       from "@/app/pages/AggregatePage";
import { DashboardPage }        from "@/app/pages/DashboardPage";
import { SBUPage }             from "@/app/pages/SBUPage";
import { SBUDetailsRoute }      from "@/app/pages/SBUDetailsPage";
import { DataManagementPage }   from "@/app/pages/DataManagementPage";
import { LoginPage }            from "@/app/pages/LoginPage";
import { NotFoundPage }         from "@/app/pages/NotFoundPage";

import type { Role, Product, SearchMode } from "@/app/types";

// ─── Authenticated Routes ─────────────────────────────────────────────────────
export interface AppRoutesProps {
  role: Role;
  onAddToCollection:    (product: Product) => void;
  onRemoveFromCollection: (id: number) => void;
  onSaveCollection:     (name: string) => void;
  onAnalyze:            (product: Product) => void;
  onCompare:            (products: Product[]) => void;
  onAggregate:          (products: Product[]) => void;
  onQueryChange:        (q: string) => void;
  onToggleBrand:        (id: number) => void;
  onClearBrands:        () => void;
  onSearchModeChange:   (m: SearchMode) => void;
  onSelectSBU:          (sbuId: number) => void;
  onLogin:              (role: Role) => void;
}

export function AppRoutes({
  role,
  onAddToCollection,
  onRemoveFromCollection,
  onSaveCollection,
  onAnalyze,
  onCompare,
  onAggregate,
  onQueryChange,
  onToggleBrand,
  onClearBrands,
  onSearchModeChange,
  onSelectSBU,
  onLogin
}: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/analytics" element={<DashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
      <Route
        path="/product-catalog"
        element={
          <SearchPage
            onAddToCollection={onAddToCollection}
            onRemoveFromCollection={onRemoveFromCollection}
            onAnalyze={onAnalyze}
            onQueryChange={onQueryChange}
            onToggleBrand={onToggleBrand}
            onClearBrands={onClearBrands}
            onSearchModeChange={onSearchModeChange}
          />
        }
      />
      <Route
        path="/collections"
        element={
          <CollectionPage
            onCompare={onCompare}
            onAggregate={onAggregate}
            onAnalyze={onAnalyze}
          />
        }
      />
      <Route path="/collection"        element={<Navigate to="/collections" replace />} />
      <Route path="/admin"             element={<Navigate to="/admin/user-management" replace />} />
      <Route path="/admin/user-management" element={<SBUPage role={role} onSelectSBU={sbu => onSelectSBU(sbu.id)} />} />
      <Route path="/admin/data-management" element={<DataManagementPage />} />
      <Route path="/sbu"               element={<Navigate to="/admin/user-management" replace />} />
      <Route path="/product/:productId" element={<ProductAnalysisRoute />} />
      <Route path="/admin/user-management/:sbuId" element={<SBUDetailsRoute />} />
      <Route path="/sbu/:sbuId"         element={<Navigate to="/admin/user-management/:sbuId" replace />} />
      <Route path="/comparison"         element={<ComparisonRoute onAggregate={onAggregate} />} />
      <Route path="/aggregate"          element={<AggregateRoute  onCompare={onCompare} />} />
      <Route path="/login"              element={<LoginPage onLogin={onLogin}/>} />
      <Route path="/not-found"           element={<NotFoundPage />} />
      <Route path="*"                   element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
