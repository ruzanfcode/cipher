import React from "react";
import { LogIn } from "lucide-react";
import { USER_PROFILES } from "@/data/mockData";
import type { Role } from "@/app/types";

export function UserProfileDropdown({ role, onClose, onLogout }: { role: Role; onClose: () => void; onLogout: () => void }) {
  const profile = USER_PROFILES[role];
  const initials = profile.name.split(" ").map(n => n[0]).join("");
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
        <div className="p-5 bg-gradient-to-br from-primary/8 to-transparent border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">{initials}</div>
            <div className="min-w-0">
              <div className="font-semibold text-foreground">{profile.name}</div>
              <div className="text-xs text-muted-foreground truncate">{profile.email}</div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[{ label: "Role", value: profile.roleLabel }, { label: "SBU", value: profile.sbu }, { label: "Status", value: "Active" }].map(item => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogIn size={13} className="rotate-180" /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
