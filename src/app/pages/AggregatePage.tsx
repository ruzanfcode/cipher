import React, { useState } from "react";
import { Navigate, useLocation } from "react-router";
import { Search, Layers, Check, SlidersHorizontal, Star, AlertTriangle, ChevronDown } from "lucide-react";
import { ATTRIBUTES, ATTRIBUTE_NAMES, REVIEWS } from "@/data/mockData";
import { SentimentPie } from "@/app/components/SentimentPie";
import { SentimentBar } from "@/app/components/SentimentBar";
import { ConfidenceBadge } from "@/app/components/ConfidenceBadge";
import { ProductSelectorStrip } from "@/app/components/ProductSelectorStrip";
import { OverallSentimentInsight } from "../components/OverallSentimentInsight";
import { SENTIMENT_BUCKETS } from "@/app/components/ComparisonHeatmap";
import { cx } from "@/app/lib/utils";
import type { Product } from "@/app/types";


// ─── Aggregate Page ───────────────────────────────────────────────────────────
export function AggregatePage({ products, onCompare }: { products: Product[]; onCompare: (products: Product[]) => void }) {
  const [selectedIds, setSelectedIds] = useState<number[]>(products.map(p => p.id));
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [attrFocus, setAttrFocus]             = useState("all");
  const [attrSentiment, setAttrSentiment]     = useState("all");
  const [sortBy, setSortBy]                   = useState("newest");
  const [searchReview, setSearchReview]       = useState("");
  const [insightView, setInsightView]         = useState<"heatmap" | "attribute">("attribute");
  const [showHeatmapValues, setShowHeatmapValues] = useState(true);
  const [openAttribute, setOpenAttribute]     = useState<string | null>(null);

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));
  const aggregateReviews = selectedProducts.flatMap(product =>
    REVIEWS.map(review => ({ ...review, aggregateId: `${product.id}-${review.id}`, product }))
  );
  const filteredReviews = aggregateReviews.filter(review => {
    const matchS = sentimentFilter === "all" || review.sentiment === sentimentFilter;
    const matchA = attrFocus === "all" || review.attributes.includes(attrFocus);
    const matchAttrSentiment = attrSentiment === "all" || review.sentiment === (attrSentiment === "mixed" ? "neutral" : attrSentiment);
    const searchText = `${review.text} ${review.reviewer} ${review.product.name} ${review.product.brand}`.toLowerCase();
    const matchQ = !searchReview || searchText.includes(searchReview.toLowerCase());
    return matchS && matchA && matchAttrSentiment && matchQ;
  });

  const combined = {
    positive: Math.round(selectedProducts.reduce((a, p) => a + p.sentiment.positive, 0) / selectedProducts.length),
    neutral:  Math.round(selectedProducts.reduce((a, p) => a + p.sentiment.neutral,  0) / selectedProducts.length),
    negative: Math.round(selectedProducts.reduce((a, p) => a + p.sentiment.negative, 0) / selectedProducts.length),
  };

  const heatmapAttributes = ATTRIBUTES;
  const heatmapProducts = selectedProducts;
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
      const bucketIndex = Math.min(9, Math.max(0, Math.floor(dominant.value / 10)));
      const bucket = SENTIMENT_BUCKETS[bucketIndex];
      return { attribute: attr.name, positive, neutral, negative, dominant, bucket };
    }),
  }));

  const toggleSelect = (id: number) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectCls =
    "h-10 w-full rounded-xl border-0 bg-[#f1f2f5] px-5 text-[12px] font-semibold text-slate-600 " +
    "outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/15 dark:bg-background dark:text-foreground";

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6">
        <h1 className="font-black text-foreground uppercase tracking-tight mb-6 text-[28px] sm:text-[36px] lg:text-[44px]">Aggregate Analysis</h1>
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
                    {insightView === "heatmap" ? "Sentiment Heatmap" : "Attribute Sentiment"}
                  </h3>
                </div>
                <div className="inline-flex w-fit items-center gap-1 rounded-xl border border-border bg-background p-1">
                  {(["attribute", "heatmap"] as const).map(view => (
                    <button
                      key={view}
                      onClick={() => setInsightView(view)}
                      className={cx(
                        "rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] transition-all",
                        insightView === view ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {view === "heatmap" ? "Heatmap" : "Attribute"}
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
                    <table className="w-full text-xs">
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
                          <tr key={row.product.id} className="border-t border-border">
                            <td className="py-3 pr-4 text-foreground font-medium">{row.product.name}</td>
                            {row.attributes.map((cell, index) => (
                              <td key={`${cell.attribute}-${index}`} className="py-0 px-2 text-center">
                                <div
                                  className={cx("flex min-h-10 items-center justify-center rounded-xl px-0 py-0 text-xs font-black shadow-sm", cell.dominant.value <= 35 || cell.dominant.value >= 80 ? "text-white" : "text-slate-950")}
                                  style={{ backgroundColor: cell.bucket.color }}
                                  title={`Positive: ${cell.positive}%, Mixed: ${cell.neutral}%, Negative: ${cell.negative}% (${cell.bucket.label})`}
                                >
                                  {showHeatmapValues && <span className="text-base leading-none">{cell.dominant.value}%</span>}
                                </div>
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
              ) : (
                <>
                  <div className="space-y-6">
                    {Array.from({ length: Math.ceil(ATTRIBUTES.length / 2) }, (_, rowIndex) => {
                      const rowAttributes = ATTRIBUTES.slice(rowIndex * 2, rowIndex * 2 + 2);
                      const openEntry = rowAttributes
                        .map((attr, index) => ({ attr, attrIndex: rowIndex * 2 + index }))
                        .find(({ attr, attrIndex }) => openAttribute === `${attr.name}-${attrIndex}`);
                      return (
                        <div key={rowIndex}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {rowAttributes.map((attr, index) => {
                              const attrIndex = rowIndex * 2 + index;
                              const attributeKey = `${attr.name}-${attrIndex}`;
                              const isOpen = openAttribute === attributeKey;
                              return (
                                <div key={attributeKey} className="pb-5 border-b border-border">
                                  <button
                                    type="button"
                                    onClick={() => setOpenAttribute(current => current === attributeKey ? null : attributeKey)}
                                    className="w-full text-left"
                                  >
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                      <p className="text-sm font-bold text-foreground">{attr.name}</p>
                                      <ChevronDown size={14} className={cx("shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                                    </div>
                                    <SentimentBar data={{ positive: attr.positive, neutral: attr.neutral, negative: attr.negative }} />
                                    <p className="text-xs text-muted-foreground italic mt-3">
                                      Discussed in {Math.round(attr.usage * 100)}% of reviews
                                    </p>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          {openEntry && (
                            <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f3f4f6] p-4 dark:border-border dark:bg-background/60">
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-foreground">{openEntry.attr.name}</p>
                                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                                  {Math.round(openEntry.attr.usage * 100)}% discussed
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {heatmapRows.map(row => {
                                  const attributeKey = `${openEntry.attr.name}-${openEntry.attrIndex}`;
                                  const cell = row.attributes[openEntry.attrIndex];
                                  return (
                                    <div key={`${attributeKey}-${row.product.id}`} className="rounded-xl border border-border bg-background p-3">
                                      <div className="mb-2 flex items-center justify-between gap-3">
                                        <p className="text-xs font-bold text-foreground">{row.product.name}</p>
                                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">{cell.dominant.value}%</span>
                                      </div>
                                      <SentimentBar data={{ positive: cell.positive, neutral: cell.neutral, negative: cell.negative }} />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
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

            <div className="bg-white rounded-2xl border border-transparent p-[40px] dark:bg-card">
              <div className="flex flex-col gap-8 mb-14">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="text-[15px] font-black uppercase tracking-[0.38em] text-slate-800 dark:text-foreground">Reviews Feed</span>
                  <div className="relative sm:w-80">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      value={searchReview}
                      onChange={e => setSearchReview(e.target.value)}
                      placeholder="Search reviews & feedback..."
                      className="h-10 w-full rounded-xl border border-slate-100 bg-[#f7f8fa] pl-11 pr-4 text-[12px] font-semibold text-foreground shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-border dark:bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.26em] mb-3">Sort By</p>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectCls}>
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.26em] mb-3">Overall Sentiment</p>
                    <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)} className={selectCls}>
                      <option value="all">All Overall Sentiments</option>
                      <option value="positive">Positive</option>
                      <option value="neutral">Neutral</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.26em] mb-3">Filter By Attribute</p>
                    <select value={attrFocus} onChange={e => setAttrFocus(e.target.value)} className={selectCls}>
                      <option value="all">All Attributes</option>
                      {ATTRIBUTE_NAMES.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.26em] mb-4">Attribute Sentiment</p>
                    <div className="grid grid-cols-3 gap-4">
                      {(["positive", "mixed", "negative"] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setAttrSentiment(v => v === s ? "all" : s)}
                          className={cx(
                            "text-[10px] font-black uppercase tracking-[0.16em] transition-colors",
                            attrSentiment === s
                              ? s === "positive"
                                ? "text-emerald-600"
                                : s === "negative"
                                  ? "text-red-500"
                                  : "text-amber-500"
                              : "text-slate-300 hover:text-slate-500"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="text-center py-14 text-muted-foreground">
                  <Search size={28} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No reviews matched</p>
                </div>
              ) : (
                <div className="max-h-[784px] space-y-6 overflow-y-auto pr-4 [scrollbar-color:#e5e7eb_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e5e7eb] hover:[&::-webkit-scrollbar-thumb]:bg-[#d1d5db] dark:[scrollbar-color:#475569_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
                  {filteredReviews.map(review => (
                    <div
                      key={review.aggregateId}
                      className="rounded-[24px] border border-slate-200 bg-white px-8 py-8 shadow-xl shadow-slate-900/10 transition-colors hover:border-slate-300 dark:border-border dark:bg-background"
                    >
                      <div className="mb-8 flex flex-wrap items-center gap-7">
                        <span className={cx(
                          "inline-flex h-7 items-center rounded-full border bg-white px-5 text-[10px] font-black uppercase tracking-[0.22em] dark:bg-background",
                          review.sentiment === "positive"
                            ? "border-emerald-200 text-emerald-600"
                            : review.sentiment === "negative"
                              ? "border-red-200 text-red-500"
                              : "border-amber-200 text-amber-500"
                        )}>
                          {review.sentiment === "neutral" ? "mixed" : review.sentiment}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={16} strokeWidth={2.4} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-500"} />
                          ))}
                        </div>
                      </div>

                      <p className="mb-5 text-[14px] font-black leading-tight text-[#06142a] dark:text-foreground">{review.reviewer}</p>
                      <p className="text-[13px] font-semibold italic leading-[1.65] text-[#6b7280] dark:text-muted-foreground">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
