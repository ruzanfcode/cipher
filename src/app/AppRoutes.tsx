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
import { SBUS, USER_PROFILES }  from "@/data/mockData";

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
  const adminSBU = SBUS.find(sbu => sbu.name === USER_PROFILES[role].sbu);
  const adminTarget = role === "sbu_admin" && adminSBU ? `/admin/user-management/${adminSBU.id}` : "/admin/user-management";
  const sbuAdminAllowedSBUId = role === "sbu_admin" ? adminSBU?.id : undefined;

  return (
    <Routes>
      <Route path="/analytics" element={role === "sbu_user" ? <Navigate to="/not-found" replace /> : <DashboardPage />} />
      <Route path="/dashboard" element={role === "sbu_user" ? <Navigate to="/not-found" replace /> : <Navigate to="/analytics" replace />} />
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
      <Route path="/admin"             element={<Navigate to={adminTarget} replace />} />
      <Route path="/admin/user-management" element={role === "system_admin" ? <SBUPage role={role} onSelectSBU={sbu => onSelectSBU(sbu.id)} /> : <Navigate to="/not-found" replace />} />
      <Route path="/admin/data-management" element={role === "system_admin" ? <DataManagementPage /> : <Navigate to="/not-found" replace />} />
      <Route path="/sbu"               element={<Navigate to={adminTarget} replace />} />
      <Route path="/product/:productId" element={<ProductAnalysisRoute />} />
      <Route path="/admin/user-management/:sbuId" element={<SBUDetailsRoute allowAccess={role !== "sbu_user"} allowedSBUId={sbuAdminAllowedSBUId} />} />
      <Route path="/sbu/:sbuId"         element={<SBUDetailsRoute allowAccess={role !== "sbu_user"} allowedSBUId={sbuAdminAllowedSBUId} />} />
      <Route path="/comparison"         element={<ComparisonRoute onAggregate={onAggregate} />} />
      <Route path="/aggregate"          element={<AggregateRoute  onCompare={onCompare} />} />
      <Route path="/login"              element={<LoginPage onLogin={onLogin}/>} />
      <Route path="/not-found"           element={<NotFoundPage />} />
      <Route path="*"                   element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
