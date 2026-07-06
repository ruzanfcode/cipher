import React, { useState } from "react";
import { Navigate, useParams } from "react-router";
import { Star, Search, ExternalLink, AlertTriangle, Clock, Camera, Plus, Share2, Check } from "lucide-react";
import { PRODUCTS, ATTRIBUTES, ATTRIBUTE_NAMES, REVIEWS } from "@/data/mockData";
import { ConfidenceBadge } from "@/app/components/ConfidenceBadge";
import { SentimentPie } from "@/app/components/SentimentPie";
import { SentimentBar } from "@/app/components/SentimentBar";
import { cx } from "@/app/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { showToast } from "@/app/store/actions/uiActions";
import type { Product } from "@/app/types";

// ─── Product Analysis Page ────────────────────────────────────────────────────
export function ProductAnalysisPage({ product, onAddToCollection, onRemoveFromCollection }: { product: Product; onAddToCollection: (product: Product) => void; onRemoveFromCollection: (id: number) => void }) {
  const dispatch = useAppDispatch();
  const tempCollection = useAppSelector(state => state.collection.tempCollection);
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [attrFocus, setAttrFocus]             = useState("all");
  const [attrSentiment, setAttrSentiment]     = useState("all");
  const [sortBy, setSortBy]                   = useState("newest");
  const [searchReview, setSearchReview]       = useState("");
  const addedToCollection = tempCollection.some(item => item.id === product.id);

  const handleShare = async () => {
    const shareData = { title: product.name, text: `${product.brand} product analysis`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      dispatch(showToast({ message: "Product link copied", variant: "success" }));
    } catch {
      dispatch(showToast({ message: "Unable to share product", variant: "failed" }));
    }
  };

  const handleCaptureScreenshot = async () => {
    const previewWindow = window.open("", "_blank");
    try {
      const { domToBlob } = await import("modern-screenshot");
      const blob = await domToBlob(document.body, {
        backgroundColor: getComputedStyle(document.body).backgroundColor || "#ffffff",
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio || 1,
        style: {
          transform: `translate(${-window.scrollX}px, ${-window.scrollY}px)`,
          transformOrigin: "top left",
        },
      });
      if (!blob) throw new Error("Screenshot capture returned no image");

      const filename = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product-analysis"}-screenshot.png`;
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = filename;
      link.href = objectUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (previewWindow) {
        previewWindow.document.title = filename;
        previewWindow.location.href = objectUrl;
      } else {
        window.open(objectUrl, "_blank");
      }

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      dispatch(showToast({ message: "Screenshot downloaded and opened", variant: "success" }));
    } catch {
      previewWindow?.close();
      dispatch(showToast({ message: "Unable to capture screenshot", variant: "failed" }));
    }
  };

  const filteredReviews = REVIEWS.filter(r => {
    const matchS = sentimentFilter === "all" || r.sentiment === sentimentFilter;
    const matchA = attrFocus === "all" || r.attributes.includes(attrFocus);
    const matchAttrSentiment = attrSentiment === "all" || r.sentiment === (attrSentiment === "mixed" ? "neutral" : attrSentiment);
    const matchQ = !searchReview || r.text.toLowerCase().includes(searchReview.toLowerCase());
    return matchS && matchA && matchAttrSentiment && matchQ;
  });

  const selectCls =
    "text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background text-foreground " +
    "focus:outline-none focus:border-primary transition-all";

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pb-12 space-y-10">

        {/* ── Product Header ────────────────────────────────────────────── */}
        <div className="bg-card/70 rounded-2xl border border-border shadow-xl shadow-slate-900/10 px-10 py-10 sm:px-12 sm:py-12 flex flex-col sm:flex-row items-center sm:items-center gap-8 sm:gap-10 min-h-[270px] transition-colors duration-200 hover:bg-[#e5e7eb] hover:border-[#d8dde5] dark:hover:bg-[#e7ebf0] dark:hover:border-[#d8dde5]">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden bg-muted border border-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.34em] text-muted-foreground">
              {product.brand}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-5">
              <h1 className="font-black text-foreground uppercase tracking-tight leading-none text-[30px] sm:text-[38px] lg:text-[36px]">
                {product.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-7 gap-y-3">
              <span className="text-[11px] font-black uppercase tracking-[0.34em] text-muted-foreground">
                {product.category}
              </span>
              <a href="#" className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-primary hover:underline">
                View Original Product <ExternalLink size={12} />
              </a>
            </div>
            <div className="mt-4 flex justify-center sm:justify-start">
              <ConfidenceBadge reviews={product.reviews} />
            </div>
          </div>
          <div className="flex w-full flex-wrap justify-center gap-3 sm:w-auto sm:shrink-0 sm:justify-end">
            <button
              onClick={() => addedToCollection ? onRemoveFromCollection(product.id) : onAddToCollection(product)}
              className={cx("flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-[10px] font-black uppercase tracking-[0.12em] shadow-lg transition-all",
                addedToCollection ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-primary text-white hover:bg-primary/90 shadow-primary/25"
              )}
            >
              {addedToCollection ? <Check size={13} /> : <Plus size={13} />}
              <span>{addedToCollection ? "Remove From Collection" : "Add To Collection"}</span>
            </button>
            <button onClick={handleShare} className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-primary/30 px-3.5 text-[10px] font-black uppercase tracking-[0.12em] text-primary transition-all hover:bg-primary/8">
              <Share2 size={13} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* ── Overall Pulse + Attribute Sentiment ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Overall Pulse */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-[40px]">
            <div className="flex items-center gap-2 mb-5">
              <Clock size={12} className="text-primary shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Overall Pulse</span>
            </div>

            <SentimentPie data={product.sentiment} />
          </div>

          {/* Attribute Sentiment */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-[40px]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-0.5 h-4 rounded-full bg-primary shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">Attribute Sentiment</span>
            </div>

            <div className="divide-y divide-border">
              {Array.from({ length: Math.ceil(ATTRIBUTES.length / 2) }, (_, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 py-4 first:pt-0 last:pb-0">
                  {ATTRIBUTES.slice(i * 2, i * 2 + 2).map(attr => (
                    <div key={attr.name}>
                      <p className="text-sm font-semibold text-foreground mb-2">{attr.name}</p>
                      <SentimentBar data={{ positive: attr.positive, neutral: attr.neutral, negative: attr.negative }} />
                      <p className="text-[11px] text-muted-foreground italic mt-1.5">
                        Discussed in {Math.round(attr.usage * 100)}% of reviews
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-border">
              {[
                { label: "Positive", color: "rgb(46, 204, 113)" },
                { label: "Mixed",    color: "rgb(245, 176, 65)" },
                { label: "Negative", color: "rgb(231, 76, 60)" },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-600 rounded-full px-2.5 py-0.5 ml-auto">
                <AlertTriangle size={9} />
                LOW CONFIDENCE ({'<'}10% DISCUSSED)
              </span>
            </div>
          </div>
        </div>

        {/* ── Reviews Feed ──────────────────────────────────────────────── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-[40px]">

          {/* Feed header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-[0.34em] text-foreground">Reviews Feed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground" />
                <input
                  value={searchReview}
                  onChange={e => setSearchReview(e.target.value)}
                  placeholder="Search reviews & feedback..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
              <button onClick={handleCaptureScreenshot} className="h-11 w-11 rounded-xl bg-muted text-foreground flex items-center justify-center hover:bg-accent transition-colors" aria-label="Capture screenshot">
                <Camera size={17} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            <div>
              <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.24em] mb-2">Sort By</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full rounded-xl border border-transparent bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-all">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.24em] mb-2">Overall Sentiment</p>
              <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)} className="w-full rounded-xl border border-transparent bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-all">
                <option value="all">All Overall Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.24em] mb-2">Filter By Attribute</p>
              <select value={attrFocus} onChange={e => setAttrFocus(e.target.value)} className="w-full rounded-xl border border-transparent bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-all">
                <option value="all">All Attributes</option>
                {ATTRIBUTE_NAMES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.24em] mb-4">Attribute Sentiment</p>
              <div className="grid grid-cols-3 gap-3">
                {(["positive", "mixed", "negative"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setAttrSentiment(v => v === s ? "all" : s)}
                    className={cx(
                      "py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all",
                      attrSentiment === s
                        ? s === "positive"
                          ? "text-emerald-600"
                          : s === "negative"
                            ? "text-red-500"
                            : "text-amber-500"
                        : s === "positive"
                          ? "text-muted-foreground/50 hover:text-emerald-600"
                          : s === "negative"
                            ? "text-muted-foreground/50 hover:text-red-500"
                            : "text-muted-foreground/50 hover:text-amber-500"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Review list */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-14 text-muted-foreground">
              <Search size={28} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">No reviews matched</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[640px] overflow-y-auto pr-3">
              {filteredReviews.map(review => (
                <div
                  key={review.id}
                  className="rounded-3xl bg-card border border-border px-8 py-7 shadow-xl shadow-slate-900/10 hover:border-primary/20 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <span className={cx(
                      "inline-flex rounded-full border px-5 py-2 text-[9px] font-black uppercase tracking-[0.22em]",
                      review.sentiment === "positive"
                        ? "border-emerald-200 text-emerald-600"
                        : review.sentiment === "negative"
                          ? "border-red-200 text-red-500"
                          : "border-amber-200 text-amber-500"
                    )}>
                      {review.sentiment}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={15} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-foreground"} />
                      ))}
                    </div>
                  </div>

                  <p className="text-base font-black text-foreground mb-4">{review.reviewer}</p>
                  <p className="text-sm italic font-semibold text-muted-foreground leading-relaxed">"{review.text}"</p>

                  {/* {review.attributes.length > 0 && (
                    <div className="flex gap-2 mt-6 flex-wrap">
                      {review.attributes.map(a => (
                        <span key={a} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{a}</span>
                      ))}
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Route Wrapper ────────────────────────────────────────────────────────────
export function ProductAnalysisRoute({ onAddToCollection, onRemoveFromCollection }: { onAddToCollection: (product: Product) => void; onRemoveFromCollection: (id: number) => void }) {
  const { productId } = useParams<{ productId: string }>();
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) return <Navigate to="/product-catalog" replace />;
  return <ProductAnalysisPage product={product} onAddToCollection={onAddToCollection} onRemoveFromCollection={onRemoveFromCollection} />;
}
