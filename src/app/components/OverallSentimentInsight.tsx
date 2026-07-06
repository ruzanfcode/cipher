import React from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Sigma } from "lucide-react";
import { ATTRIBUTES } from "@/data/mockData";
import { cx } from "@/app/lib/utils";
import type { Product } from "@/app/types";

function average(values: number[]) {
  return Math.round(values.reduce((total, value) => total + value, 0) / Math.max(1, values.length));
}

function confidenceMeta(score: number) {
  if (score >= 75) return { label: "High Confidence", className: "border-emerald-300 bg-emerald-50 text-emerald-700" };
  if (score >= 55) return { label: "Medium Confidence", className: "border-amber-300 bg-amber-50 text-amber-700" };
  return { label: "Low Confidence", className: "border-red-300 bg-red-50 text-red-600" };
}

export function OverallSentimentInsight({ products }: { products: Product[] }) {
  const overallPositive = average(products.map(product => product.sentiment.positive));
  const overallNeutral = average(products.map(product => product.sentiment.neutral));
  const overallNegative = average(products.map(product => product.sentiment.negative));
  const netSentiment = overallPositive - overallNegative;
  const dominantSentiment = [
    { label: "Positive", value: overallPositive },
    { label: "Neutral", value: overallNeutral },
    { label: "Negative", value: overallNegative },
  ].sort((current, next) => next.value - current.value)[0];
  const confidenceScore = dominantSentiment.value;
  const confidence = confidenceMeta(confidenceScore);

  const highContributor = products.reduce((best, product) => product.sentiment.positive > best.sentiment.positive ? product : best, products[0]);
  const lowContributor = products.reduce((worst, product) => product.sentiment.positive < worst.sentiment.positive ? product : worst, products[0]);
  const mostSatisfied = ATTRIBUTES.reduce((best, attr) => attr.positive > best.positive ? attr : best, ATTRIBUTES[0]);
  const leastSatisfied = ATTRIBUTES.reduce((worst, attr) => attr.positive < worst.positive ? attr : worst, ATTRIBUTES[0]);
  const lowConfidenceAttribute = ATTRIBUTES.find(attr => attr.usage < 0.1);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Overall Sentiment Insight</h3>
          <p className="text-xs text-muted-foreground">{dominantSentiment.label} sentiment is the clearest signal across selected products</p>
        </div>
        <span className={cx("inline-flex w-fit items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em]", confidence.className)}>
          {confidence.label} {confidenceScore}%
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-border dark:bg-background">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">High Contributor</span>
            <ArrowUp size={14} className="text-emerald-600" />
          </div>
          <p className="text-sm font-black text-foreground">{highContributor.name}</p>
          <p className="mt-1 text-xs font-semibold text-emerald-600">{highContributor.sentiment.positive}% positive</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-border dark:bg-background">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Low Contributor</span>
            <ArrowDown size={14} className="text-red-500" />
          </div>
          <p className="text-sm font-black text-foreground">{lowContributor.name}</p>
          <p className="mt-1 text-xs font-semibold text-red-500">{lowContributor.sentiment.positive}% positive</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-border dark:bg-background">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Net Sentiment</span>
            <Sigma size={14} className="text-primary" />
          </div>
          <p className="text-sm font-black text-foreground">+{netSentiment} pts</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">{overallPositive}% positive - {overallNegative}% negative</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-border dark:bg-background">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Most Satisfied Attribute</p>
          <p className="mt-2 text-sm font-black text-foreground">{mostSatisfied.name}</p>
          <p className="mt-1 text-xs font-semibold text-emerald-600">{mostSatisfied.positive}% positive, discussed in {Math.round(mostSatisfied.usage * 100)}% of reviews</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-border dark:bg-background">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Least Satisfied Attribute</p>
          <p className="mt-2 text-sm font-black text-foreground">{leastSatisfied.name}</p>
          <p className="mt-1 text-xs font-semibold text-red-500">{leastSatisfied.positive}% positive, {leastSatisfied.negative}% negative</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-500">
          <AlertTriangle size={11} /> {lowConfidenceAttribute ? `Low Confidence: ${lowConfidenceAttribute.name}` : "No Low Confidence Attributes"} (&lt;10% Discussed)
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-[10px] font-semibold text-muted-foreground md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-background">Overall = sum(product positive %) / product count</div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-background">Net = overall positive % - overall negative %</div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-background">Confidence = strongest sentiment share across positive, neutral, negative</div>
      </div>
    </div>
  );
}