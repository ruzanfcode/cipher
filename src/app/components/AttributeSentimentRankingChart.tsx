import { AlertTriangle } from "lucide-react";
import type { Product } from "@/app/types";

export type AttributeSortDirection = "asc" | "desc";

type AttributeRankingItem = {
  product: Product;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
};

export function AttributeSentimentRankingChart({
  attributeName,
  discussedPercent,
  positiveRows,
  negativeRows,
  positiveSort,
  negativeSort,
  onTogglePositiveSort,
  onToggleNegativeSort,
}: {
  attributeName: string;
  discussedPercent: number;
  positiveRows: AttributeRankingItem[];
  negativeRows: AttributeRankingItem[];
  positiveSort: AttributeSortDirection;
  negativeSort: AttributeSortDirection;
  onTogglePositiveSort: () => void;
  onToggleNegativeSort: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-foreground">{attributeName}</p>
            <span className="text-[10px] font-semibold text-muted-foreground">
              Neutral not shown
            </span>
          </div>
          <p className={discussedPercent === 0 ? "mt-2 flex items-center gap-1 text-xs font-semibold italic text-amber-500" : "mt-2 text-xs italic text-muted-foreground"}>
            {discussedPercent === 0 && <AlertTriangle size={12} />}
            Discussed in {discussedPercent}% of reviews
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">Positive</p>
            <button
              type="button"
              onClick={onTogglePositiveSort}
              className="rounded-lg border border-border bg-background px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {positiveSort === "desc" ? "Desc" : "Asc"}
            </button>
          </div>
          <div className="space-y-3">
            {positiveRows.map(({ product, sentiment }) => (
              <div key={`${attributeName}-positive-${product.id}`}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <p className="truncate text-xs font-bold text-foreground">{product.name}</p>
                  <span className="text-xs font-black text-emerald-600">{sentiment.positive}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${sentiment.positive}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-500">Negative</p>
            <button
              type="button"
              onClick={onToggleNegativeSort}
              className="rounded-lg border border-border bg-background px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {negativeSort === "desc" ? "Desc" : "Asc"}
            </button>
          </div>
          <div className="space-y-3">
            {negativeRows.map(({ product, sentiment }) => (
              <div key={`${attributeName}-negative-${product.id}`}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <p className="truncate text-xs font-bold text-foreground">{product.name}</p>
                  <span className="text-xs font-black text-red-500">{sentiment.negative}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-red-100">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${sentiment.negative}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}