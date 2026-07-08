import React, { useState } from "react";
import { Plus, Globe, ChevronRight, Users, BarChart2, Package, Layers, X, Check } from "lucide-react";
import { SBUS } from "@/data/mockData";
import { Badge } from "@/app/components/Badge";
import { Btn } from "@/app/components/Btn";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { InviteUserModal } from "@/app/components/InviteUserModal";
import { cx } from "@/app/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { showToast } from "@/app/store/actions/uiActions";
import { activateUser, deleteUser, disableUser, rejectInvitation } from "@/app/store/actions/userActions";
import type { Role, SBU, SBUUser } from "@/app/types";

type UserAction = "reject" | "disable" | "activate" | "delete";

function getInitials(name: string) {
  return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function UserQuotaBar({ users, allowedUsers }: { users: number; allowedUsers: number }) {
  const usedPercent = allowedUsers > 0 ? Math.min(100, Math.round((users / allowedUsers) * 100)) : 0;
  const freeUsers = Math.max(0, allowedUsers - users);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">User Quota</span>
        <span className="text-xs font-mono font-semibold text-foreground">{users}/{allowedUsers}</span>
      </div>
      <div className="h-2.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 overflow-hidden flex">
        <div className="bg-primary" style={{ width: `${usedPercent}%` }} />
        <div className="bg-emerald-400/70 flex-1" />
      </div>
      <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
        <span>{users} used</span>
        <span>{freeUsers} free</span>
      </div>
    </div>
  );
}

