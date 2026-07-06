import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { Btn } from "@/app/components/Btn";
import { cx } from "@/app/lib/utils";

export function ConfirmDialog({ title, message, confirmLabel, tone = "danger", onCancel, onConfirm }: {
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "danger" | "warning" | "success";
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const styles = {
    danger: {
      Icon: ShieldAlert,
      panel: "border-red-500/20 shadow-red-950/10 dark:shadow-red-950/30",
      glow: "bg-red-500/20",
      icon: "bg-red-500 text-white shadow-red-500/30",
      eyebrow: "text-red-500",
      confirm: "!bg-red-600 hover:!bg-red-700 !text-white shadow-red-600/20",
    },
    warning: {
      Icon: AlertTriangle,
      panel: "border-amber-500/25 shadow-amber-950/10 dark:shadow-amber-950/30",
      glow: "bg-amber-400/25",
      icon: "bg-amber-500 text-slate-950 shadow-amber-500/30",
      eyebrow: "text-amber-600 dark:text-amber-400",
      confirm: "!bg-amber-500 hover:!bg-amber-400 !text-slate-950 shadow-amber-500/20",
    },
    success: {
      Icon: CheckCircle2,
      panel: "border-emerald-500/25 shadow-emerald-950/10 dark:shadow-emerald-950/30",
      glow: "bg-emerald-400/25",
      icon: "bg-emerald-500 text-white shadow-emerald-500/30",
      eyebrow: "text-emerald-600 dark:text-emerald-400",
      confirm: "!bg-emerald-600 hover:!bg-emerald-500 !text-white shadow-emerald-600/20",
    },
  }[tone];
  const Icon = styles.Icon;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-md dark:bg-black/55">
      <div className={cx("relative w-full max-w-[460px] overflow-hidden rounded-2xl border bg-card shadow-2xl", styles.panel)}>
        <div className={cx("absolute -right-16 -top-20 h-40 w-40 rounded-full blur-3xl", styles.glow)} />
        <div className="relative flex items-start justify-between gap-4 px-6 pt-6 pb-5">
          <div className="flex items-start gap-4">
            <div className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg", styles.icon)}>
              <Icon size={22} />
            </div>
            <div>
              <p className={cx("mb-1 text-[10px] font-black uppercase tracking-[0.22em]", styles.eyebrow)}>Confirmation Required</p>
              <h3 className="text-lg font-black text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p>
            </div>
          </div>
          <button onClick={onCancel} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Close confirmation">
            <X size={15} />
          </button>
        </div>
        <div className="relative flex gap-3 border-t border-border/70 bg-background/35 px-6 py-5">
          <Btn variant="secondary" className="flex-1 justify-center" onClick={onCancel}>Cancel</Btn>
          <Btn className={cx("flex-1 justify-center shadow-lg", styles.confirm)} onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>
  );
}