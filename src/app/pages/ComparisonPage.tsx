import React, { useRef, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { Trash2, Search, Layers, TrendingUp, Clock, LayoutPanelLeft, Grid2X2, ChevronDown, Star, Share2, Pin } from "lucide-react";
import { ATTRIBUTES, ATTRIBUTE_NAMES, REVIEWS } from "@/data/mockData";
import { SentimentPie } from "@/app/components/SentimentPie";
import { SentimentBar } from "@/app/components/SentimentBar";
import { ConfidenceBadge } from "@/app/components/ConfidenceBadge";
import { ProductSelectorStrip } from "@/app/components/ProductSelectorStrip";
import { ComparisonHeatmap } from "@/app/components/ComparisonHeatmap";
import { cx } from "@/app/lib/utils";
import { useAppDispatch } from "@/app/store/hooks";
import { showToast } from "@/app/store/actions/uiActions";
import type { Product } from "@/app/types";

// ─── Sub-components ───────────────────────────────────────────────────────────

function InlineReviewFeed() {
  const [sentFilter, setSentFilter] = useState("all");
  const [attrFocus, setAttrFocus] = useState("all");
  const [attrSentiment, setAttrSentiment] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [search, setSearch] = useState("");

  const filtered = REVIEWS.filter(r => {
    if (sentFilter !== "all" && r.sentiment !== sentFilter) return false;
    if (attrFocus !== "all" && !r.attributes.includes(attrFocus)) return false;
    if (attrSentiment !== "all" && r.sentiment !== (attrSentiment === "mixed" ? "neutral" : attrSentiment)) return false;
    if (search && !r.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => sortBy === "newest" ? b.id - a.id : a.id - b.id);

  const selectCls = "h-8 w-full rounded-xl border-0 bg-[#f1f2f5] px-3 text-[9px] font-semibold text-slate-600 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/15 dark:bg-background dark:text-foreground";

  return (
    <div className="h-full flex flex-col min-h-0 dark:bg-accent">
      <div className="flex flex-col gap-8 mb-14 shrink-0">
        <div className="flex items-center justify-between gap-4 border-l-2 border-primary pl-5">
          <span className="text-[10px] font-black uppercase tracking-[0.42em] text-slate-400 dark:text-muted-foreground">Reviews Feed</span>
          <div className="relative w-48">
            <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-8 w-full rounded-xl border border-slate-100 bg-white pl-10 pr-3 text-[11px] font-semibold text-foreground shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary/30 focus:ring-2 focus:ring-primary/10 dark:border-border dark:bg-background"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-5">
          <div>
            <div className="mb-2 text-[8px] font-black uppercase tracking-[0.22em] text-slate-400">Sort By</div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as "newest" | "oldest")} className={selectCls}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div>
            <div className="mb-2 text-[8px] font-black uppercase tracking-[0.22em] text-slate-400">Overall Sentiment</div>
            <select value={sentFilter} onChange={e => setSentFilter(e.target.value)} className={selectCls}>
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          <div>
            <div className="mb-2 text-[8px] font-black uppercase tracking-[0.22em] text-slate-400">Attribute Focus</div>
            <select value={attrFocus} onChange={e => setAttrFocus(e.target.value)} className={selectCls}>
              <option value="all">All Attributes</option>
              {ATTRIBUTE_NAMES.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <div className="mb-4 text-[8px] font-black uppercase tracking-[0.22em] text-slate-400">Attribute Sentiment</div>
            <div className="grid grid-cols-3 gap-2">
              {(["positive", "mixed", "negative"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setAttrSentiment(current => current === s ? "all" : s)}
                  className={cx(
                    "text-[8px] font-black uppercase tracking-[0.16em] transition-colors",
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

      <div className="space-y-12 overflow-y-auto pr-4 min-h-0 [scrollbar-color:#e5e7eb_transparent] [scrollbar-width:thin] [&:has(.comparison-review-row:hover)]:[scrollbar-color:#ffffff_transparent] [&:has(.comparison-review-row:hover)::-webkit-scrollbar-thumb]:bg-white [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e5e7eb] hover:[&::-webkit-scrollbar-thumb]:bg-[#d1d5db] dark:[scrollbar-color:#475569_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 dark:[&:has(.comparison-review-row:hover)::-webkit-scrollbar-thumb]:bg-white">
        {filtered.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-10">No reviews match</div>
        ) : filtered.map(review => (
          <div key={review.id} className="comparison-review-row rounded-2xl px-4 py-2 transition-colors hover:bg-[#eef1f5] dark:hover:bg-background/70">
            <div className="mb-4 flex items-center gap-3">
              <span className={cx(
                "inline-flex h-5 items-center rounded-full border bg-white px-2.5 text-[9px] font-black uppercase tracking-[0.08em] dark:bg-background",
                review.sentiment === "positive"
                  ? "border-emerald-200 text-emerald-600"
                  : review.sentiment === "negative"
                    ? "border-red-200 text-red-500"
                    : "border-amber-200 text-amber-600"
              )}>
                {review.sentiment}
              </span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={12} strokeWidth={2.4} className={index < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-500"} />
                ))}
              </div>
            </div>

            <p className="mb-3 text-[11px] font-black leading-tight text-[#111827] dark:text-foreground">{review.reviewer}</p>
            <p className="text-[11px] font-semibold italic leading-[1.6] text-[#4b5563] dark:text-muted-foreground">"{review.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SideBySideColumn({ product, isPinned, onPin, onRemove }: {
  product: Product; isPinned: boolean; onPin: () => void; onRemove: () => void;
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
            <button onClick={onRemove} className="w-8 h-8 rounded-full bg-white dark:bg-card border border-gray-200 dark:border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-all">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <section className="h-[500px] px-10 pt-10 overflow-hidden shrink-0">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-0.5 h-3.5 rounded-full bg-primary shrink-0" />
            <span className="font-bold uppercase tracking-[0.18em] text-muted-foreground" style={{ fontSize: 10 }}>Sentiment Overview</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-3.5 rounded-full bg-primary shrink-0" />
            <span className="font-bold uppercase tracking-[0.18em] text-foreground flex items-center gap-1.5" style={{ fontSize: 10 }}>
              <Clock size={11} className="text-primary" /> Overall Pulse
            </span>
          </div>
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
                <SentimentBar data={{ positive: attr.positive, neutral: attr.neutral, negative: attr.negative }} />
                <div className="text-muted-foreground italic" style={{ fontSize: 10, letterSpacing: '0.05em', paddingTop: '5px' }}>Discussed in {Math.round(attr.usage * 100)}% of reviews</div>
              </div>
            ))}
          </div>
        </section>
        <section className="h-[880px] px-10 pt-10 pb-10 overflow-hidden shrink-0">
          <InlineReviewFeed />
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

  const removeFromComparison = (id: number) => {
    setSelectedIds(prev => {
      const next = prev.filter(x => x !== id);
      if (id === pinnedId) setPinnedId(null);
      return next;
    });
  };

  const togglePinProduct = (id: number) => {
    setPinnedId(current => current === id ? null : id);
    if (pinnedId !== id) requestAnimationFrame(() => scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" }));
  };

  const handleShare = async () => {
    const shareData = { title: "Product Comparison", text: `${selectedProducts.length} product comparison`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      dispatch(showToast({ message: "Comparison link copied", variant: "success" }));
    } catch {
      dispatch(showToast({ message: "Unable to share comparison", variant: "failed" }));
    }
  };

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4 sm:mb-6">
          <button onClick={handleShare} className="flex h-10 items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 text-[10px] font-black uppercase tracking-[0.12em] text-primary transition-all hover:bg-primary/8">
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
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
                onRemove={() => removeFromComparison(pinnedProduct.id)}
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
                    onRemove={() => removeFromComparison(p.id)}
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
