import React from "react";
import { cx } from "@/app/lib/utils";

export function ConfidenceBadge({ reviews }: { reviews: number }) {
  const state = reviews <= 0 ? "none" : reviews >= 50 ? "high" : reviews >= 15 ? "medium" : "low";
  const reviewCountLabel = reviews > 1000 ? "1000+" : reviews > 500 ? "500+" : reviews > 100 ? "100+" : reviews > 50 ? "50+" : reviews.toString();
  const showCount = state === "high" || state === "medium";
  const styles = {
    none: {
      label: "NO REVIEWS",
      className: "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300",
      dot: "bg-slate-400",
    },
    low: {
      label: "LOW REVIEWS",
      className: "border-red-300 bg-red-50 text-red-600 dark:border-red-700/70 dark:bg-red-950/35 dark:text-red-300",
      dot: "bg-red-500",
    },
    medium: {
      label: "MEDIUM REVIEWS",
      className: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700/70 dark:bg-amber-950/35 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    high: {
      label: "HIGH REVIEWS",
      className: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700/70 dark:bg-emerald-950/35 dark:text-emerald-300",
      dot: "bg-emerald-500",
    },
  }[state];

  return (
    <span className={cx("inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] sm:px-2.5 sm:text-[10px] sm:tracking-[0.12em]", styles.className)}>
      <span className={cx("h-1.5 w-1.5 rounded-full", styles.dot)} />
      {styles.label}{showCount ? ` (${reviewCountLabel})` : ""}
    </span>
  );
}
