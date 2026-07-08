import React, { useState } from "react";
import { Navigate, useParams } from "react-router";
import { Plus } from "lucide-react";
import { SBUS } from "@/data/mockData";
import { Badge } from "@/app/components/Badge";
import { Btn } from "@/app/components/Btn";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { InviteUserModal } from "@/app/components/InviteUserModal";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { activateUser, deleteUser, disableUser, rejectInvitation } from "@/app/store/actions/userActions";
import { showToast } from "@/app/store/actions/uiActions";
import type { SBU, SBUUser } from "@/app/types";

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

// ─── SBU Details Page ─────────────────────────────────────────────────────────
export function SBUDetailsPage({ sbu }: { sbu: SBU }) {
  const dispatch = useAppDispatch();
  const role = useAppSelector(state => state.auth.role);
  const [showInvite, setShowInvite] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: UserAction; user: SBUUser } | null>(null);
  const users = useAppSelector(state => state.users.users.filter(user => user.sbu === sbu.name));
  const activeUserCount = users.filter(user => user.status !== "Disabled").length;

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

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-heading-sm">{sbu.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin: <span className="text-foreground font-medium">{sbu.admin}</span></p>
        </div>
        <Badge label={sbu.status} variant={sbu.status === "Active" ? "positive" : "inactive"} />
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="grid grid-cols-3 gap-4">
          {[{ label: "Users", value: `${activeUserCount}/${sbu.allowedUsers}` }, { label: "Analysis Completed", value: sbu.products }, { label: "Collections Saved", value: sbu.collections }].map(s => (
            <div key={s.label} className="p-3 rounded-xl bg-background border border-border text-center">
              <div className="font-mono font-bold text-primary text-2xl">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-border">
          <UserQuotaBar users={activeUserCount} allowedUsers={sbu.allowedUsers} />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Team Members</h3>
          <Btn size="sm" onClick={() => setShowInvite(true)}><Plus size={12} /> Invite User</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Email", "Role", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary">{getInitials(user.name)}</div>
                      <span className="text-sm font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-5 py-3.5"><Badge label={user.role} /></td>
                  <td className="px-5 py-3.5"><Badge label={user.status} variant={user.status === "Active" ? "positive" : user.status === "Pending" ? "pending" : "disabled"} /></td>
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
      {showInvite && <InviteUserModal defaultSBU={sbu.name} allowRoleSelection={role !== "sbu_admin"} onClose={() => setShowInvite(false)} />}
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
    </div>
  );
}

// ─── Route Wrapper ────────────────────────────────────────────────────────────
export function SBUDetailsRoute({ allowAccess = true, allowedSBUId }: { allowAccess?: boolean; allowedSBUId?: number }) {
  const { sbuId } = useParams<{ sbuId: string }>();
  const sbu = SBUS.find(s => s.id === Number(sbuId));
  if (!allowAccess || !sbu || (allowedSBUId !== undefined && sbu.id !== allowedSBUId)) return <Navigate to="/not-found" replace />;
  return <SBUDetailsPage sbu={sbu} />;
}
