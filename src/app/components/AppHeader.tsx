import React, { useState } from "react";
import { Sun, Moon, Monitor, ArrowLeft, User, ChevronDown } from "lucide-react";
import { CipherLogo } from "./CipherLogo";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { USER_PROFILES } from "@/data/mockData";
import { cx } from "@/app/lib/utils";
import type { Role, HeaderTab, ThemeMode } from "@/app/types";

export function AppHeader({ role, themeMode, onThemeChange, headerTab, adminSection, onHeaderTabChange, onAdminSectionChange, tempCollectionCount, showBack, onBack, onLogout }: {
  role: Role;
  themeMode: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  headerTab: HeaderTab;
  adminSection: "user-management" | "data-management" | null;
  onHeaderTabChange: (t: HeaderTab) => void;
  onAdminSectionChange: (section: "user-management" | "data-management") => void;
  tempCollectionCount: number;
  showBack: boolean;
  onBack: () => void;
  onLogout: () => void;
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const profile = USER_PROFILES[role];
  const showAdmin = role === "system_admin";

  const tabs = [
    { id: "product-catalog" as HeaderTab, label: "DISCOVER" },
    { id: "collections" as HeaderTab, label: `COLLECTIONS${tempCollectionCount > 0 ? ` (${tempCollectionCount})` : ""}` },
    { id: "analytics" as HeaderTab, label: "ANALYTICS" },
    ...(showAdmin ? [{ id: "admin" as HeaderTab, label: "ADMIN" }] : []),
  ];

  const adminSubTabs = [
    { id: "user-management" as const, label: "User Management" },
    { id: "data-management" as const, label: "Data Management" },
  ];

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4 sticky top-0 z-40">
      <div className="flex items-center gap-2.5 shrink-0">
        {showBack && (
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft size={15} className="text-muted-foreground" />
          </button>
        )}
        <CipherLogo />
      </div>

      <div className="flex-1 flex items-center justify-center overflow-visible min-w-0">
        <div className="inline-flex items-center rounded-xl bg-card p-1 shadow-sm border border-white/70 dark:border-border gap-1">
          {tabs.map(tab => tab.id === "admin" ? (
            <div key={tab.id} className="relative" onMouseEnter={() => setShowAdminMenu(true)} onMouseLeave={() => setShowAdminMenu(false)}>
              <button
                onClick={() => onHeaderTabChange(tab.id)}
                className={cx(
                  "min-w-[104px] px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-[0.16em] transition-all whitespace-nowrap inline-flex items-center justify-center gap-1.5",
                  headerTab === tab.id
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                <ChevronDown size={12} />
              </button>
              {showAdminMenu && (
                <div className="absolute left-0 top-full z-[80] w-56 pt-2">
                  <div className="rounded-xl border border-border bg-card p-2 shadow-xl">
                  {adminSubTabs.map(subTab => (
                    <button
                      key={subTab.id}
                      onClick={() => { onAdminSectionChange(subTab.id); setShowAdminMenu(false); }}
                      className={cx(
                        "w-full rounded-lg px-3 py-2 text-left text-xs font-bold transition-all",
                        adminSection === subTab.id
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {subTab.label}
                    </button>
                  ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              key={tab.id}
              onClick={() => onHeaderTabChange(tab.id)}
              className={cx(
                "min-w-[104px] px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-[0.16em] transition-all whitespace-nowrap",
                headerTab === tab.id
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center p-1 rounded-lg border border-border bg-muted/50 gap-0.5">
          {([
            { mode: "light"  as ThemeMode, Icon: Sun },
            { mode: "dark"   as ThemeMode, Icon: Moon },
            { mode: "system" as ThemeMode, Icon: Monitor },
          ]).map(({ mode, Icon }) => (
            <button
              key={mode}
              onClick={() => onThemeChange(mode)}
              className={cx("p-1.5 rounded-md transition-all", themeMode === mode ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-foreground uppercase tracking-wide leading-tight">{profile.roleLabel}</div>
            <div className="text-xs text-muted-foreground leading-tight">{profile.email}</div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfile(v => !v)}
              className="w-8 h-8 rounded-full border-2 border-border hover:border-primary bg-muted flex items-center justify-center transition-all"
            >
              <User size={14} className="text-foreground" />
            </button>
            {showProfile && <UserProfileDropdown role={role} onClose={() => setShowProfile(false)} onLogout={onLogout} />}
          </div>
        </div>
      </div>
    </header>
  );
}
