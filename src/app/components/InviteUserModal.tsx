import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { SBUS } from "@/data/mockData";
import { Btn } from "./Btn";
import { cx } from "@/app/lib/utils";
import { useAppDispatch } from "@/app/store/hooks";
import { showToast } from "@/app/store/actions/uiActions";
import { addUser } from "@/app/store/actions/userActions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

function getInviteName(email: string) {
  const localPart = email.split("@")[0] || "Invited User";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Invited User";
}

export function InviteUserModal({ onClose, defaultSBU, allowRoleSelection = true }: { onClose: () => void; defaultSBU?: string; allowRoleSelection?: boolean }) {
  const dispatch = useAppDispatch();
  const [email, setEmail]   = useState("");
  const [role, setRole]     = useState("SBU User");
  const sbu = defaultSBU ?? SBUS[0]?.name ?? "";
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleInvite = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Email address is required.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      dispatch(addUser({ name: getInviteName(trimmedEmail), email: trimmedEmail, role: role as "SBU Admin" | "SBU User", sbu }));
      dispatch(showToast({ message: `User ${trimmedEmail} invited successfully`, variant: "success" }));
      setTimeout(onClose, 2200);
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Invite User</h3>
            <p className="text-xs text-muted-foreground mt-0.5">An invitation link will be sent via email</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><X size={15} /></button>
        </div>

        {sent ? (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Check size={26} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Invitation sent!</p>
              <p className="text-sm text-muted-foreground mt-1">An invite has been sent to <span className="font-medium text-foreground">{email}</span></p>
            </div>
            <p className="text-xs text-muted-foreground">Closing automatically…</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email Address <span className="text-red-500">*</span></label>
              <input
                autoFocus type="email" value={email}
                onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                onKeyDown={e => e.key === "Enter" && handleInvite()}
                placeholder="colleague@company.com"
                aria-invalid={emailError ? "true" : "false"}
                className={cx("w-full px-3.5 py-2.5 rounded-lg bg-background border text-foreground text-sm focus:outline-none focus:ring-2 transition-all", emailError ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "border-border focus:border-primary focus:ring-primary/10")}
              />
              {emailError && <p className="mt-1.5 text-xs font-medium text-red-500">{emailError}</p>}
            </div>
            {allowRoleSelection && (
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all">
                  <option>SBU User</option>
                  <option>SBU Admin</option>
                </select>
              </div>
            )}
            <div className="p-3 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
              Invitation expires in <span className="font-medium text-foreground">7 days</span> · User must sign in via Microsoft SSO
            </div>
            <div className="flex gap-3 pt-1">
              <Btn variant="secondary" className="flex-1 justify-center" onClick={onClose}>Cancel</Btn>
              <Btn className="flex-1 justify-center" disabled={!email.trim() || loading} onClick={handleInvite}>
                {loading ? "Sending…" : "Send Invitation"}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
