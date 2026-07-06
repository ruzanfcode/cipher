import React from "react";
import { useNavigate } from "react-router";
import { CipherLogo } from "@/app/components/CipherLogo";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <CipherLogo />
      <div>
        <div className="font-black text-foreground leading-none mb-2" style={{ fontSize: 96 }}>404</div>
        <h1 className="text-xl font-bold text-foreground uppercase tracking-widest mb-2">Page Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <button
        onClick={() => navigate("/product-catalog", { replace: true })}
        className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Back to Product Catalog
      </button>
    </div>
  );
}
