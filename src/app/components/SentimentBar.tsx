import React, { useState } from "react";

const SEGMENTS = [
  { key: "positive" as const, label: "Positive", color: "rgb(46, 204, 113)" },
  { key: "neutral"  as const, label: "Mixed",    color: "rgb(245, 176, 65)" },
  { key: "negative" as const, label: "Negative", color: "rgb(231, 76, 60)" },
];

export function SentimentBar({ data, onSegmentClick }: {
  data: { positive: number; neutral: number; negative: number };
  onSegmentClick?: (segment: { key: "positive" | "neutral" | "negative"; label: string; value: number }) => void;
}) {
  const [tooltip, setTooltip] = useState<{ label: string; value: number; left: number } | null>(null);

  return (
    <div className="relative">
      <div className="flex rounded-full overflow-hidden bg-border/30" style={{ height: 10 }}>
        {SEGMENTS.map(s => (
          <div
            key={s.key}
            role={onSegmentClick ? "button" : undefined}
            tabIndex={onSegmentClick ? 0 : undefined}
            className={onSegmentClick ? "cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/30" : "cursor-default"}
            style={{ width: `${data[s.key]}%`, background: s.color }}
            onClick={() => onSegmentClick?.({ key: s.key, label: s.label, value: data[s.key] })}
            onKeyDown={event => {
              if (!onSegmentClick || (event.key !== "Enter" && event.key !== " ")) return;
              event.preventDefault();
              onSegmentClick({ key: s.key, label: s.label, value: data[s.key] });
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              const parent = el.parentElement?.parentElement as HTMLElement;
              const elRect = el.getBoundingClientRect();
              const parentRect = parent.getBoundingClientRect();
              setTooltip({ label: s.label, value: data[s.key], left: elRect.left - parentRect.left + elRect.width / 2 });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </div>
      {tooltip && (
        <div
          className="absolute bottom-full mb-2 -translate-x-1/2 bg-card border border-border rounded-lg px-2 py-1 text-xs font-semibold text-foreground shadow-md pointer-events-none z-50 whitespace-nowrap"
          style={{ left: tooltip.left }}
        >
          {tooltip.label}: {tooltip.value}%
        </div>
      )}
    </div>
  );
}
