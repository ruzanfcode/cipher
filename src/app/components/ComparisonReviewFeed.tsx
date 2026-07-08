import React, { useState } from "react";
import { Search, Star } from "lucide-react";
import { ATTRIBUTE_NAMES, REVIEWS } from "@/data/mockData";
import { cx } from "@/app/lib/utils";

export function ComparisonReviewFeed({ variant = "compact" }: { variant?: "compact" | "wide" }) {
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

  const isWide = variant === "wide";
  const labelCls = isWide
    ? "mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 md:text-[11px]"
    : "mb-2 text-[8px] font-black uppercase tracking-[0.22em] text-slate-400 sm:text-[9px] md:text-[10px]";
  const compactAttrSentimentLabelCls = cx(labelCls, !isWide && "whitespace-nowrap tracking-[0.12em] sm:text-[8px] md:text-[9px]");
  const selectCls = cx(
    "w-full rounded-xl border-0 bg-[#f1f2f5] font-semibold text-slate-600 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/15 dark:bg-background dark:text-foreground",
    isWide ? "h-10 px-4 text-xs md:text-sm" : "h-8 px-3 text-[9px] sm:text-[10px] md:text-[11px]"
  );

  return (
    <div className="h-full flex flex-col min-h-0 dark:bg-accent">
      <div className={cx("flex flex-col shrink-0", isWide ? "gap-7 mb-10" : "gap-8 mb-14")}>
        <div className="flex items-center justify-between gap-4 border-l-2 border-primary pl-5">
          <span className={cx("font-black uppercase tracking-[0.42em] text-slate-400 dark:text-muted-foreground", isWide ? "text-xs md:text-sm" : "text-[10px] sm:text-[11px]")}>Reviews Feed</span>
          <div className={cx("relative", isWide ? "w-full max-w-sm" : "w-48")}>
            <Search size={isWide ? 15 : 13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search..."
              className={cx(
                "w-full rounded-xl border border-slate-100 bg-white pl-10 pr-3 font-semibold text-foreground shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary/30 focus:ring-2 focus:ring-primary/10 dark:border-border dark:bg-background",
                isWide ? "h-10 text-xs md:text-sm" : "h-8 text-[11px] sm:text-xs"
              )}
            />
          </div>
        </div>

        <div className={cx("grid gap-x-4 gap-y-6 px-5", isWide ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-2")}>
          <div>
            <div className={labelCls}>Sort By</div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as "newest" | "oldest")} className={selectCls}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div>
            <div className={labelCls}>Overall Sentiment</div>
            <select value={sentFilter} onChange={e => setSentFilter(e.target.value)} className={selectCls}>
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          <div>
            <div className={labelCls}>Attribute Focus</div>
            <select value={attrFocus} onChange={e => setAttrFocus(e.target.value)} className={selectCls}>
              <option value="all">All Attributes</option>
              {ATTRIBUTE_NAMES.map(attribute => <option key={attribute}>{attribute}</option>)}
            </select>
          </div>
          <div>
            <div className={isWide ? labelCls : compactAttrSentimentLabelCls}>{isWide ? "Attribute Sentiment" : "Attr. Sentiment"}</div>
            <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-0.5 dark:border-border dark:bg-background">
              {(["positive", "mixed", "negative"] as const).map(sentiment => (
                <button
                  key={sentiment}
                  onClick={() => setAttrSentiment(current => current === sentiment ? "all" : sentiment)}
                  className={cx(
                    "rounded-lg font-black uppercase tracking-[0.12em] transition-all",
                    isWide ? "h-9 text-[10px] md:text-xs" : "h-7 text-[8px] sm:text-[9px] md:text-[10px]",
                    attrSentiment === sentiment
                      ? sentiment === "positive"
                        ? "bg-emerald-50 text-emerald-600"
                        : sentiment === "negative"
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-500"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-card"
                  )}
                >
                  {isWide ? sentiment : sentiment === "positive" ? "Pos" : sentiment === "negative" ? "Neg" : "Mix"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 overflow-y-auto pr-4 min-h-0 [scrollbar-color:#e5e7eb_transparent] [scrollbar-width:thin] [&:has(.comparison-review-row:hover)]:[scrollbar-color:#ffffff_transparent] [&:has(.comparison-review-row:hover)::-webkit-scrollbar-thumb]:bg-white [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e5e7eb] hover:[&::-webkit-scrollbar-thumb]:bg-[#d1d5db] dark:[scrollbar-color:#475569_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 dark:[&:has(.comparison-review-row:hover)::-webkit-scrollbar-thumb]:bg-white">
        {filtered.length === 0 ? (
          <div className={cx("text-muted-foreground text-center py-10", isWide ? "text-sm" : "text-xs")}>No reviews match</div>
        ) : filtered.map(review => (
          <div
            key={review.id}
            className={cx(
              "comparison-review-row rounded-2xl border-l-2 px-4 pt-3 pb-5 transition-colors hover:bg-[#eef1f5] dark:hover:bg-background/70",
              review.sentiment === "positive"
                ? "border-l-emerald-400"
                : review.sentiment === "negative"
                  ? "border-l-red-400"
                  : "border-l-amber-400"
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2" title={`${review.sentiment} sentiment`}>
                <span className={cx(
                  "h-2 w-2 shrink-0 rounded-full",
                  review.sentiment === "positive"
                    ? "bg-emerald-400"
                    : review.sentiment === "negative"
                      ? "bg-red-400"
                      : "bg-amber-400"
                )} />
                <p className={cx("truncate font-black leading-tight text-[#111827] dark:text-foreground", isWide ? "text-sm md:text-base" : "text-[11px] sm:text-xs")}>{review.reviewer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={isWide ? 14 : 12} strokeWidth={2.4} className={index < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-500"} />
                ))}
              </div>
            </div>
            <p className={cx("font-semibold italic leading-[1.6] text-[#4b5563] dark:text-muted-foreground", isWide ? "text-sm md:text-base" : "text-[11px] sm:text-xs")}>"{review.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}