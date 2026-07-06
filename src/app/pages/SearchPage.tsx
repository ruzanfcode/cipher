import React from "react";
import { Search, X, Bookmark, Check, Link } from "lucide-react";
import { BRANDS, PRODUCTS } from "@/data/mockData";
import { BrandLogoSVG } from "@/app/components/BrandLogoSVG";
import { ConfidenceBadge } from "@/app/components/ConfidenceBadge";
import { cx } from "@/app/lib/utils";
import { useAppSelector } from "@/app/store/hooks";
import type { Product, SearchMode } from "@/app/types";

export function SearchPage({
  onAddToCollection, onRemoveFromCollection, onAnalyze,
  onQueryChange, onToggleBrand, onClearBrands,
  onSearchModeChange,
}: {
  onAddToCollection: (p: Product) => void;
  onRemoveFromCollection: (id: number) => void;
  onAnalyze: (p: Product) => void;
  onQueryChange: (q: string) => void;
  onToggleBrand: (id: number) => void;
  onClearBrands: () => void;
  onSearchModeChange: (m: SearchMode) => void;
}) {
  const tempCollection = useAppSelector(s => s.collection.tempCollection);
  const query          = useAppSelector(s => s.search.query);
  const selectedBrands = useAppSelector(s => s.search.selectedBrands);
  const searchMode     = useAppSelector(s => s.search.searchMode);

  const isSearching = query.trim().length > 0;

  const filteredProducts = PRODUCTS.filter(p => {
    const q = query.toLowerCase();
    const matchQuery = !query.trim() || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchBrand = selectedBrands.length === 0 || selectedBrands.some(id => BRANDS.find(b => b.id === id)?.name === p.brand);
    return matchQuery && matchBrand;
  });

  const activeBrands = selectedBrands.map(id => BRANDS.find(b => b.id === id)).filter(Boolean) as typeof BRANDS;
  const inTemp = (id: number) => tempCollection.some(p => p.id === id);

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12 text-center">
        <h1 className="font-black text-foreground tracking-tight text-[32px] sm:text-[42px] lg:text-[52px]">Discover Products</h1>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.35em] text-muted-foreground">Uncover consumer sentiment and insights across products</p>
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8 lg:p-10 transition-colors duration-200 hover:bg-[#e5e7eb] dark:hover:bg-[#e7ebf0] dark:hover:border-[#d8dde5] dark:hover:shadow-none">
      {/* Search panel */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black tracking-[0.36em] text-primary uppercase">Search Mode</span>
          <div className="inline-flex rounded-[10px] bg-slate-100 p-1 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-100 dark:ring-slate-200/70">
            {(["keyword", "url"] as SearchMode[]).map(mode => (
              <button key={mode} onClick={() => onSearchModeChange(mode)}
                className={cx("flex h-6 min-w-[86px] items-center justify-center rounded-[7px] px-4 text-[9px] font-black uppercase tracking-[0.14em] transition-all",
                  searchMode === mode ? "bg-primary text-white shadow-sm shadow-primary/25" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder={searchMode === "keyword" ? "Search by keyword (e.g. sport shorts, running shoes...)" : "Paste a product URL to analyze..."}
            className="h-14 w-full rounded-[10px] border border-transparent bg-slate-100 pl-12 pr-10 text-sm text-foreground shadow-sm placeholder:text-muted-foreground transition-all focus:outline-none focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:bg-slate-100 dark:text-slate-950 dark:placeholder:text-slate-500 dark:focus:bg-white"
          />
          {query && (
            <button onClick={() => onQueryChange("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Brand filter — only shown when not searching */}
      {!isSearching && (
        <div className="max-w-8xl mx-auto mt-12">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary text-xxs primary">Available Brands</p>
            {selectedBrands.length > 0 && (
              <button onClick={onClearBrands} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <X size={11} /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-8 gap-4">
            {BRANDS.map(brand => {
              const selected = selectedBrands.includes(brand.id);
              return (
                <button
                  key={brand.id}
                  onClick={() => onToggleBrand(brand.id)}
                  className={cx("flex flex-col items-center justify-center gap-4 p-5 rounded-xl border bg-card transition-all hover:border-primary/40 hover:shadow-sm", selected ? "border-primary ring-2 ring-primary/20 shadow-sm" : "border-border")}
                  style={{ minHeight: 140 }}
                >
                  <div className={cx("w-20 h-14 flex items-center justify-center p-1.5 rounded-xl transition-all", selected ? "text-primary" : "text-foreground/60")}>                  
                    {BrandLogoSVG[brand.name]
                      ? React.createElement(BrandLogoSVG[brand.name])
                      : <span className="font-black text-sm">{brand.name.slice(0, 2).toUpperCase()}</span>}
                  </div>
                  <span className={cx("text-[11px] font-black uppercase tracking-[0.18em] text-center leading-tight transition-colors", selected ? "text-primary" : "text-foreground")}>{brand.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search results */}
      {isSearching && (
        <div className="max-w-8xl mx-auto mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-xxs">
              {filteredProducts.length} Result{filteredProducts.length !== 1 ? "s" : ""} Found
            </p>
            {activeBrands.length > 0 && (
              <div className="flex flex-wrap items-center justify-start gap-1.5 sm:justify-end">
                <span className="mr-1 text-[10px] font-black uppercase tracking-[0.32em] text-slate-400">Active Filters:</span>
                {activeBrands.map(brand => (
                  <button key={brand.id} onClick={() => onToggleBrand(brand.id)}
                    className="inline-flex h-5 items-center gap-1 rounded-md border border-primary/15 bg-white px-2 text-[8px] font-black uppercase tracking-[0.14em] text-primary shadow-sm transition-colors hover:border-primary/35 hover:bg-primary/5 dark:bg-white dark:text-primary"
                    aria-label={`Remove ${brand.name} filter`}
                  >
                    {brand.name}
                    <X size={9} strokeWidth={3} className="shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No products matched</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => {
                const added = inTemp(product.id);
                const collectionFull = tempCollection.length >= 10 && !added;
                const productCategory = product.category.replace(/\s+/g, "_").toUpperCase();
                return (
                  <div key={product.id} className={cx("group rounded-[22px] bg-[#f3f4f6] border p-5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 dark:bg-card flex flex-col",
                    added
                      ? "border-white/70 shadow-lg shadow-slate-900/10 dark:border-border"
                      : "border-white/70 dark:border-border dark:hover:border-primary/30"
                  )}>
                    <div className="relative aspect-[1.02] overflow-hidden rounded-2xl bg-muted border border-white shadow-sm shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-sm" />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-slate-950/30">
                        <div className="w-[86%] rounded-xl bg-white/70 p-2.5 shadow-2xl shadow-slate-900/15 backdrop-blur-md dark:bg-white/75">
                          <button onClick={() => onAnalyze(product)} className="w-full h-10 rounded-lg bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.12em] hover:bg-slate-800 transition-colors">
                            Analyze Now
                          </button>
                          <button
                            onClick={() => added ? onRemoveFromCollection(product.id) : onAddToCollection(product)}
                            disabled={collectionFull}
                            title={collectionFull ? "Collection full (max 10)" : undefined}
                            className={cx("mt-2 w-full h-10 rounded-lg text-[11px] font-black uppercase tracking-[0.12em] transition-colors flex items-center justify-center gap-2",
                              added
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : collectionFull
                                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                  : "bg-primary text-white hover:bg-primary/90"
                            )}
                          >
                            {added ? <><Check size={14} /><span>Added</span></> : <><Bookmark size={14} /><span>Add to Collection</span></>}
                          </button>
                          <button onClick={() => onAnalyze(product)} className="mt-2 w-full h-10 rounded-lg text-[11px] font-black uppercase tracking-[0.12em] text-slate-900 hover:bg-white/70 transition-colors flex items-center justify-center gap-2">
                            <Link size={13} /> View Product
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="pt-5 flex flex-col flex-1">
                      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-primary mb-2">{productCategory}</div>
                      <div className="font-black text-foreground uppercase leading-tight text-sm flex-1">{product.name}</div>
                      <div className="mt-5 flex items-end justify-between gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/80">{product.brand}</span>
                        <ConfidenceBadge reviews={product.reviews} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      </div>
      </div>
    </div>
  );
}
