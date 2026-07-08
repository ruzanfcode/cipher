import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Calendar, Layers, LogOut, Package, Share2, Trash2, TrendingUp, Unlink2, X } from "lucide-react";
import { PRODUCTS, USER_PROFILES } from "@/data/mockData";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { ShareCollectionModal } from "@/app/components/ShareCollectionModal";
import { cx } from "@/app/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { deleteSavedCollectionAction, removeProductFromSavedCollectionAction, shareSavedCollectionAction, stopSharingSavedCollectionAction } from "@/app/store/actions/collectionActions";
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
      <span className="pointer-events-none absolute bottom-full left-1/2 z-[9999] mb-2 max-w-[280px] -translate-x-1/2 scale-95 rounded-lg border border-emerald-800 bg-emerald-950 px-3 py-2 text-xs font-semibold normal-case tracking-normal text-white opacity-0 shadow-xl shadow-emerald-950/20 transition-all group-hover/recipients:scale-100 group-hover/recipients:opacity-100">
        Shared with {recipientLabel}
      </span>
    </div>
  );
}

function IconButtonTooltip({ label, tone = "default" }: { label: string; tone?: "default" | "danger" }) {
  return (
    <span className={cx(
      "pointer-events-none absolute bottom-full left-1/2 z-[9999] mb-2 max-w-[240px] -translate-x-1/2 scale-95 whitespace-nowrap rounded-lg border px-3 py-2 text-[11px] font-semibold normal-case tracking-normal opacity-0 shadow-xl transition-all group-hover/icon:scale-100 group-hover/icon:opacity-100 group-focus-visible/icon:scale-100 group-focus-visible/icon:opacity-100",
      tone === "danger"
        ? "border-rose-800 bg-rose-950 text-white shadow-rose-950/20"
        : "border-slate-700 bg-slate-950 text-white shadow-slate-950/20"
    )}>
      {label}
    </span>
  );
}

