import React from "react";
import { Heart, MessageCircle } from "lucide-react";
import { ATTRIBUTES } from "@/data/mockData";
import { cx } from "@/app/lib/utils";
import type { Product } from "@/app/types";

export const SENTIMENT_BUCKETS = [
  { label: "0-15 Extremely Negative", min: 0, max: 15, color: "#991b1b" },
  { label: "15-30 Negative", min: 15, max: 30, color: "#dc2626" },
  { label: "30-45 Neutral", min: 30, max: 45, color: "#f59e0b" },
  { label: "45-60 Fairly Positive", min: 45, max: 60, color: "#bef264" },
  { label: "60-75 Positive", min: 60, max: 75, color: "#22c55e" },
  { label: "75-100 Extremely Positive", min: 75, max: 100, color: "#15803d" },
];

export function sentimentBucketForValue(value: number) {
  return SENTIMENT_BUCKETS.find(bucket => value >= bucket.min && value < bucket.max) ?? SENTIMENT_BUCKETS[SENTIMENT_BUCKETS.length - 1];
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
  return product.name.toUpperCase();
}

function sentimentLabel(data: Product["sentiment"]) {
  const values = [
    { label: "Positive", value: data.positive },
    { label: "Mixed", value: data.neutral },
    { label: "Negative", value: data.negative },
  ];
  return values.sort((current, next) => next.value - current.value)[0];
}

function attributeSentiment(product: Product, attribute: string, index: number) {
  const positive = productAttributeScore(product, attribute, index);
  const negative = Math.max(0, Math.min(100, Math.round(product.sentiment.negative * 0.58 + ((product.id + index * 17) % 18))));
  const neutral = Math.max(0, 100 - positive - negative);
  return { positive, neutral, negative };
}

function attributeMentioned(product: Product, index: number) {
  return (product.id * 5 + index * 3) % 11 !== 0;
}

function MatrixSentimentBar({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) {
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70 shadow-inner shadow-white/60">
      <div className="bg-[#35c9a3]" style={{ width: `${positive}%` }} />
      <div className="bg-[#f5bd55]" style={{ width: `${neutral}%` }} />
      <div className="bg-[#f87171]" style={{ width: `${negative}%` }} />
    </div>
  );
}

function MatrixConfidenceBadge({ reviews }: { reviews: number }) {
  const label = reviews >= 2500 ? "High Confidence" : reviews >= 1500 ? "Medium Confidence" : "Low Confidence";
  const className = reviews >= 2500
    ? "bg-emerald-100 text-emerald-700"
    : reviews >= 1500
      ? "bg-amber-100 text-amber-700"
      : "bg-[#7b4a30] text-[#ffab2e]";

  return <span className={cx("inline-flex rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]", className)}>{label}</span>;
}

function MetricLabel({ label, Icon }: { label: string; Icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="flex h-full items-center gap-4 border-b border-slate-100 px-8 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600">
      {Icon && <Icon size={15} className="text-slate-700" />}
      {label}
    </div>
  );
}

export function ComparisonHeatmap({ products }: { products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-[#f4f5f7] shadow-xl shadow-slate-900/10 dark:border-border dark:bg-card">
      <div className="overflow-x-auto [scrollbar-color:#d6dbe3_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
        <div className="grid w-max min-w-full" style={{ gridTemplateColumns: `240px repeat(${products.length}, minmax(300px, 1fr))` }}>
          <div className="sticky left-0 z-20 flex h-[220px] items-center border-b border-slate-100 bg-white px-8 text-[11px] font-black uppercase tracking-[0.42em] text-slate-400 dark:bg-card">
            Metrics Matrix
          </div>

          {products.map(product => (
            <div key={product.id} className="flex h-[220px] flex-col items-center justify-center border-b border-slate-100 px-10 text-center">
              <div className="mb-7 h-[92px] w-[92px] overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="max-w-[240px] text-[16px] font-black uppercase leading-tight tracking-[0.05em] text-[#07111f]">
                {productLabel(product)}
              </div>
            </div>
          ))}

          <div className="sticky left-0 z-10 h-[140px] bg-white dark:bg-card"><MetricLabel label="Overall Sentiment" Icon={Heart} /></div>
          {products.map(product => {
            const dominant = sentimentLabel(product.sentiment);
            return (
              <div key={`overall-${product.id}`} className="flex h-[140px] flex-col items-center justify-center border-b border-slate-100 px-12">
                <MatrixSentimentBar positive={product.sentiment.positive} neutral={product.sentiment.neutral} negative={product.sentiment.negative} />
                <div className="mt-5 flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.12em]">
                  <span className="text-[#07111f]">{dominant.value}%</span>
                  <span className={dominant.label === "Negative" ? "text-[#ff4d4d]" : dominant.label === "Mixed" ? "text-[#f7a51b]" : "text-[#18bf8f]"}>{dominant.label}</span>
                </div>
              </div>
            );
          })}

          <div className="sticky left-0 z-10 h-[140px] bg-white dark:bg-card"><MetricLabel label="Review Volume" Icon={MessageCircle} /></div>
          {products.map(product => (
            <div key={`volume-${product.id}`} className="flex h-[140px] flex-col items-center justify-center border-b border-slate-100 px-12">
              <MatrixConfidenceBadge reviews={product.reviews} />
              <div className="mt-4 text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">{product.reviews.toLocaleString()} reviews</div>
            </div>
          ))}

          {ATTRIBUTES.map((attribute, attributeIndex) => (
            <React.Fragment key={`${attribute.name}-${attributeIndex}`}>
              <div className="sticky left-0 z-10 h-[140px] bg-white dark:bg-card"><MetricLabel label={attribute.name} /></div>
              {products.map(product => {
                const mentioned = attributeMentioned(product, attributeIndex);
                const sentiment = attributeSentiment(product, attribute.name, attributeIndex);
                const dominant = sentimentLabel(sentiment);
                return (
                  <div key={`${attribute.name}-${attributeIndex}-${product.id}`} className="flex h-[140px] flex-col items-center justify-center border-b border-slate-100 px-12">
                    {mentioned ? (
                      <>
                        <MatrixSentimentBar positive={sentiment.positive} neutral={sentiment.neutral} negative={sentiment.negative} />
                        <div className="mt-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.12em]">
                          <span className={dominant.label === "Negative" ? "text-[#ff4d4d]" : dominant.label === "Mixed" ? "text-[#f7a51b]" : "text-[#18bf8f]"}>{dominant.value}%</span>
                          <span className="text-slate-400">{dominant.label}</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Not Mentioned</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}