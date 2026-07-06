import React from "react";
import { Check } from "lucide-react";
import { cx } from "@/app/lib/utils";
import type { Product } from "@/app/types";

export function ProductSelectorStrip({
  products, selectedIds, onToggle, onSelectAll, onClear,
  actionLabel, ActionIcon, onAction,
}: {
  products: Product[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onSelectAll: () => void;
  onClear: () => void;
  actionLabel: string;
  ActionIcon: React.ElementType;
  onAction: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold uppercase tracking-[0.18em] text-muted-foreground" style={{ fontSize: 10 }}>
          Select Products
        </span>
        <div className="flex items-center gap-4">
          <button onClick={onSelectAll} className="font-semibold text-primary hover:text-primary/80 transition-colors" style={{ fontSize: 11 }}>SELECT ALL</button>
          <button onClick={onClear} className="font-semibold text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 11 }}>CLEAR</button>
          <button
            onClick={onAction}
            disabled={selectedIds.length < 2}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-primary border border-primary/30 hover:bg-primary/8 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: 11 }}
          >
            <ActionIcon size={11} /> {actionLabel}
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {products.map(p => {
          const sel = selectedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={cx(
                "flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full transition-all shrink-0 border",
                sel
                  ? "bg-card border-border shadow-sm text-foreground"
                  : "bg-transparent border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <span className="truncate uppercase tracking-wide font-semibold" style={{ fontSize: 10, maxWidth: 96 }}>
                {p.name.length > 15 ? p.name.slice(0, 14) + "…" : p.name}
              </span>
              {sel && (
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check size={8} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
