import { Check, Folder, FolderPlus, Trash2, X } from "lucide-react";
import { cx } from "@/app/lib/utils";
import type { Product, SavedCollection } from "@/app/types";

export const MAX_USER_COLLECTIONS = 10;

function normalizeCollectionName(name: string) {
  return name.trim().toLowerCase();
}

export function AddToCollectionModal({
  product,
  collections,
  selectedIds,
  newCollectionName,
  canSave,
  onCollectionNameChange,
  onToggleCollection,
  onRemoveCollection,
  onCreateCollection,
  onSave,
  onClose,
}: {
  product: Product;
  collections: SavedCollection[];
  selectedIds: number[];
  newCollectionName: string;
  canSave: boolean;
  onCollectionNameChange: (name: string) => void;
  onToggleCollection: (id: number) => void;
  onRemoveCollection: (collection: SavedCollection) => void;
  onCreateCollection: () => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const trimmedCollectionName = newCollectionName.trim();
  const reachedCollectionLimit = collections.length >= MAX_USER_COLLECTIONS;
  const hasDuplicateName = collections.some(collection => normalizeCollectionName(collection.name) === normalizeCollectionName(trimmedCollectionName));
  const canCreateCollection = Boolean(trimmedCollectionName) && !reachedCollectionLimit && !hasDuplicateName;
  const canSaveExistingAssignment = canSave;
  const canSaveChanges = canSaveExistingAssignment || canCreateCollection;

  const handleCreateCollection = () => {
    if (!canCreateCollection) return;
    onCreateCollection();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="flex min-h-[640px] w-full max-w-xl flex-col rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground">Add to a Collection</h3>
            <p className="mt-1 text-xs text-muted-foreground">Assign {product.name} to one or more collections</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Close collection modal">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-6 py-5">
          {collections.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-5 py-8 text-center">
              <Folder size={30} className="mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">You don't have any collections</p>
              <p className="mt-1 text-xs text-muted-foreground">Create a collection first, then this product can be assigned to it.</p>
            </div>
          ) : (
            <div className="grid flex-1 content-start grid-cols-1 gap-2 sm:grid-cols-2">
              {collections.map(collection => {
                const checked = selectedIds.includes(collection.id);
                return (
                  <div key={collection.id} className={cx(
                    "group flex min-h-[58px] cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all",
                    checked ? "border-primary/45 bg-primary/5 shadow-sm shadow-primary/10" : "border-border bg-background hover:border-primary/25 hover:bg-accent/40"
                  )}>
                    <button type="button" onClick={() => onToggleCollection(collection.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <span className={cx(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all",
                        checked ? "border-primary bg-primary text-white" : "border-border bg-card text-muted-foreground group-hover:border-primary/30"
                      )}>
                        {checked ? <Check size={14} /> : <Folder size={14} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold text-foreground">{collection.name}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{collection.productIds.length} product{collection.productIds.length !== 1 ? "s" : ""}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveCollection(collection)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted-foreground opacity-70 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      aria-label={`Remove ${collection.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-auto rounded-2xl border border-border bg-background p-3.5">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-foreground">Create Collection</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{collections.length}/{MAX_USER_COLLECTIONS} collections used</p>
              </div>
              {reachedCollectionLimit && <span className="text-[10px] font-black uppercase tracking-[0.12em] text-red-500">Limit reached</span>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={newCollectionName}
                onChange={event => onCollectionNameChange(event.target.value)}
                onKeyDown={event => event.key === "Enter" && handleCreateCollection()}
                disabled={reachedCollectionLimit}
                placeholder="Collection name"
                aria-invalid={hasDuplicateName}
                className={cx(
                  "h-9 flex-1 rounded-xl border bg-card px-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60",
                  hasDuplicateName ? "border-red-300 focus:border-red-400" : "border-border focus:border-primary"
                )}
              />
              <button
                onClick={handleCreateCollection}
                disabled={!canCreateCollection}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[11px] font-black uppercase tracking-[0.12em] text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                <FolderPlus size={14} /> Create
              </button>
            </div>
            {hasDuplicateName && <p className="mt-2 text-xs font-semibold text-red-500">Collection name already exists for this user.</p>}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="h-10 rounded-xl border border-border px-4 text-xs font-bold text-foreground transition-colors hover:bg-accent">Cancel</button>
          <button onClick={onSave} disabled={!canSaveChanges} className="h-10 rounded-xl bg-primary px-5 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}