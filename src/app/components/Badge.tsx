import React from "react";
import { cx } from "@/app/lib/utils";

export function Badge({ label, variant = "default" }: {
  label: string;
  variant?: "default" | "positive" | "negative" | "neutral" | "pending" | "disabled" | "inactive";
}) {
  const styles: Record<string, string> = {
    default:  "bg-secondary text-secondary-foreground",
    positive: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/25",
    negative: "bg-red-500/15 text-red-500 border border-red-500/25",
    neutral:  "bg-amber-500/15 text-amber-600 border border-amber-500/25",
    pending:  "bg-blue-500/15 text-blue-600 border border-blue-500/25",
    disabled: "bg-red-500/10 text-red-500/80 border border-red-500/15",
    inactive: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <span className={cx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", styles[variant])}>
      {label}
    </span>
  );
}
