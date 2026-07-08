import React, { useRef, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { Layers, TrendingUp, LayoutPanelLeft, Grid2X2, ChevronDown, Share2, Pin } from "lucide-react";
import { ATTRIBUTES } from "@/data/mockData";
import { SentimentPie } from "@/app/components/SentimentPie";
import { SentimentBar } from "@/app/components/SentimentBar";
import { ConfidenceBadge } from "@/app/components/ConfidenceBadge";
import { ProductSelectorStrip } from "@/app/components/ProductSelectorStrip";
import { ComparisonHeatmap } from "@/app/components/ComparisonHeatmap";
import { ComparisonReviewFeed } from "../components/ComparisonReviewFeed";
import { FilteredReviewModal } from "../components/FilteredReviewModal";
import { cx } from "@/app/lib/utils";
import { useAppDispatch } from "@/app/store/hooks";
import { showToast } from "@/app/store/actions/uiActions";
import type { Product } from "@/app/types";

function SideBySideColumn({ product, isPinned, onPin, onAttributeSegmentClick }: {
  product: Product; isPinned: boolean; onPin: () => void;
  onAttributeSegmentClick: (filter: { product: Product; attribute: string; rangeLabel: string; score: number }) => void;
}) {
  return (
    <div className={cx("w-[clamp(320px,calc((100vw-8rem)/4),520px)] shrink-0 rounded-3xl overflow-hidden flex flex-col transition-colors duration-150 border",
      isPinned
        ? "relative z-10 bg-white dark:bg-card border-gray-200 dark:border-border shadow-[0_22px_70px_rgba(15,23,42,0.22)] dark:shadow-[0_22px_70px_rgba(0,0,0,0.34)]"
        : "bg-[#FFFFFF] dark:bg-muted border-gray-200 dark:border-border hover:bg-[#e5e7eb] dark:hover:bg-accent"
    )}>
      <div className="p-10 h-[176px] border-b border-gray-100 dark:border-border shrink-0">
        <div className="flex items-start gap-3">
          <div className="w-[68px] h-[68px] rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200 shadow-sm">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="font-bold text-primary uppercase mb-1 leading-tight tracking-[0.18em]" style={{ fontSize: 9 }}>{product.category}</div>
            <div className="font-black py-2 text-foreground uppercase leading-tight tracking-tight" style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>{product.name}</div>
            <div className="text-muted-foreground mt-0.5 uppercase tracking-wide" style={{ fontSize: 9 }}>{product.brand}</div>
            <div className="mt-2"><ConfidenceBadge reviews={product.reviews} /></div>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0 pt-0.5">
            <button onClick={onPin} title={isPinned ? "Unpin this product" : "Pin this product"}
              className={cx("w-8 h-8 rounded-full flex items-center justify-center transition-all",
                isPinned ? "bg-primary text-white shadow-md" : "bg-white dark:bg-card border border-gray-200 dark:border-border text-muted-foreground hover:text-primary hover:border-primary/50"
              )}>
              <Pin size={13} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <section className="h-[320px] px-10 pt-4 pb-3 overflow-hidden shrink-0">
          <SentimentPie data={product.sentiment} />
        </section>
        <section className="h-[740px] px-10 pt-10 pb-10 overflow-hidden border-b border-gray-100 dark:border-border shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-3.5 rounded-full bg-primary shrink-0" />
            <span className="font-bold uppercase tracking-[0.18em] text-muted-foreground" style={{ fontSize: 10 }}>Attribute Analysis</span>
          </div>
          <div>
            {ATTRIBUTES.map(attr => (
              <div key={attr.name} className="mb-4 p-1 pb-2 last:mb-0">
                <div className="font-bold uppercase tracking-wide text-foreground mb-1.5" style={{ fontSize: 10, letterSpacing: '0.05em' }}>{attr.name}</div>
                <SentimentBar
                  data={{ positive: attr.positive, neutral: attr.neutral, negative: attr.negative }}
                  onSegmentClick={segment => onAttributeSegmentClick({ product, attribute: attr.name, rangeLabel: segment.label, score: segment.value })}
                />
                <div className="text-muted-foreground italic" style={{ fontSize: 10, letterSpacing: '0.05em', paddingTop: '5px' }}>Discussed in {Math.round(attr.usage * 100)}% of reviews</div>
              </div>
            ))}
          </div>
        </section>
        <section className="h-[880px] px-10 pt-10 pb-10 overflow-hidden shrink-0">
          <ComparisonReviewFeed />
        </section>
      </div>
    </div>
  );
}

// ─── Comparison Page ──────────────────────────────────────────────────────────
export function ComparisonPage({ products, onAggregate }: { products: Product[]; onAggregate: (products: Product[]) => void }) {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode]         = useState<"side-by-side" | "matrix">("side-by-side");
  const [sortBy, setSortBy]             = useState<"sentiment" | "review">("sentiment");
  const [showSortDrop, setShowSortDrop] = useState(false);
  const [selectedIds, setSelectedIds]   = useState<number[]>(products.map(p => p.id));
  const [pinnedId, setPinnedId]         = useState<number | null>(products[0]?.id ?? null);
  const [reviewFilter, setReviewFilter] = useState<{
    product: Product;
    attribute: string;
    rangeLabel: string;
    score: number;
  } | null>(null);

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));
  const pinnedProduct    = pinnedId === null ? undefined : selectedProducts.find(p => p.id === pinnedId);
  const scrollingProducts = pinnedProduct ? selectedProducts.filter(p => p.id !== pinnedProduct.id) : selectedProducts;

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (pinnedId !== null && !next.includes(pinnedId)) setPinnedId(null);
      return next;
    });
  };

  const togglePinProduct = (id: number) => {
    setPinnedId(current => current === id ? null : id);
    if (pinnedId !== id) requestAnimationFrame(() => scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" }));
  };

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6">        
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-7">
          <h1 className="font-black text-foreground uppercase tracking-tight text-[28px] sm:text-[36px] lg:text-[44px]">Product Comparison</h1>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex items-center gap-0.5 bg-card border border-border rounded-xl p-1 shadow-sm">
            {([
              { id: "side-by-side" as const, label: "SIDE-BY-SIDE", Icon: LayoutPanelLeft },
              { id: "matrix"       as const, label: "MATRIX",       Icon: Grid2X2 },
            ]).map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setViewMode(id)}
                className={cx("flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-semibold tracking-wide",
                  viewMode === id ? "bg-white dark:bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                )} style={{ fontSize: 11 }}>
                <Icon size={12} /> {label}
              </button>
            ))}
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-muted-foreground tracking-wide" style={{ fontSize: 11 }}>
            SORT BY:
            <div className="relative">
              <button
                onClick={() => setShowSortDrop(v => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground hover:border-primary/40 transition-colors font-bold uppercase tracking-wide"
                style={{ fontSize: 11 }}
              >
                {sortBy === "sentiment" ? "SENTIMENT" : "REVIEW"}
                <ChevronDown size={11} className={cx("transition-transform duration-150", showSortDrop && "rotate-180")} />
              </button>
              {showSortDrop && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortDrop(false)} />
                  <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden min-w-[120px]">
                    {(["sentiment", "review"] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setShowSortDrop(false); }}
                        className={cx(
                          "w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors",
                          sortBy === opt ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
                        )}
                      >
                        {opt === "sentiment" ? "Sentiment" : "Review"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            </div>
          </div>
        </div>
        <div className="mb-7">
          <ProductSelectorStrip
            products={products} selectedIds={selectedIds} onToggle={toggleSelect}
            onSelectAll={() => setSelectedIds(products.map(p => p.id))} onClear={() => setSelectedIds([])}
            actionLabel="AGGREGATE SELECTED" ActionIcon={TrendingUp}
            onAction={() => onAggregate(selectedProducts)}
          />
        </div>
      </div>

      {selectedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Layers size={36} className="opacity-20" />
          <p className="text-sm font-medium">Select products above to start comparing</p>
        </div>
      ) : viewMode === "side-by-side" ? (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex gap-8 items-start bg-transparent">
            {pinnedProduct && (
              <SideBySideColumn
                product={pinnedProduct}
                isPinned={true}
                onPin={() => togglePinProduct(pinnedProduct.id)}
                onAttributeSegmentClick={setReviewFilter}
              />
            )}
            <div ref={scrollRef} className="flex-1 min-w-0 overflow-x-auto pb-4 scrollbar-none bg-transparent">
              <div className="flex gap-8">
                {scrollingProducts.map(p => (
                  <SideBySideColumn
                    key={p.id}
                    product={p}
                    isPinned={false}
                    onPin={() => togglePinProduct(p.id)}
                    onAttributeSegmentClick={setReviewFilter}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <ComparisonHeatmap products={selectedProducts} />
        </div>
      )}
      {reviewFilter && (
        <FilteredReviewModal
          product={reviewFilter.product}
          attribute={reviewFilter.attribute}
          rangeLabel={reviewFilter.rangeLabel}
          score={reviewFilter.score}
          onClose={() => setReviewFilter(null)}
        />
      )}
    </div>
  );
}

// ─── Route Wrapper ────────────────────────────────────────────────────────────
export function ComparisonRoute({ onAggregate }: { onAggregate: (products: Product[]) => void }) {
  const location = useLocation();
  const products: Product[] = location.state?.products ?? [];
  if (products.length === 0) return <Navigate to="/collection" replace />;
  return <ComparisonPage products={products} onAggregate={onAggregate} />;
}
