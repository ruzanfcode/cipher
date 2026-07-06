import React from "react";

export function BreadcrumbBar({ label }: { label: string }) {
  return (
    <div className="border-b border-border bg-card/60 px-6 py-2 text-xs text-muted-foreground">
      <span className="font-mono text-primary">CIPHER</span>
      <span className="mx-2 opacity-40">/</span>
      <span>{label}</span>
    </div>
  );
}
