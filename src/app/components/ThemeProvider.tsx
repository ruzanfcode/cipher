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
    path.startsWith("/dashboard")  ? "dashboard" :
    path.startsWith("/collection") ? "collection" :
    path.startsWith("/sbu") || path.startsWith("/sbu/") ? "sbu" : "product-catalog";

  const isSubPage =
    path.startsWith("/product/") || path.startsWith("/sbu/") ||
    path === "/comparison"       || path === "/aggregate";

  const showAIChat =
    path.startsWith("/product/") || path === "/comparison" || path === "/aggregate";

  // ── Breadcrumb label derived from current route ────────────────────────────
  // Handled by <RouteBreadcrumb /> — see src/app/components/RouteBreadcrumb.tsx

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {isLoggedIn && role && (
        <AppHeader
          role={role}
          themeMode={themeMode}
          onThemeChange={t => dispatch(setThemeMode(t))}
          headerTab={headerTab}
          onHeaderTabChange={tab => navigate(`/${tab}`)}
          tempCollectionCount={tempCollectionCount}
          showBack={isSubPage}
          onBack={() => navigate(-1)}
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

