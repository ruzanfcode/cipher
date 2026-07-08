import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function BreadcrumbBar({ label }: { label: string }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-visible border-b border-border bg-card/60 px-6 py-2 text-xs text-muted-foreground">
      <div>
        <span className="font-mono text-primary">CIPHER</span>
        <span className="mx-2 opacity-40">/</span>
        <span>{label}</span>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="absolute left-6 top-full z-30 mt-1 inline-flex h-5 w-5 cursor-pointer items-center justify-center bg-transparent p-0 text-muted-foreground transition-colors hover:text-primary focus:outline-none"
        aria-label="Go back to previous page"
        title="Go back"
      >
        <ArrowLeft size={17} strokeWidth={2.5} />
      </button>
    </div>
  );
}
