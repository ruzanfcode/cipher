import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import { AppHeader }       from "@/app/components/AppHeader";
import { FloatingAIChat }  from "@/app/components/FloatingAIChat";
import { RouteBreadcrumb } from "@/app/components/RouteBreadcrumb";
import { Toast }           from "@/app/components/Toast";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout }       from "@/app/store/actions/authActions";
import { setThemeMode } from "@/app/store/actions/themeActions";
import { clearToast }   from "@/app/store/actions/uiActions";
import type { HeaderTab } from "@/app/types";
import { SBUS, USER_PROFILES } from "@/data/mockData";

/**
 * ThemeProvider — app shell and single source of truth for theming.
 *
 * Responsibilities:
 *  • Applies / removes the `dark` CSS class on <html>, reacts to OS changes
 *    when mode is "system".
 *  • Renders AppHeader (only when authenticated).
 *  • Renders FloatingAIChat and Toast overlays.
 *  • Wraps everything in `min-h-screen bg-background text-foreground`.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const role                = useAppSelector(s => s.auth.role);
  const isLoggedIn          = useAppSelector(s => s.auth.isLoggedIn);
  const themeMode           = useAppSelector(s => s.theme.themeMode);
  const toast               = useAppSelector(s => s.ui.toast);
  const tempCollectionCount = useAppSelector(s => s.collection.tempCollection.length);

  // ── Dark-mode class on <html> ──────────────────────────────────────────────
  useEffect(() => {
    const apply = () => {
      const isDark =
        themeMode === "dark" ||
        (themeMode === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", isDark);
    };

    apply();

    if (themeMode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [themeMode]);

  // ── Header state derived from current route ────────────────────────────────
  const path = location.pathname;

  const headerTab: HeaderTab =
    path.startsWith("/collections") || path.startsWith("/collection") || path === "/comparison" || path === "/aggregate" ? "collections" :
    path.startsWith("/analytics") || path.startsWith("/dashboard") ? "analytics" :
    path.startsWith("/admin") || path.startsWith("/sbu") ? "admin" : "product-catalog";

  const adminSection =
    path.startsWith("/admin/data-management") ? "data-management" as const :
    path.startsWith("/admin/user-management") || path.startsWith("/sbu") ? "user-management" as const : null;

  const showAIChat =
    path.startsWith("/product/") || path === "/comparison" || path === "/aggregate";
  const adminSBU = role ? SBUS.find(sbu => sbu.name === USER_PROFILES[role].sbu) : undefined;
  const adminTarget = role === "sbu_admin" && adminSBU ? `/admin/user-management/${adminSBU.id}` : "/admin/user-management";

  // ── Breadcrumb label derived from current route ────────────────────────────
  // Handled by <RouteBreadcrumb /> — see src/app/components/RouteBreadcrumb.tsx

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };
  const handleHeaderTabChange = (tab: HeaderTab) => {
    if (tab === "admin") {
      navigate(adminTarget);
      return;
    }
    if (tab === "collections") {
      navigate("/collections", { state: { showAllCollections: Date.now() } });
      return;
    }
    navigate(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {isLoggedIn && role && (
        <AppHeader
          role={role}
          themeMode={themeMode}
          onThemeChange={t => dispatch(setThemeMode(t))}
          headerTab={headerTab}
          adminSection={adminSection}
          onHeaderTabChange={handleHeaderTabChange}
          onAdminSectionChange={section => navigate(`/admin/${section}`)}
          tempCollectionCount={tempCollectionCount}
          onLogout={handleLogout}
        />
      )}
      <RouteBreadcrumb />
        <div className="max-w-[110rem] mx-auto">
          {children}
        </div>

      <FloatingAIChat visible={showAIChat} />
      {toast && <Toast message={toast.message} variant={toast.variant} onDone={() => dispatch(clearToast())} />}
    </div>
  );
}

