import { useState } from "react";
import { Share2, Users, X } from "lucide-react";
import { cx } from "@/app/lib/utils";
import type { SavedCollection } from "@/app/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

function parseRecipients(value: string) {
  return value.split(/[\n,]+/).map(item => item.trim()).filter(Boolean);
}

function uniqueRecipients(recipients: string[]) {
  const unique = new Map<string, string>();
  recipients.forEach(recipient => unique.set(recipient.toLowerCase(), recipient));
  return [...unique.values()];
}

export function ShareCollectionModal({
  collection,
  recipients,
  onRecipientsChange,
  onShare,
  onClose,
}: {
  collection: SavedCollection;
  recipients: string;
  onRecipientsChange: (value: string) => void;
  onShare: (recipients: string) => void;
  onClose: () => void;
}) {
  const [recipientDraft, setRecipientDraft] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const recipientList = uniqueRecipients(parseRecipients(recipients));
  const recipientCount = recipientList.length;
  const invalidRecipients = recipientList.filter(recipient => !isValidEmail(recipient));
  const hasInvalidRecipients = invalidRecipients.length > 0;

  const updateRecipients = (nextRecipients: string[]) => {
    onRecipientsChange(uniqueRecipients(nextRecipients).join(", "));
  };

  const commitDraft = () => {
    const draftRecipients = parseRecipients(recipientDraft);
    if (draftRecipients.length === 0) return recipientList;
    const invalidDraftRecipients = draftRecipients.filter(recipient => !isValidEmail(recipient));
    if (invalidDraftRecipients.length > 0) {
      setRecipientError(`Enter a valid email address${invalidDraftRecipients.length > 1 ? "es" : ""}.`);
      return recipientList;
    }
    const nextRecipients = uniqueRecipients([...recipientList, ...draftRecipients]);
    updateRecipients(nextRecipients);
    setRecipientDraft("");
    setRecipientError("");
    return nextRecipients;
  };

  const removeRecipient = (recipient: string) => {
    updateRecipients(recipientList.filter(item => item !== recipient));
    if (recipientError) setRecipientError("");
  };

  const handleShare = () => {
    const nextRecipients = commitDraft();
    if (nextRecipients.length === 0) return;
    const invalidNextRecipients = nextRecipients.filter(recipient => !isValidEmail(recipient));
    if (invalidNextRecipients.length > 0) {
      setRecipientError("Remove invalid email addresses before sharing.");
      return;
    }
    onShare(nextRecipients.join(", "));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Share2 size={17} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black uppercase tracking-[0.18em] text-foreground">Share Collection</h3>
              <p className="mt-1 truncate text-xs text-muted-foreground">{collection.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Close share modal">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <label className="text-xs font-black uppercase tracking-[0.16em] text-foreground">Users</label>
          <div className={cx("mt-2 flex min-h-28 w-full flex-wrap content-start gap-2 rounded-2xl border bg-background px-3 py-3 transition-all", recipientError || hasInvalidRecipients ? "border-red-400 focus-within:border-red-400" : "border-border focus-within:border-primary")}>
            {recipientList.map(recipient => (
              <span key={recipient} className={cx("group relative inline-flex h-8 max-w-full items-center gap-2 rounded-full border pl-3 pr-1.5 text-xs font-bold", isValidEmail(recipient) ? "border-primary/20 bg-primary/10 text-primary" : "border-red-300 bg-red-50 text-red-600")}>
                <span className="max-w-[220px] truncate">{recipient}</span>
                <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 max-w-[280px] -translate-x-1/2 scale-95 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold normal-case tracking-normal text-white opacity-0 shadow-xl shadow-slate-950/20 transition-all group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100">
                  {recipient}
                </span>
                <button
                  type="button"
                  onClick={() => removeRecipient(recipient)}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-primary/70 transition-colors hover:bg-primary/15 hover:text-primary"
                  aria-label={`Remove ${recipient}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              value={recipientDraft}
              onChange={event => { setRecipientDraft(event.target.value); if (recipientError) setRecipientError(""); }}
              onKeyDown={event => {
                if (["Enter", ",", "Tab"].includes(event.key)) {
                  event.preventDefault();
                  commitDraft();
                }
                if (event.key === "Backspace" && !recipientDraft && recipientList.length > 0) {
                  removeRecipient(recipientList[recipientList.length - 1]);
                }
              }}
              onBlur={commitDraft}
              onPaste={event => {
                const pastedText = event.clipboardData.getData("text");
                if (!/[\n,]/.test(pastedText)) return;
                event.preventDefault();
                const pastedRecipients = parseRecipients(pastedText);
                const invalidPastedRecipients = pastedRecipients.filter(recipient => !isValidEmail(recipient));
                if (invalidPastedRecipients.length > 0) {
                  setRecipientError("Pasted list contains invalid email addresses.");
                  return;
                }
                updateRecipients([...recipientList, ...pastedRecipients]);
                setRecipientError("");
              }}
              autoFocus
              placeholder={recipientList.length === 0 ? "Add users by email" : "Add another"}
              className="h-8 min-w-[180px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          {(recipientError || hasInvalidRecipients) && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {recipientError || "Remove invalid email addresses before sharing."}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Users size={14} />
              <span>{recipientCount} recipient{recipientCount !== 1 ? "s" : ""}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">Shared copy</span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="h-10 rounded-xl border border-border px-4 text-xs font-bold text-foreground transition-colors hover:bg-accent">Cancel</button>
          <button
            onClick={handleShare}
            disabled={(recipientCount === 0 && !recipientDraft.trim()) || hasInvalidRecipients}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}