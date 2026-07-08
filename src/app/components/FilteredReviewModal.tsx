import { Star, X } from "lucide-react";
import { REVIEWS } from "@/data/mockData";
import { cx } from "@/app/lib/utils";
import type { Product } from "@/app/types";

type ReviewSentiment = "positive" | "neutral" | "negative";

function sentimentFromRange(rangeLabel: string): ReviewSentiment {
  if (rangeLabel.includes("Negative")) return "negative";
  if (rangeLabel.includes("Neutral") || rangeLabel.includes("Mixed")) return "neutral";
  return "positive";
}

export function FilteredReviewModal({
  product,
  attribute,
  rangeLabel,
  score,
  onClose,
}: {
  product?: Product;
  attribute: string;
  rangeLabel: string;
  score: number;
  onClose: () => void;
}) {
  const sentiment = sentimentFromRange(rangeLabel);
  const filteredReviews = REVIEWS.filter(review => review.attributes.includes(attribute) && review.sentiment === sentiment);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Filtered Reviews</p>
            <h3 className="mt-2 truncate text-base font-black text-foreground">{product?.name ?? "Aggregate Reviews"}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]">
              <span className="rounded-lg bg-background px-2.5 py-1 text-foreground">{attribute}</span>
              <span className="rounded-lg bg-background px-2.5 py-1 text-muted-foreground">{rangeLabel}</span>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-primary">{score}%</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Close filtered reviews">
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 [scrollbar-color:#e5e7eb_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e5e7eb]">
          {filteredReviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background px-5 py-10 text-center">
              <p className="text-sm font-semibold text-foreground">No reviews match this criteria</p>
              <p className="mt-1 text-xs text-muted-foreground">Try another heatmap cell to inspect matching review signals.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map(review => (
                <div
                  key={review.id}
                  className={cx(
                    "rounded-2xl border-l-2 bg-background px-4 py-4",
                    review.sentiment === "positive"
                      ? "border-l-emerald-400"
                      : review.sentiment === "negative"
                        ? "border-l-red-400"
                        : "border-l-amber-400"
                  )}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={cx(
                        "h-2 w-2 shrink-0 rounded-full",
                        review.sentiment === "positive" ? "bg-emerald-400" : review.sentiment === "negative" ? "bg-red-400" : "bg-amber-400"
                      )} />
                      <p className="truncate text-sm font-black text-foreground">{review.reviewer}</p>
                      <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">{review.date}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={14} strokeWidth={2.4} className={index < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-400"} />
                      ))}
                    </div>
                  </div>
                    <p className="font-sans font-medium text-[#4b5563]" style={{ fontSize: "0.87rem", lineHeight: 1.625, opacity: 0.8 }}>"{review.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}