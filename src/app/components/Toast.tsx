import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";
import { cx } from "@/app/lib/utils";
import type { ToastVariant } from "@/app/store/slices/uiSlice";

const variantConfig: Record<ToastVariant, { Icon: typeof CheckCircle2; className: string }> = {
  success: { Icon: CheckCircle2, className: "bg-[#347df3] text-white shadow-[#347df3]/25" },
  failed: { Icon: XCircle, className: "bg-red-600 text-white shadow-red-600/25" },
  warning: { Icon: AlertTriangle, className: "bg-amber-500 text-slate-950 shadow-amber-500/25" },
};

export function Toast({ message, variant = "success", onDone }: { message: string; variant?: ToastVariant; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  const { Icon, className } = variantConfig[variant];

  return (
    <div className={cx("fixed right-4 top-16 z-[100] flex min-h-11 w-[calc(100%-2rem)] max-w-[420px] items-center gap-3 rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-[0.08em] shadow-2xl sm:right-6", className)}>
      <Icon size={16} className="shrink-0" />
      <span className="min-w-0 flex-1 leading-relaxed">{message}</span>
      <button onClick={onDone} className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-current/80 transition-colors hover:bg-white/15 hover:text-current" aria-label="Dismiss notification">
        <X size={15} />
      </button>
    </div>
  );
}
