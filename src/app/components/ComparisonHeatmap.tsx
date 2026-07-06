import React, { useState } from "react";
import { ATTRIBUTES } from "@/data/mockData";
import { cx } from "@/app/lib/utils";
import type { Product } from "@/app/types";

type HeatmapCell = {
  columnId: string;
  label: string;
  value: number;
  isAverage?: boolean;
};

export const SENTIMENT_BUCKETS = [
  { label: "0-10", color: "#b00026" },
  { label: "10-20", color: "#d73027" },
  { label: "20-30", color: "#f46d43" },
  { label: "30-40", color: "#fdae61" },
  { label: "40-50", color: "#fee08b" },
  { label: "50-60", color: "#e6f598" },
  { label: "60-70", color: "#abd96b" },
  { label: "70-80", color: "#66bd63" },
  { label: "80-90", color: "#1a9850" },
  { label: "90-100", color: "#006837" },
];

const HEATMAP_ATTRIBUTES = [
  "Fit",
  "Comfort",
  "Material",
  "Aesthetic",
  "Price",
  "Performance",
  "Functionality",
  "Workmanship",
  "Quality",
  "Durability",
];

function sentimentBucket(value: number) {
  const bucketIndex = Math.min(9, Math.max(0, Math.floor(value / 10)));
  return SENTIMENT_BUCKETS[bucketIndex];
}

function sentimentColor(value: number) {
  return sentimentBucket(value).color;
}

function sentimentGradient() {
  return `linear-gradient(to top, ${SENTIMENT_BUCKETS.map((bucket, index) => `${bucket.color} ${index * 10}%`).join(", ")}, ${SENTIMENT_BUCKETS[SENTIMENT_BUCKETS.length - 1].color} 100%)`;
}

function textColor(value: number) {
  return value <= 35 || value >= 80 ? "text-white" : "text-slate-950";
}

function attributeSeed(attribute: string) {
  return attribute.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
}

function productAttributeScore(product: Product, attribute: string, index: number) {
  const baseAttribute = ATTRIBUTES.find(item => item.name === attribute)?.positive ?? product.sentiment.positive;
  const spread = ((product.id * 23 + attributeSeed(attribute) * 3 + index * 19) % 101);
  const sentimentBase = Math.round(
    product.sentiment.positive * 0.42 +
    baseAttribute * 0.28 +
    (100 - product.sentiment.negative) * 0.12 +
    spread * 0.18
  );
  const contrast = ((product.id + index) % 4 === 0 ? -34 : (product.id + index) % 5 === 0 ? 22 : 0);
  return Math.max(0, Math.min(100, sentimentBase + contrast));
}

function productLabel(product: Product) {
  const words = product.name.split(" ").filter(Boolean);
  return words.slice(0, 2).join(" ").toUpperCase();
}

export function ComparisonHeatmap({ products }: { products: Product[] }) {
  const [showValues, setShowValues] = useState(true);
  const visibleProducts = products.slice(0, 6);

  const rows = HEATMAP_ATTRIBUTES.map((attribute, attributeIndex) => {
    const productCells: HeatmapCell[] = visibleProducts.map(product => ({
      columnId: String(product.id),
      label: productLabel(product),
      value: productAttributeScore(product, attribute, attributeIndex),
    }));
    const average = Math.round(productCells.reduce((total, cell) => total + cell.value, 0) / Math.max(1, productCells.length));
    const cells = [{ columnId: "collection-average", label: "Collection Avg", value: average, isAverage: true }, ...productCells];
    const values = cells.map(cell => cell.value);
    return {
      attribute,
      cells,
      average,
      best: Math.max(...values),
      worst: Math.min(...values),
    };
  });

  const columns = ["Collection Avg", ...visibleProducts.map(productLabel)];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10 dark:border-border dark:bg-card">
      <div className="overflow-x-auto pb-3 [scrollbar-color:#e5e7eb_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
        <div className="grid w-max gap-0.5" style={{ gridTemplateColumns: `72px repeat(${columns.length}, 40px) 28px` }}>
          <div />
          {columns.map(column => (
            <div key={column} className="flex h-6 items-end justify-center px-0.5 text-center text-[7px] font-black uppercase leading-tight text-slate-950 dark:text-foreground">
              {column}
            </div>
          ))}
          <div />

          {rows.map(row => (
            <React.Fragment key={row.attribute}>
              <div className="flex h-7 items-center justify-end pr-1 text-[8px] font-black uppercase text-slate-950 dark:text-foreground">
                {row.attribute}
              </div>
              {row.cells.map(cell => {
                const belowAverage = !cell.isAverage && cell.value < row.average;
                const isBest = cell.value === row.best;
                const isWorst = cell.value === row.worst;
                return (
                  <div
                    key={`${row.attribute}-${cell.columnId}`}
                    className={cx(
                      "mx-auto flex h-4 w-8 items-center justify-center rounded border px-0.5 text-[7px] font-black transition-all",
                      textColor(cell.value),
                      isBest && "border-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.45)]",
                      isWorst && "border-red-500 border-dashed shadow-[0_0_12px_rgba(239,68,68,0.4)]",
                      !isBest && !isWorst && "border-white/70"
                    )}
                    style={{ backgroundColor: sentimentColor(cell.value) }}
                    title={`${cell.label} ${row.attribute}: ${cell.value}% positive sentiment (${sentimentBucket(cell.value).label})`}
                  >
                    {showValues && (
                      <span>
                        {cell.value}%{belowAverage && <span className="ml-1 text-red-700">↓</span>}
                      </span>
                    )}
                  </div>
                );
              })}
              {row.attribute === rows[0].attribute && (
                <div className="row-span-10 ml-1.5 flex flex-col items-center justify-center gap-2">
                  <div className="h-[200px] w-2 rounded-sm" style={{ background: sentimentGradient() }} />
                  <div className="-rotate-90 whitespace-nowrap text-[8px] font-bold text-slate-700 dark:text-muted-foreground">% Positive Sentiment</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-1">
        {SENTIMENT_BUCKETS.map(bucket => (
          <div key={bucket.label} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 dark:text-muted-foreground">
            <span className="h-3 w-5 rounded-sm border border-white/70" style={{ backgroundColor: bucket.color }} />
            {bucket.label}
          </div>
        ))}
      </div>
    </div>
  );
}