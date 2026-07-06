import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Trash2, ShoppingBag, Save, X, Package, User, Calendar, Layers, TrendingUp, Plus } from "lucide-react";
import { PRODUCTS } from "@/data/mockData";
import { Btn } from "@/app/components/Btn";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { cx } from "@/app/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { deleteSavedCollectionAction } from "@/app/store/actions/collectionActions";
import type { Product, SavedCollection } from "@/app/types";

export function CollectionPage({ onRemoveFromCollection, onSave, onCompare, onAggregate, onAnalyze }: {
  onRemoveFromCollection: (id: number) => void;
  onSave: (name: string) => void;
  onCompare: (products: Product[]) => void;
  onAggregate: (products: Product[]) => void;
  onAnalyze: (product: Product) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tempCollection   = useAppSelector(s => s.collection.tempCollection);
  const savedCollections = useAppSelector(s => s.collection.savedCollections);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<SavedCollection | null>(null);
  const [colName, setColName] = useState("");

  const confirmSave = () => {
    if (!colName.trim()) return;
    onSave(colName.trim());
    setColName("");
    setShowSaveModal(false);
  };

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6">
        <h1 className="font-black text-foreground uppercase tracking-tight text-[28px] sm:text-[36px] lg:text-[44px]">My Collections</h1>
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
      {/* Current temp collection */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
          <div>
            <h2 className="font-semibold text-foreground">Current Collection</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{tempCollection.length} product{tempCollection.length !== 1 ? "s" : ""} · Unsaved</p>
          </div>
          {tempCollection.length >= 2 && (
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => onCompare(tempCollection)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"><Layers size={13} /> Compare</button>
              <button onClick={() => onAggregate(tempCollection)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"><TrendingUp size={13} /> Aggregate</button>
              <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"><Save size={13} /> Save Collection</button>
            </div>
          )}
          {tempCollection.length === 1 && <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all"><Save size={13} /> Save Collection</button>}
        </div>

        {tempCollection.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <ShoppingBag size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Your collection is empty</p>
            <p className="text-xs mt-1 opacity-70">Go to Search, select brands or search, then click "Add" on products</p>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tempCollection.map(product => (
              <div key={product.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md group">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary mb-1 truncate">{product.category}</div>
                    <div className="text-sm font-black text-foreground uppercase leading-tight mb-2 truncate">{product.name}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</div>
                  </div>
                  <button
                    onClick={() => onRemoveFromCollection(product.id)}
                    className="w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-all shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <button
                  onClick={() => onAnalyze(product)}
                  className="mt-5 w-full rounded-xl bg-muted px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-foreground hover:bg-primary hover:text-white transition-all"
                >
                  View Analysis
                </button>
              </div>
            ))}
            <button
              onClick={() => navigate("/product-catalog")}
              className="min-h-[174px] rounded-2xl border border-dashed border-transparent bg-transparent p-5 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-card/40 transition-all flex flex-col items-center justify-center gap-5"
            >
              <span className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center">
                <Plus size={20} />
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.28em]">Add More Products</span>
            </button>
          </div>
        )}
        {tempCollection.length === 1 && (
          <div className="px-5 pb-4 text-xs text-muted-foreground">Add at least 2 products to enable Compare and Aggregate</div>
        )}
      </div>

      {/* Saved collections */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
          <div>
            <h2 className="font-semibold text-foreground">Saved Collections</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{savedCollections.length} saved collection{savedCollections.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        {savedCollections.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Layers size={28} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">No saved collections yet</p>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {savedCollections.map(col => {
              const colProducts = PRODUCTS.filter(p => col.productIds.includes(p.id));
              return (
                <div key={col.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md group">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 text-sm truncate">{col.name}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Package size={10} /> {col.productIds.length} products</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {col.created}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCollectionToDelete(col)}
                      className="w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-all shrink-0"
                      aria-label={`Delete ${col.name}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {colProducts.length > 0 && (
                    <div className="flex -space-x-2 mb-4">
                      {colProducts.slice(0, 5).map(p => (
                        <div key={p.id} className="w-8 h-8 rounded-full border-2 border-card overflow-hidden bg-muted">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {colProducts.length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-card bg-primary/15 flex items-center justify-center">
                          <span className="text-xs font-mono text-primary">+{colProducts.length - 5}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-1.5 pt-3 border-t border-border">
                    <button
                      onClick={() => colProducts.length >= 2 && onCompare(colProducts)}
                      disabled={colProducts.length < 2}
                      className={cx("flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all",
                        colProducts.length >= 2 ? "border-border text-foreground hover:border-primary hover:text-primary" : "border-border text-muted-foreground/40 cursor-not-allowed"
                      )}
                    >
                      <Layers size={11} /> Compare
                    </button>
                    <button
                      onClick={() => colProducts.length >= 2 && onAggregate(colProducts)}
                      disabled={colProducts.length < 2}
                      className={cx("flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all",
                        colProducts.length >= 2 ? "border-border text-foreground hover:border-primary hover:text-primary" : "border-border text-muted-foreground/40 cursor-not-allowed"
                      )}
                    >
                      <TrendingUp size={11} /> Aggregate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">Save Collection</h3>
              <button onClick={() => setShowSaveModal(false)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"><X size={15} /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{tempCollection.length} products will be saved</p>
            <div className="mb-5">
              <label className="text-sm font-medium text-foreground block mb-1.5">Collection Name</label>
              <input
                autoFocus value={colName} onChange={e => setColName(e.target.value)} onKeyDown={e => e.key === "Enter" && confirmSave()}
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
                placeholder="e.g. Q3 Competitor Analysis"
              />
            </div>
            <div className="flex gap-3">
              <Btn variant="secondary" className="flex-1 justify-center" onClick={() => { setShowSaveModal(false); setColName(""); }}>Cancel</Btn>
              <Btn className="flex-1 justify-center" disabled={!colName.trim()} onClick={confirmSave}>Save</Btn>
            </div>
          </div>
        </div>
      )}
      {collectionToDelete && (
        <ConfirmDialog
          title="Delete collection?"
          message={`This will permanently remove "${collectionToDelete.name}" from your saved collections.`}
          confirmLabel="Delete"
          tone="danger"
          onCancel={() => setCollectionToDelete(null)}
          onConfirm={() => {
            dispatch(deleteSavedCollectionAction(collectionToDelete.id));
            setCollectionToDelete(null);
          }}
        />
      )}
      </div>
    </div>
  );
}
