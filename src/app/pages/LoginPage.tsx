import React from "react";
import { Shield, Users, User, LogIn } from "lucide-react";
import { CipherLogo } from "@/app/components/CipherLogo";
import type { Role } from "@/app/types";

export function LoginPage({ onLogin }: { onLogin: (role: Role) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F2F4F7" }}>
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl px-10 py-10">
        <div className="flex items-center justify-center mb-7">
          <CipherLogo height={44} />
        </div>
        <h1 className="text-center font-black text-foreground uppercase tracking-wide mb-3" style={{ fontSize: 22 }}>
          Login Required
        </h1>
        <p className="text-center text-muted-foreground mb-8 leading-relaxed" style={{ fontSize: 13 }}>
          Please sign in with an authorized account<br />to access the sentiment analysis dashboard.
        </p>
        <button className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all mb-4" style={{ fontSize: 13 }}>
          <Shield size={16} />
          Sign in with MAS SSO
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-center mb-3 text-muted-foreground" style={{ fontSize: 11 }}>
          Demo access — select a role
        </p>
        <div className="space-y-2.5">
          {([
            ["system_admin", "System Admin", Shield],
            ["sbu_admin",    "SBU Admin",    Users],
            ["sbu_user",     "User",          User],
          ] as [Role, string, React.ElementType][]).map(([r, label, Icon]) => (
            <button
              key={r}
              onClick={() => onLogin(r)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-white hover:border-primary/50 hover:bg-blue-50 transition-all group text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-primary" />
              </div>
              <span className="flex-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</span>
              <LogIn size={13} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-6" style={{ fontSize: 11 }}>
          Secured with Microsoft Azure Active Directory
        </p>
      </div>
    </div>
  );
}