// ─── Create SBU Modal ─────────────────────────────────────────────────────────
function CreateSBUModal({ onClose, onCreated }: { onClose: () => void; onCreated?: (name: string) => void }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: "", region: "", adminEmail: "", allowedUsers: "25", description: "", status: "Active" });
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const set = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => { const next = { ...e }; delete next[key]; return next; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())       e.name       = "SBU name is required";
    if (!form.region.trim())     e.region     = "Region is required";
    else if (!/\S+@\S+\.\S+/.test(form.adminEmail)) e.adminEmail = "Enter a valid email";
    if (!form.allowedUsers.trim()) e.allowedUsers = "Allowed users is required";
    else if (Number(form.allowedUsers) < 1) e.allowedUsers = "Enter at least 1 allowed user";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      onCreated?.(form.name);
      dispatch(showToast({ message: `SBU ${form.name.trim()} created successfully`, variant: "success" }));
      setTimeout(onClose, 2000);
    }, 900);
  };

  const inputCls = (field: string) => cx(
    "w-full px-3.5 py-2.5 rounded-lg bg-background border text-foreground text-sm focus:outline-none focus:ring-2 transition-all",
    errors[field] ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-border focus:border-primary focus:ring-primary/10"
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Create SBU</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Set up a new Strategic Business Unit</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><X size={15} /></button>
        </div>

        {saved ? (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Check size={26} className="text-emerald-600" /></div>
            <div>
              <p className="font-semibold text-foreground">SBU created!</p>
              <p className="text-sm text-muted-foreground mt-1"><span className="font-medium text-foreground">{form.name}</span> has been set up successfully.</p>
            </div>
            <p className="text-xs text-muted-foreground">Closing automatically…</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">SBU Name <span className="text-red-500">*</span></label>
                <input autoFocus value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Southeast Asia" className={inputCls("name")} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Region <span className="text-red-500">*</span></label>
                <select value={form.region} onChange={e => set("region", e.target.value)} className={inputCls("region")}>
                  <option value="">Select region…</option>
                  {["Americas", "EMEA", "APAC", "Global"].map(r => <option key={r}>{r}</option>)}
                </select>
                {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Assign Admin </label>
              <input type="email" value={form.adminEmail} onChange={e => set("adminEmail", e.target.value)} placeholder="admin@company.com" className={inputCls("adminEmail")} />
              {errors.adminEmail && <p className="text-xs text-red-500 mt-1">{errors.adminEmail}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Allowed Users <span className="text-red-500">*</span></label>
              <input type="number" min={1} value={form.allowedUsers} onChange={e => set("allowedUsers", e.target.value)} placeholder="25" className={inputCls("allowedUsers")} />
              {errors.allowedUsers && <p className="text-xs text-red-500 mt-1">{errors.allowedUsers}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description of this SBU's focus area…" rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Initial Status</label>
              <div className="flex gap-3">
                {["Active", "Inactive"].map(s => (
                  <button key={s} onClick={() => set("status", s)}
                    className={cx("flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all",
                      form.status === s
                        ? s === "Active" ? "bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-400"
                          : "bg-muted border-border text-muted-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Btn variant="secondary" className="flex-1 justify-center" onClick={onClose}>Cancel</Btn>
              <Btn className="flex-1 justify-center" disabled={loading} onClick={handleSave}>{loading ? "Creating…" : "Create SBU"}</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SBU Page ────────────────────────────────────────────────────────────────
export function SBUPage({ role, onSelectSBU }: { role: Role; onSelectSBU: (sbu: SBU) => void }) {
  const dispatch = useAppDispatch();
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: UserAction; user: SBUUser } | null>(null);
  const dashboardSBU = SBUS[0];
  const dashboardUsers = useAppSelector(state => state.users.users.filter(user => user.sbu === dashboardSBU.name));
  const activeDashboardUsers = dashboardUsers.filter(user => user.status !== "Disabled").length;

  const confirmCopy = confirmAction && {
    reject: {
      title: "Reject pending invitation?",
      message: `Are you sure you want to reject this invitation? This will remove the pending invitation for ${confirmAction.user.email}.`,
      label: "Reject",
      tone: "warning" as const,
    },
    disable: {
      title: "Disable user?",
      message: `Are you sure you want to disable ${confirmAction.user.name}? This user will lose access until an administrator restores the account.`,
      label: "Disable",
      tone: "warning" as const,
    },
    activate: {
      title: "Activate user?",
      message: `Are you sure you want to activate ${confirmAction.user.name}? This user will regain access to this SBU workspace.`,
      label: "Activate",
      tone: "success" as const,
    },
    delete: {
      title: "Delete user?",
      message: `Are you sure you want to delete ${confirmAction.user.name}? This will permanently remove the user from this SBU list.`,
      label: "Delete",
      tone: "danger" as const,
    },
  }[confirmAction.type];

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "reject") {
      dispatch(rejectInvitation(confirmAction.user.id));
      dispatch(showToast({ message: `Invitation for ${confirmAction.user.email} rejected`, variant: "warning" }));
    }
    if (confirmAction.type === "disable") {
      dispatch(disableUser(confirmAction.user.id));
      dispatch(showToast({ message: `${confirmAction.user.name} disabled`, variant: "warning" }));
    }
    if (confirmAction.type === "activate") {
      dispatch(activateUser(confirmAction.user.id));
      dispatch(showToast({ message: `${confirmAction.user.name} activated`, variant: "success" }));
    }
    if (confirmAction.type === "delete") {
      dispatch(deleteUser(confirmAction.user.id));
      dispatch(showToast({ message: `${confirmAction.user.name} deleted`, variant: "success" }));
    }
    setConfirmAction(null);
  };

  if (role === "sbu_admin") {
    return (
      <div>
        <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6 flex flex-wrap items-start sm:items-center justify-between gap-3">
          <h1 className="page-heading">SBU Dashboard</h1>
          <Btn size="sm" onClick={() => setShowInvite(true)}><Plus size={12} /> Invite User</Btn>
        </div>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users",  value: String(activeDashboardUsers),  Icon: Users,    color: "#2563EB" },
              { label: "Collections Saved", value: String(dashboardSBU.collections),  Icon: Layers,   color: "rgb(46, 204, 113)" },
              { label: "Analysis Completed",    value: String(dashboardSBU.products), Icon: Package,   color: "rgb(231, 76, 60)" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl border border-border p-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${s.color}18` }}>
                  <s.Icon size={14} style={{ color: s.color }} />
                </div>
                <div className="font-mono text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={14} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">User Quota</h3>
            </div>
            <UserQuotaBar users={activeDashboardUsers} allowedUsers={dashboardSBU.allowedUsers} />
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border"><h3 className="text-sm font-semibold text-foreground">Team Members</h3></div>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead><tr className="border-b border-border">{["Name", "Email", "Role", "Status", "Last Active", "Actions"].map(h => <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>)}</tr></thead>
              <tbody>
                {dashboardUsers.map(user => (
                  <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary">{getInitials(user.name)}</div><span className="text-sm font-medium text-foreground">{user.name}</span></div></td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-5 py-3.5"><Badge label={user.role} /></td>
                    <td className="px-5 py-3.5"><Badge label={user.status} variant={user.status === "Active" ? "positive" : user.status === "Pending" ? "pending" : "disabled"} /></td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{user.lastActive}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {user.status === "Pending" ? (
                          <button onClick={() => setConfirmAction({ type: "reject", user })} className="inline-flex cursor-pointer items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-amber-700 transition-all hover:bg-amber-500/15 dark:text-amber-300">Reject</button>
                        ) : (
                          <>
                            {user.status === "Disabled" ? (
                              <button onClick={() => setConfirmAction({ type: "activate", user })} className="inline-flex cursor-pointer items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-emerald-700 transition-all hover:bg-emerald-500/15 dark:text-emerald-300">Activate</button>
                            ) : (
                              <button onClick={() => setConfirmAction({ type: "disable", user })} className="inline-flex cursor-pointer items-center justify-center rounded-md border border-border bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary">Disable</button>
                            )}
                            <button onClick={() => setConfirmAction({ type: "delete", user })} className="inline-flex cursor-pointer items-center justify-center rounded-md border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-red-600 transition-all hover:bg-red-500/15 dark:text-red-300">Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
        {showInvite && <InviteUserModal defaultSBU={dashboardSBU.name} allowRoleSelection={role !== "sbu_admin"} onClose={() => setShowInvite(false)} />}
        {confirmAction && confirmCopy && (
          <ConfirmDialog
            title={confirmCopy.title}
            message={confirmCopy.message}
            confirmLabel={confirmCopy.label}
            tone={confirmCopy.tone}
            onCancel={() => setConfirmAction(null)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6 flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-heading-sm">SBU Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{SBUS.length} strategic business units</p>
        </div>
        <Btn onClick={() => setShowCreate(true)}><Plus size={13} /> Create SBU</Btn>
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SBUS.map(sbu => (
          <div key={sbu.id} onClick={() => onSelectSBU(sbu)} className="bg-card rounded-2xl border border-border p-6 cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Globe size={16} className="text-primary" /></div>
                <div><h3 className="font-semibold text-foreground">{sbu.name}</h3><p className="text-xs text-muted-foreground mt-0.5">Admin: {sbu.admin}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={sbu.status} variant={sbu.status === "Active" ? "positive" : "inactive"} />
                <ChevronRight size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: "Users", v: `${sbu.users}/${sbu.allowedUsers}` }, { label: "Analysis Completed", v: sbu.products }, { label: "Collections Saved", v: sbu.collections }].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-background border border-border">
                  <div className="font-mono font-bold text-foreground text-lg">{s.v}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-border">
              <UserQuotaBar users={sbu.users} allowedUsers={sbu.allowedUsers} />
            </div>
          </div>
        ))}
      </div>
      {showCreate && <CreateSBUModal onClose={() => setShowCreate(false)} />}
      </div>
    </div>
  );
}