export function CollectionPage({ onCompare, onAggregate, onAnalyze }: {
  onCompare: (products: Product[]) => void;
  onAggregate: (products: Product[]) => void;
  onAnalyze: (product: Product) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAppSelector(s => s.auth.role);
  const savedCollections = useAppSelector(s => s.collection.savedCollections);

  const [collectionToDelete, setCollectionToDelete] = useState<SavedCollection | null>(null);
  const [collectionToStopSharing, setCollectionToStopSharing] = useState<SavedCollection | null>(null);
  const [productToRemove, setProductToRemove] = useState<{ collection: SavedCollection; product: Product } | null>(null);
  const [collectionToShare, setCollectionToShare] = useState<SavedCollection | null>(null);
  const [shareRecipients, setShareRecipients] = useState("");
  const [openCollectionId, setOpenCollectionId] = useState<number | null>(null);
  const [isDetailClosing, setIsDetailClosing] = useState(false);

  const currentOwner = role ? USER_PROFILES[role].name : "";
  const visibleCollections = savedCollections.filter(collection => collection.owner === currentOwner);
  const openCollection = visibleCollections.find(collection => collection.id === openCollectionId) ?? null;
  const openProducts = openCollection ? PRODUCTS.filter(product => openCollection.productIds.includes(product.id)) : [];
  const openSharedRecipients = openCollection ? savedCollections.filter(collection => collection.sharedFromId === openCollection.id) : [];
  const showAllCollectionsSignal = (location.state as { showAllCollections?: number } | null)?.showAllCollections;

  useEffect(() => {
    if (!showAllCollectionsSignal) return;
    setOpenCollectionId(null);
    setIsDetailClosing(false);
  }, [showAllCollectionsSignal]);

  const openShareModal = (collection: SavedCollection) => {
    const existingRecipients = savedCollections
      .filter(savedCollection => savedCollection.sharedFromId === collection.id)
      .map(savedCollection => savedCollection.sharedWith || savedCollection.owner)
      .join(", ");
    setCollectionToShare(collection);
    setShareRecipients(existingRecipients);
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
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="overflow-visible rounded-2xl border border-border bg-card">
      {openCollection && (
        <div className={cx(
          "relative origin-bottom overflow-visible border-b border-primary/15 bg-card shadow-[inset_0_-12px_18px_-22px_rgba(15,23,42,0.32)]",
          isDetailClosing
            ? "animate-out fade-out slide-out-to-bottom-6 zoom-out-[0.98] duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            : "animate-in fade-in slide-in-from-bottom-6 zoom-in-95 duration-300 ease-out"
        )}>
          <button onClick={closeCollectionDetails} className="group/icon absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Close collection details">
            <X size={17} strokeWidth={2.5} />
            <IconButtonTooltip label="Close details" />
          </button>
          <div className="flex flex-col gap-3 border-b border-border p-4 pr-14 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black uppercase tracking-tight text-foreground sm:text-2xl">{openCollection.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {openProducts.length} product{openProducts.length !== 1 ? "s" : ""} · Created {openCollection.created} · {openCollection.sharedBy ? `Shared with me by ${openCollection.sharedBy}` : `Owner: ${currentOwner}`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {!openCollection.sharedBy && openSharedRecipients.length > 0 && (
                    <div className="shrink-0 px-3 py-1.5">
                      <SharedRecipientAvatars recipients={openSharedRecipients} />
                    </div>
                  )}
                  {!openCollection.sharedBy && (
                    <button onClick={() => openShareModal(openCollection)} className="group/icon relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/40 hover:text-primary" aria-label={`Share ${openCollection.name}`}>
                      <Share2 size={14} />
                      <IconButtonTooltip label="Share collection" />
                    </button>
                  )}
                  {!openCollection.sharedBy && openSharedRecipients.length > 0 && (
                    <button onClick={() => setCollectionToStopSharing(openCollection)} className="group/icon relative flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition-all hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50" aria-label={`Stop sharing ${openCollection.name}`}>
                      <Unlink2 size={14} className="transition-transform group-hover/icon:-rotate-12" />
                      <IconButtonTooltip label="Stop sharing collection" tone="danger" />
                    </button>
                  )}
                <button
                  onClick={() => openProducts.length >= 2 && onCompare(openProducts)}
                  disabled={openProducts.length < 2}
                  className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-all", openProducts.length >= 2 ? "border-border text-foreground hover:border-primary hover:text-primary" : "border-border text-muted-foreground/40 cursor-not-allowed")}
                >
                  <Layers size={13} /> COMPARE
                </button>
                <button
                  onClick={() => openProducts.length >= 2 && onAggregate(openProducts)}
                  disabled={openProducts.length < 2}
                  className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-all", openProducts.length >= 2 ? "border-border text-foreground hover:border-primary hover:text-primary" : "border-border text-muted-foreground/40 cursor-not-allowed")}
                >
                  <TrendingUp size={13} /> AGGREGATE
                </button>
              </div>
            </div>

          <div>
              {openProducts.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <Package size={30} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No products in this collection yet</p>
                  <button onClick={() => navigate("/product-catalog")} className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary/90">Add Products</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
                  {openProducts.map(product => (
                    <div key={product.id} className="relative z-0 overflow-visible rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:z-40 hover:border-primary/30 hover:shadow-md focus-within:z-40">
                      {!openCollection.sharedBy && (
                        <button
                          onClick={() => setProductToRemove({ collection: openCollection, product })}
                          className="group/icon absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-sm transition-all hover:border-red-300 hover:text-red-500"
                          aria-label={`Remove ${product.name} from ${openCollection.name}`}
                        >
                          <X size={12} strokeWidth={3} />
                          <IconButtonTooltip label="Remove from collection" tone="danger" />
                        </button>
                      )}
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
        </div>
      )}

      {/* Saved collections */}
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
                    "group relative z-0 flex h-full flex-col overflow-visible rounded-2xl border p-5 text-left shadow-sm transition-all duration-300 hover:z-40 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 focus-within:z-40",
                    isSharedCollection
                      ? "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 shadow-sky-900/5 hover:border-sky-300 dark:border-sky-900/60 dark:from-sky-950/45 dark:via-card dark:to-cyan-950/35 dark:hover:border-sky-700"
                      : hasSharedRecipients
                        ? "border-border bg-background hover:border-primary/30"
                        : "border-border bg-background hover:border-primary/30",
                    openCollectionId === col.id && "border-primary/40 ring-2 ring-primary/10"
                  )}
                >
                  <div className="relative mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{col.name}</h3>
                      </div>
                      <div className="space-y-1 text-xs leading-tight text-muted-foreground">
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          <span className="flex items-center gap-1"><Package size={10} /> {col.productIds.length} products</span>
                          <span className="flex items-center gap-1"><Calendar size={10} /> {col.created}</span>
                        </div>
                        <div>
                          <span>Owner: </span><span className={cx(isSharedCollection && "font-semibold text-sky-700 dark:text-sky-300")}>{ownerName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {!isSharedCollection && hasSharedRecipients && <SharedRecipientAvatars recipients={sharedRecipients} />}
                      {!isSharedCollection && hasSharedRecipients && (
                        <button
                          onClick={event => { event.stopPropagation(); setCollectionToStopSharing(col); }}
                          className="group/icon relative flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-all hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
                          aria-label={`Stop sharing ${col.name}`}
                        >
                          <Unlink2 size={12} />
                          <IconButtonTooltip label="Stop sharing collection" tone="danger" />
                        </button>
                      )}
                      {!isSharedCollection && (
                        <button
                          onClick={event => { event.stopPropagation(); openShareModal(col); }}
                          className="group/icon relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                          aria-label={`Share ${col.name}`}
                        >
                          <Share2 size={12} />
                          <IconButtonTooltip label="Share collection" />
                        </button>
                      )}
                      <button
                        onClick={event => { event.stopPropagation(); setCollectionToDelete(col); }}
                        className={cx(
                          "group/icon relative w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center text-muted-foreground transition-all",
                          isSharedCollection ? "hover:border-border hover:text-foreground" : "hover:text-red-500 hover:border-red-300"
                        )}
                        aria-label={isSharedCollection ? `Leave ${col.name}` : `Delete ${col.name}`}
                      >
                        {isSharedCollection ? <LogOut size={12} /> : <Trash2 size={12} />}
                        <IconButtonTooltip label={isSharedCollection ? "Leave from shared collection" : "Delete collection"} tone={isSharedCollection ? "default" : "danger"} />
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
                  <div className="relative mt-auto flex gap-1.5 pt-3 border-t border-border">
                    <button
                      onClick={() => colProducts.length >= 2 && onCompare(colProducts)}
                      disabled={colProducts.length < 2}
                      className={cx("flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all",
                        colProducts.length >= 2 ? "border-border text-foreground hover:border-primary hover:text-primary" : "border-border text-muted-foreground/40 cursor-not-allowed"
                      )}
                    >
                      <Layers size={11} /> COMPARE
                    </button>
                    <button
                      onClick={() => colProducts.length >= 2 && onAggregate(colProducts)}
                      disabled={colProducts.length < 2}
                      className={cx("flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all",
                        colProducts.length >= 2 ? "border-border text-foreground hover:border-primary hover:text-primary" : "border-border text-muted-foreground/40 cursor-not-allowed"
                      )}
                    >
                      <TrendingUp size={11} /> AGGREGATE
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
      {collectionToStopSharing && (
        <ConfirmDialog
          title="Stop sharing this collection?"
          message={`This will pull "${collectionToStopSharing.name}" back from everyone you shared it with. Your original collection stays intact.`}
          confirmLabel="Stop Sharing"
          tone="warning"
          onCancel={() => setCollectionToStopSharing(null)}
          onConfirm={() => {
            dispatch(stopSharingSavedCollectionAction(collectionToStopSharing));
            setCollectionToStopSharing(null);
          }}
        />
      )}
      {productToRemove && (
        <ConfirmDialog
          title="Remove product from collection?"
          message={`Remove "${productToRemove.product.name}" from "${productToRemove.collection.name}"? Shared copies of this collection will be updated too.`}
          confirmLabel="Remove Product"
          tone="danger"
          onCancel={() => setProductToRemove(null)}
          onConfirm={() => {
            dispatch(removeProductFromSavedCollectionAction(productToRemove.collection, productToRemove.product));
            setProductToRemove(null);
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
