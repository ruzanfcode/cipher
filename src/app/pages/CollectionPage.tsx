import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, Layers, LogOut, Package, Share2, Trash2, TrendingUp, Users } from "lucide-react";
import { PRODUCTS, USER_PROFILES } from "@/data/mockData";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { ShareCollectionModal } from "@/app/components/ShareCollectionModal";
import { cx } from "@/app/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { deleteSavedCollectionAction, shareSavedCollectionAction } from "@/app/store/actions/collectionActions";
import type { Product, SavedCollection } from "@/app/types";

function userInitials(nameOrEmail: string) {
  const name = nameOrEmail.includes("@") ? nameOrEmail.split("@")[0].replace(/[._-]+/g, " ") : nameOrEmail;
  const words = name.split(" ").map(word => word.trim()).filter(Boolean);
  if (words.length === 0) return "U";
  return words.slice(0, 2).map(word => word[0]).join("").toUpperCase();
}

function SharedRecipientAvatars({ recipients }: { recipients: SavedCollection[] }) {
  if (recipients.length === 0) return null;
  const visibleRecipients = recipients.slice(0, 4);
  const hiddenCount = recipients.length - visibleRecipients.length;
  const recipientLabel = recipients.map(recipient => recipient.sharedWith || recipient.owner).join(", ");

  return (
    <div className="group/recipients relative flex items-center gap-2">
      <div className="flex -space-x-2">
        {visibleRecipients.map(recipient => (
          <span key={recipient.id} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-emerald-100 text-[10px] font-black text-emerald-700 shadow-sm">
            {userInitials(recipient.owner)}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-slate-100 text-[10px] font-black text-slate-600 shadow-sm">
            +{hiddenCount}
          </span>
        )}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">Shared</span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-[90] mb-2 max-w-[280px] -translate-x-1/2 scale-95 rounded-lg border border-emerald-800 bg-emerald-950 px-3 py-2 text-xs font-semibold normal-case tracking-normal text-white opacity-0 shadow-xl shadow-emerald-950/20 transition-all group-hover/recipients:scale-100 group-hover/recipients:opacity-100">
        Shared with {recipientLabel}
      </span>
    </div>
  );
}

export function CollectionPage({ onCompare, onAggregate, onAnalyze }: {
  onCompare: (products: Product[]) => void;
  onAggregate: (products: Product[]) => void;
  onAnalyze: (product: Product) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const role = useAppSelector(s => s.auth.role);
  const savedCollections = useAppSelector(s => s.collection.savedCollections);

  const [collectionToDelete, setCollectionToDelete] = useState<SavedCollection | null>(null);
  const [collectionToShare, setCollectionToShare] = useState<SavedCollection | null>(null);
  const [shareRecipients, setShareRecipients] = useState("");
  const [openCollectionId, setOpenCollectionId] = useState<number | null>(null);
  const [isDetailClosing, setIsDetailClosing] = useState(false);

  const currentOwner = role ? USER_PROFILES[role].name : "";
  const visibleCollections = savedCollections.filter(collection => collection.owner === currentOwner);
  const openCollection = visibleCollections.find(collection => collection.id === openCollectionId) ?? null;
  const openProducts = openCollection ? PRODUCTS.filter(product => openCollection.productIds.includes(product.id)) : [];
  const openSharedRecipients = openCollection ? savedCollections.filter(collection => collection.sharedFromId === openCollection.id) : [];

  const openShareModal = (collection: SavedCollection) => {
    setCollectionToShare(collection);
    setShareRecipients("");
  };

  const shareCollection = (recipients: string) => {
    if (!collectionToShare) return;
    dispatch(shareSavedCollectionAction(collectionToShare, [recipients], role));
    setCollectionToShare(null);
    setShareRecipients("");
  };

  const openCollectionDetails = (id: number) => {
    setIsDetailClosing(false);
    setOpenCollectionId(id);
  };

  const closeCollectionDetails = () => {
    setIsDetailClosing(true);
    window.setTimeout(() => {
      setOpenCollectionId(null);
      setIsDetailClosing(false);
    }, 420);
  };

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-4 sm:pb-6">
        <h1 className="font-black text-foreground uppercase tracking-tight text-[28px] sm:text-[36px] lg:text-[44px]">My Collections</h1>
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
      {openCollection && (
        <div className={cx(
          "origin-bottom overflow-visible rounded-2xl border bg-card shadow-xl shadow-slate-900/10",
          openCollection.sharedBy ? "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50" :
          openSharedRecipients.length > 0 ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50" : "border-border",
          isDetailClosing
            ? "animate-out fade-out slide-out-to-bottom-6 zoom-out-[0.98] duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            : "animate-in fade-in slide-in-from-bottom-6 zoom-in-95 duration-300 ease-out"
        )}>
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <button onClick={closeCollectionDetails} className="mt-1 rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary" aria-label="Close collection details">
                <ArrowLeft size={14} />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black uppercase tracking-tight text-foreground">{openCollection.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{openProducts.length} product{openProducts.length !== 1 ? "s" : ""} · Created {openCollection.created}</p>
              </div>
            </div>
            <div className="flex flex-nowrap items-center gap-2 sm:justify-end">
                {openCollection.sharedBy && (
                  <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-3 text-[10px] font-black uppercase tracking-[0.14em] text-sky-700 shadow-sm"><Users size={11} /> Shared with me by {openCollection.sharedBy}</span>
                )}
                {!openCollection.sharedBy && openSharedRecipients.length > 0 && (
                  <div className="shrink-0 rounded-xl border border-emerald-200 bg-white/70 px-3 py-1.5 shadow-sm shadow-emerald-900/5">
                    <SharedRecipientAvatars recipients={openSharedRecipients} />
                  </div>
                )}
                {!openCollection.sharedBy && (
                  <button onClick={() => openShareModal(openCollection)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/40 hover:text-primary" aria-label={`Share ${openCollection.name}`}>
                    <Share2 size={14} />
                  </button>
                )}
              <button
                onClick={() => openProducts.length >= 2 && onCompare(openProducts)}
                disabled={openProducts.length < 2}
                className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-all", openProducts.length >= 2 ? "border-border text-foreground hover:border-primary hover:text-primary" : "border-border text-muted-foreground/40 cursor-not-allowed")}
              >
                <Layers size={13} /> Compare
              </button>
              <button
                onClick={() => openProducts.length >= 2 && onAggregate(openProducts)}
                disabled={openProducts.length < 2}
                className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-all", openProducts.length >= 2 ? "border-border text-foreground hover:border-primary hover:text-primary" : "border-border text-muted-foreground/40 cursor-not-allowed")}
              >
                <TrendingUp size={13} /> Aggregate
              </button>
            </div>
          </div>

          {openProducts.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Package size={30} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">No products in this collection yet</p>
              <button onClick={() => navigate("/product-catalog")} className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary/90">Add Products</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 p-5 sm:grid-cols-2 lg:grid-cols-4">
              {openProducts.map(product => (
                <div key={product.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 truncate text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{product.category}</div>
                      <div className="mb-2 truncate text-sm font-black uppercase leading-tight text-foreground">{product.name}</div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onAnalyze(product)}
                    className="mt-5 w-full rounded-xl bg-muted px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-foreground transition-all hover:bg-primary hover:text-white"
                  >
                    View Analysis
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved collections */}
      <div className="overflow-visible rounded-2xl border border-border bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
          <div>
            <h2 className="font-semibold text-foreground">Collections</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{visibleCollections.length} collection{visibleCollections.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        {visibleCollections.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Layers size={28} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">You don't have any collections.</p>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleCollections.map(col => {
              const colProducts = PRODUCTS.filter(p => col.productIds.includes(p.id));
              const isSharedCollection = Boolean(col.sharedBy);
              const ownerName = isSharedCollection ? col.sharedBy : currentOwner;
              const sharedRecipients = savedCollections.filter(collection => collection.sharedFromId === col.id);
              const hasSharedRecipients = sharedRecipients.length > 0;
              return (
                <button
                  key={col.id}
                  onClick={() => openCollectionDetails(col.id)}
                  className={cx(
                    "group relative flex h-full flex-col overflow-visible rounded-2xl border p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10",
                    isSharedCollection
                      ? "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 shadow-sky-900/5 before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-sky-500 hover:border-sky-300"
                      : hasSharedRecipients
                        ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-emerald-900/5 before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-emerald-500 hover:border-emerald-300"
                        : "border-border bg-background hover:border-primary/30",
                    openCollectionId === col.id && "border-primary/40 ring-2 ring-primary/10"
                  )}
                >
                  <div className="relative mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{col.name}</h3>
                        {isSharedCollection && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-sky-700 shadow-sm"><Users size={10} /> Shared with me</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs leading-tight text-muted-foreground">
                        <span className="flex items-center gap-1"><Package size={10} /> {col.productIds.length} products</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {col.created}</span>
                        <span className={cx("font-semibold", isSharedCollection ? "text-sky-700" : "text-foreground/70")}>Owner {ownerName}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {!isSharedCollection && hasSharedRecipients && <SharedRecipientAvatars recipients={sharedRecipients} />}
                      {!isSharedCollection && (
                        <button
                          onClick={event => { event.stopPropagation(); openShareModal(col); }}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                          aria-label={`Share ${col.name}`}
                        >
                          <Share2 size={12} />
                        </button>
                      )}
                      <button
                        onClick={event => { event.stopPropagation(); setCollectionToDelete(col); }}
                        className={cx(
                          "w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center text-muted-foreground transition-all",
                          isSharedCollection ? "hover:border-sky-300 hover:text-sky-700" : "hover:text-red-500 hover:border-red-300"
                        )}
                        aria-label={isSharedCollection ? `Leave ${col.name}` : `Delete ${col.name}`}
                      >
                        {isSharedCollection ? <LogOut size={12} /> : <Trash2 size={12} />}
                      </button>
                    </div>
                  </div>
                  {colProducts.length > 0 && (
                    <div className="relative mb-4 flex -space-x-2">
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
                  <div className={cx("relative mt-auto flex gap-1.5 pt-3 border-t", isSharedCollection ? "border-sky-100" : hasSharedRecipients ? "border-emerald-100" : "border-border")}>
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
                </button>
              );
            })}
          </div>
        )}
      </div>

      {collectionToDelete && (
        <ConfirmDialog
          title={collectionToDelete.sharedBy ? "Leave shared collection?" : "Delete collection?"}
          message={collectionToDelete.sharedBy
            ? `Are you sure you want to leave "${collectionToDelete.name}"? It will be removed from your collections, but ${collectionToDelete.sharedBy}'s original collection will not be deleted.`
            : `Are you sure you want to delete "${collectionToDelete.name}"? This will permanently remove it from your saved collections.`}
          confirmLabel={collectionToDelete.sharedBy ? "Leave Collection" : "Delete"}
          tone={collectionToDelete.sharedBy ? "warning" : "danger"}
          onCancel={() => setCollectionToDelete(null)}
          onConfirm={() => {
            dispatch(deleteSavedCollectionAction(collectionToDelete.id));
            if (openCollectionId === collectionToDelete.id) closeCollectionDetails();
            setCollectionToDelete(null);
          }}
        />
      )}
      {collectionToShare && (
        <ShareCollectionModal
          collection={collectionToShare}
          recipients={shareRecipients}
          onRecipientsChange={setShareRecipients}
          onShare={shareCollection}
          onClose={() => { setCollectionToShare(null); setShareRecipients(""); }}
        />
      )}
      </div>
    </div>
  );
}
