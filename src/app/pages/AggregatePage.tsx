import React, { useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AlertTriangle, Layers } from "lucide-react";
import { ATTRIBUTES } from "@/data/mockData";
import { SentimentPie } from "@/app/components/SentimentPie";
import { SentimentBar } from "@/app/components/SentimentBar";
import { ConfidenceBadge } from "@/app/components/ConfidenceBadge";
import { ProductSelectorStrip } from "@/app/components/ProductSelectorStrip";
import { OverallSentimentInsight } from "../components/OverallSentimentInsight";
import { ComparisonReviewFeed } from "../components/ComparisonReviewFeed";
import { FilteredReviewModal } from "../components/FilteredReviewModal";
import { AttributeSentimentRankingChart, type AttributeSortDirection } from "../components/AttributeSentimentRankingChart";
import { SENTIMENT_BUCKETS, sentimentBucketForValue } from "@/app/components/ComparisonHeatmap";
import { cx } from "@/app/lib/utils";
import type { Product } from "@/app/types";

// ─── Aggregate Page ───────────────────────────────────────────────────────────
export function AggregatePage({ products, onCompare }: { products: Product[]; onCompare: (products: Product[]) => void }) {
  const [selectedIds, setSelectedIds] = useState<number[]>(products.map(p => p.id));
  const [insightView, setInsightView]         = useState<"overview" | "heatmap" | "attributes">("overview");
  const [showHeatmapValues, setShowHeatmapValues] = useState(false);
  const [attributeSorts, setAttributeSorts] = useState<Record<string, AttributeSortDirection>>({});
  const [reviewFilter, setReviewFilter] = useState<{
    product?: Product;
    attribute: string;
    rangeLabel: string;
    score: number;
  } | null>(null);

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));

  const combined = {
    positive: Math.round(selectedProducts.reduce((a, p) => a + p.sentiment.positive, 0) / selectedProducts.length),
    neutral:  Math.round(selectedProducts.reduce((a, p) => a + p.sentiment.neutral,  0) / selectedProducts.length),
    negative: Math.round(selectedProducts.reduce((a, p) => a + p.sentiment.negative, 0) / selectedProducts.length),
  };

  const heatmapAttributes = ATTRIBUTES;
  const heatmapProducts = selectedProducts;
  const discussionPercentForAttribute = (attribute: { positive: number; neutral: number; negative: number; usage: number }) => (
    [attribute.positive, attribute.neutral, attribute.negative].some(sentiment => sentiment < 15) ? 0 : Math.round(attribute.usage * 100)
  );
  const heatmapRows = heatmapProducts.map(product => ({
    product,
    attributes: heatmapAttributes.map((attr, attrIndex) => {
      const variance = ((product.id * 7 + attrIndex * 11) % 13) - 6;
      const positive = Math.max(0, Math.min(100, Math.round((product.sentiment.positive + attr.positive) / 2 + variance)));
      const negative = Math.max(0, Math.min(100, Math.round((product.sentiment.negative + attr.negative) / 2 - Math.round(variance / 2))));
      const neutral = Math.max(0, 100 - positive - negative);
      const sentiments = [
        { key: "positive" as const, label: "Positive", value: positive },
        { key: "mixed" as const, label: "Mixed", value: neutral },
        { key: "negative" as const, label: "Negative", value: negative },
      ];
      const dominant = sentiments.reduce((best, sentiment) => sentiment.value > best.value ? sentiment : best, sentiments[0]);
      const bucket = sentimentBucketForValue(dominant.value);
      return { attribute: attr.name, positive, neutral, negative, dominant, bucket };
    }),
  }));

  const attributeCharts = heatmapAttributes.map((attribute, attributeIndex) => {
    const productsWithSentiment = heatmapRows.map(row => ({
      product: row.product,
      sentiment: row.attributes[attributeIndex],
    }));
    return {
      attribute,
      attributeIndex,
      products: productsWithSentiment,
    };
  });

  const sortDirectionFor = (attributeIndex: number, metric: "positive" | "negative") => attributeSorts[`${attributeIndex}-${metric}`] ?? "desc";
  const toggleAttributeSort = (attributeIndex: number, metric: "positive" | "negative") => {
    const key = `${attributeIndex}-${metric}`;
    setAttributeSorts(current => ({ ...current, [key]: (current[key] ?? "desc") === "desc" ? "asc" : "desc" }));
  };

  const sortByMetric = <T extends { sentiment: { positive: number; negative: number } }>(items: T[], metric: "positive" | "negative", direction: AttributeSortDirection) => (
    [...items].sort((current, next) => direction === "asc" ? current.sentiment[metric] - next.sentiment[metric] : next.sentiment[metric] - current.sentiment[metric])
  );

  const toggleSelect = (id: number) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6">
        <h1 className="page-heading-sm mb-6">Aggregate Analysis</h1>
        <ProductSelectorStrip
          products={products} selectedIds={selectedIds} onToggle={toggleSelect}
          onSelectAll={() => setSelectedIds(products.map(p => p.id))} onClear={() => setSelectedIds([])}
          actionLabel="COMPARE SELECTED" ActionIcon={Layers}
          onAction={() => onCompare(selectedProducts)}
        />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {selectedProducts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Layers size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Select at least one product to see analysis</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-[2rem]">
              <div className="bg-card rounded-2xl border border-border p-[40px]">
                <h3 className="text-sm font-semibold text-foreground mb-4">Combined Sentiment</h3>
                <SentimentPie data={combined} />
              </div>
              <div className="lg:col-span-2 min-h-[320px] rounded-2xl border border-border bg-white p-[40px] dark:bg-card">
                <OverallSentimentInsight products={selectedProducts} />
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-[40px] mb-[2rem]">
              <div className="flex flex-col gap-4 mb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-primary shrink-0" />
                  <h3 className="text-sm font-black uppercase tracking-[0.28em] text-foreground">
                    {insightView === "heatmap" ? "Sentiment Heatmap" : insightView === "attributes" ? "Attributes" : "Overview Sentiment"}
                  </h3>
                </div>
                <div className="inline-flex w-fit items-center gap-1 rounded-xl border border-border bg-background p-1">
                  {(["overview", "heatmap", "attributes"] as const).map(view => (
                    <button
                      key={view}
                      onClick={() => setInsightView(view)}
                      className={cx(
                        "rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] transition-all",
                        insightView === view ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {view === "heatmap" ? "Heatmap" : view === "attributes" ? "Attributes" : "Overview"}
                    </button>
                  ))}
                </div>
              </div>
              {insightView === "heatmap" ? (
                <>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">Dominant sentiment per product attribute</p>
                    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={showHeatmapValues}
                        onChange={event => setShowHeatmapValues(event.target.checked)}
                        className="h-3.5 w-3.5 accent-primary"
                      />
                      Show Values
                    </label>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-2 text-xs">
                      <thead>
                        <tr>
                          <th className="text-left text-muted-foreground font-medium pb-3 pr-4 w-36">Product</th>
                          {heatmapAttributes.map((attr, index) => (
                            <th key={`${attr.name}-${index}`} className="text-center text-muted-foreground font-medium pb-3 px-2 min-w-[112px]">{attr.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {heatmapRows.map(row => (
                          <tr key={row.product.id}>
                            <td className="rounded-l-xl bg-background py-3 pl-4 pr-4 text-foreground font-medium">{row.product.name}</td>
                            {row.attributes.map((cell, index) => (
                              <td key={`${cell.attribute}-${index}`} className={cx("bg-background py-2 px-2 text-center", index === row.attributes.length - 1 && "rounded-r-xl")}>
                                <button
                                  type="button"
                                  onClick={() => setReviewFilter({ product: row.product, attribute: cell.attribute, rangeLabel: cell.bucket.label, score: cell.dominant.value })}
                                  className={cx("flex min-h-10 w-full items-center justify-center rounded-xl px-0 py-0 text-xs font-black shadow-sm transition-all hover:scale-[1.03] hover:ring-2 hover:ring-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/35", cell.dominant.value < 30 || cell.dominant.value >= 75 ? "text-white" : "text-slate-950")}
                                  style={{ backgroundColor: cell.bucket.color }}
                                  title={`Positive: ${cell.positive}%, Mixed: ${cell.neutral}%, Negative: ${cell.negative}% (${cell.bucket.label})`}
                                >
                                  {showHeatmapValues && <span className="text-base leading-none">{cell.dominant.value}%</span>}
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {SENTIMENT_BUCKETS.map(bucket => (
                      <div key={bucket.label} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-muted-foreground">
                        <span className="h-3 w-5 rounded-sm border border-white/70" style={{ backgroundColor: bucket.color }} />
                        {bucket.label}
                      </div>
                    ))}
                  </div>
                </>
              ) : insightView === "attributes" ? (
                <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
                  {attributeCharts.map(chart => {
                    const positiveSort = sortDirectionFor(chart.attributeIndex, "positive");
                    const negativeSort = sortDirectionFor(chart.attributeIndex, "negative");
                    const positiveRows = sortByMetric(chart.products, "positive", positiveSort);
                    const negativeRows = sortByMetric(chart.products, "negative", negativeSort);
                    return (
                      <AttributeSentimentRankingChart
                        key={`${chart.attribute.name}-${chart.attributeIndex}`}
                        attributeName={chart.attribute.name}
                        discussedPercent={discussionPercentForAttribute(chart.attribute)}
                        positiveRows={positiveRows}
                        negativeRows={negativeRows}
                        positiveSort={positiveSort}
                        negativeSort={negativeSort}
                        onTogglePositiveSort={() => toggleAttributeSort(chart.attributeIndex, "positive")}
                        onToggleNegativeSort={() => toggleAttributeSort(chart.attributeIndex, "negative")}
                        onSentimentClick={({ product, attribute, rangeLabel, score }) => setReviewFilter({ product, attribute, rangeLabel, score })}
                      />
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {Array.from({ length: Math.ceil(ATTRIBUTES.length / 2) }, (_, rowIndex) => {
                      const rowAttributes = ATTRIBUTES.slice(rowIndex * 2, rowIndex * 2 + 2);
                      return (
                        <div key={rowIndex}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {rowAttributes.map((attr, index) => {
                              const attrIndex = rowIndex * 2 + index;
                              const attributeKey = `${attr.name}-${attrIndex}`;
                              const discussedPercent = discussionPercentForAttribute(attr);
                              return (
                                <div key={attributeKey} className="pb-5 border-b border-border">
                                  <div className="mb-2 flex items-center justify-between gap-3">
                                    <p className="text-sm font-bold text-foreground">{attr.name}</p>
                                  </div>
                                  <SentimentBar
                                    data={{ positive: attr.positive, neutral: attr.neutral, negative: attr.negative }}
                                    onSegmentClick={segment => setReviewFilter({ attribute: attr.name, rangeLabel: segment.label, score: segment.value })}
                                  />
                                  <p className={discussedPercent === 0 ? "mt-3 flex items-center gap-1 text-xs font-semibold italic text-amber-500" : "mt-3 text-xs italic text-muted-foreground"}>
                                    {discussedPercent === 0 && <AlertTriangle size={12} />}
                                    Discussed in {discussedPercent}% of reviews
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-6 mt-6">
                    {[
                      { label: "Positive", color: "rgb(46, 204, 113)" },
                      { label: "Mixed", color: "rgb(245, 176, 65)" },
                      { label: "Negative", color: "rgb(231, 76, 60)" },
                    ].map(l => (
                      <span key={l.label} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-foreground">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: l.color }} />
                        {l.label}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="h-[880px] rounded-2xl border border-transparent bg-white p-[40px] dark:bg-card">
              <ComparisonReviewFeed variant="wide" />
            </div>
            {reviewFilter && (
              <FilteredReviewModal
                product={reviewFilter.product}
                attribute={reviewFilter.attribute}
                rangeLabel={reviewFilter.rangeLabel}
                score={reviewFilter.score}
                onClose={() => setReviewFilter(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Route Wrapper ────────────────────────────────────────────────────────────
export function AggregateRoute({ onCompare }: { onCompare: (products: Product[]) => void }) {
  const location = useLocation();
  const products: Product[] = location.state?.products ?? [];
  if (products.length === 0) return <Navigate to="/collection" replace />;
  return <AggregatePage products={products} onCompare={onCompare} />;
}
