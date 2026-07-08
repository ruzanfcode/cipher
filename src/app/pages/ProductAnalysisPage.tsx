import React, { useState } from "react";
import { Navigate, useParams } from "react-router";
import { ExternalLink, AlertTriangle, Clock, Copy } from "lucide-react";
import { PRODUCTS, ATTRIBUTES } from "@/data/mockData";
import { ConfidenceBadge } from "@/app/components/ConfidenceBadge";
import { SentimentPie } from "@/app/components/SentimentPie";
import { SentimentBar } from "@/app/components/SentimentBar";
import { ComparisonReviewFeed } from "../components/ComparisonReviewFeed";
import { FilteredReviewModal } from "../components/FilteredReviewModal";
import { useAppDispatch } from "@/app/store/hooks";
import { showToast } from "@/app/store/actions/uiActions";
import type { Product } from "@/app/types";

// ─── Product Analysis Page ────────────────────────────────────────────────────
export function ProductAnalysisPage({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [reviewFilter, setReviewFilter] = useState<{
    attribute: string;
    rangeLabel: string;
    score: number;
  } | null>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      dispatch(showToast({ message: "Product link copied", variant: "success" }));
    } catch {
      dispatch(showToast({ message: "Unable to copy product link", variant: "failed" }));
    }
  };

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
            <button onClick={handleCopyLink} className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 text-primary transition-all hover:bg-primary/8" aria-label="Copy product link" title="Copy product link">
              <Copy size={15} />
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
                      <SentimentBar
                        data={{ positive: attr.positive, neutral: attr.neutral, negative: attr.negative }}
                        onSegmentClick={segment => setReviewFilter({ attribute: attr.name, rangeLabel: segment.label, score: segment.value })}
                      />
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
        <div className="h-[880px] rounded-2xl border border-border bg-card p-[40px] shadow-sm">
          <ComparisonReviewFeed variant="wide" />
        </div>
        {reviewFilter && (
          <FilteredReviewModal
            product={product}
            attribute={reviewFilter.attribute}
            rangeLabel={reviewFilter.rangeLabel}
            score={reviewFilter.score}
            onClose={() => setReviewFilter(null)}
          />
        )}

      </div>
    </div>
  );
}

// ─── Route Wrapper ────────────────────────────────────────────────────────────
export function ProductAnalysisRoute() {
  const { productId } = useParams<{ productId: string }>();
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) return <Navigate to="/product-catalog" replace />;
  return <ProductAnalysisPage product={product} />;
}
