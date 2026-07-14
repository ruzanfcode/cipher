import { useEffect, useRef } from 'react';
import SentimentBadge from './SentimentBadge';

function ModalShell({ children, onClose, narrow = false, panelClass = '' }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-panel ${narrow ? 'modal-panel--narrow' : ''} ${panelClass}`} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function AddToCollectionModal({ app }) {
  if (!app.addOpen) return null;
  return (
    <ModalShell onClose={app.closeAdd}>
      <div className="modal-title"><h3>Add to Collection</h3><button type="button" onClick={app.closeAdd}>×</button></div>
      <div className="modal-subtitle">Saving <b>{app.addProduct.name}</b></div>
      {app.newColMode ? (
        <div className="new-collection-form">
          <div className="section-eyebrow left">New collection</div>
          <input value={app.newColName} onChange={app.onNewColName} placeholder="Collection name" />
          <input value={app.newColDesc} onChange={app.onNewColDesc} placeholder="Description (optional)" />
          <div><button className="secondary-button" type="button" onClick={app.cancelNewCol}>Cancel</button><button className="primary-button" type="button" onClick={app.createCollection}>Create</button></div>
        </div>
      ) : (
        <>
          {app.addEmpty ? <div className="empty-state"><p>You don't have any collections yet. Create your first research collection to save this product.</p><button className="primary-button" type="button" onClick={app.startNewCol}>Create Collection</button></div> : null}
          {app.addHasCols ? (
            <>
              <input className="modal-search" value={app.addSearch} onChange={app.onAddSearch} placeholder="Search collections" />
              <div className="collection-picker">{app.addCols.map((collection) => <button type="button" key={collection.id} onClick={collection.onToggle}><span className={collection.checked ? 'box checked' : 'box'}>{collection.checked ? '✓' : ''}</span><span><b>{collection.name}</b><small>{collection.count}</small></span></button>)}</div>
              <button className="create-link" type="button" onClick={app.startNewCol}>+ Create new collection</button>
              <button className="primary-button full-button" type="button" onClick={app.confirmAdd}>{app.confirmLabel}</button>
            </>
          ) : null}
        </>
      )}
    </ModalShell>
  );
}

export function ShareAccessModal({ app }) {
  if (!app.shareOpen || !app.share) return null;
  const share = app.share;
  return (
    <ModalShell onClose={share.onClose} panelClass="share-panel">
      <div className="modal-title"><h3>Share access</h3><button type="button" onClick={share.onClose}>×</button></div>
      <div className="modal-subtitle">Invite people to <b>{share.colName}</b></div>
      <div className="share-input"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg><input value={share.input} onChange={share.onInput} onKeyDown={share.onKey} placeholder="Add people by name or email" /><button type="button" onClick={share.onAddTyped}>Add</button></div>
      {share.hasSuggestions ? <div className="suggestion-row">{share.suggestions.map((item) => <button type="button" key={item.name} onClick={item.onAdd}><span className="avatar" style={{ background: item.color }}>{item.initials}</span>{item.name}<b>+</b></button>)}</div> : null}
      {share.hasPending ? <div className="pending-box"><div className="section-eyebrow left">About to invite</div>{share.pending.map((item) => <span key={item.name}><span className="avatar" style={{ background: item.color }}>{item.initials}</span>{item.name}<button type="button" onClick={item.onRemove}>×</button></span>)}</div> : null}
      <button className="primary-button full-button" type="button" onClick={share.onShare}>{share.shareLabel}</button>
      {share.sent ? <div className="sent-box"><div><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M20 6 9 17l-5-5" /></svg><b>Invitations emailed</b></div><p>They now have access. To be sure they land in the right place, you can also send them the direct link:</p><button type="button" onClick={share.onCopy}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.43" /><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.33-1.33" /></svg>{share.copyLabel}</button></div> : null}
      <div className="section-eyebrow left access-title">People with access · {share.accessCount}</div>
      <div className="access-list">{share.current.map((item) => <div key={item.email}><span className="avatar" style={{ background: item.color }}>{item.initials}</span><span><b>{item.name}</b><small>{item.email}</small></span>{item.removable ? <button type="button" onClick={item.onRemove}>Remove</button> : <small>{item.role}</small>}</div>)}</div>
    </ModalShell>
  );
}

export function ConfirmDialog({ app }) {
  if (!app.confirmOpen) return null;
  return (
    <ModalShell onClose={app.closeConfirm} panelClass="confirm-panel">
      <div className="danger-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></svg></div>
      <h3 className="confirm-title">{app.confirm.title}</h3>
      <p className="confirm-message">{app.confirm.message}</p>
      <div className="confirm-actions"><button className="secondary-button" type="button" onClick={app.closeConfirm}>Cancel</button><button className="danger-button" type="button" onClick={app.doConfirm}>{app.confirm.confirmLabel}</button></div>
    </ModalShell>
  );
}

export function AiChatOverlay({ app }) {
  const chat = app.aiChat;
  const inputRef = useRef(null);

  useEffect(() => {
    if (app.aiChatOpen) inputRef.current?.focus();
  }, [app.aiChatOpen, chat?.focusKey]);

  if (!app.aiChatOpen || !chat) return null;

  return (
    <aside className={`ai-chat-panel${chat.minimized ? ' ai-chat-panel--minimized' : ''}`} aria-label={`Ask AI about ${chat.title}`}>
      <header className="ai-chat-panel__head" onClick={chat.onToggleMinimize} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chat.onToggleMinimize(); } }} aria-label={`${chat.minimized ? 'Open' : 'Minimize'} chat`}>
        <h3>{chat.title}</h3>
        <div className="ai-chat-panel__tools">
          {chat.minimized ? <button type="button" onClick={(event) => { event.stopPropagation(); chat.onRestore(); }} aria-label="Open chat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M5 12h14" /><path d="M12 5v14" /></svg></button> : <button type="button" onClick={(event) => { event.stopPropagation(); chat.onMinimize(); }} aria-label="Minimize chat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M5 12h14" /></svg></button>}
          <button type="button" onClick={(event) => { event.stopPropagation(); chat.onClose(); }} aria-label="Close chat">×</button>
        </div>
      </header>
      {!chat.minimized ? <>
        <div className="ai-chat-panel__messages">
          {chat.messages.map((message, index) => <p className={`ai-chat-bubble ai-chat-bubble--${message.role}`} key={`${message.role}-${index}`}>{message.text}</p>)}
        </div>
        <form className="ai-chat-panel__composer" onSubmit={chat.onSubmit}>
          <input ref={inputRef} value={chat.input} onChange={chat.onInput} placeholder={chat.placeholder} />
          <button type="submit" disabled={!chat.input.trim()} aria-label="Send message"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7Z" /></svg></button>
        </form>
      </> : null}
    </aside>
  );
}

export function EvidenceDrawer({ app }) {
  if (!app.drawerOpen || !app.drawer) return null;
  const drawer = app.drawer;
  return (
    <div className="drawer-backdrop" onClick={app.closeDrawer}>
      <aside className="evidence-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head"><span>Evidence</span><button type="button" onClick={app.closeDrawer}>×</button></div>
        <div className="eyebrow left">{drawer.brand}</div>
        <h3>{drawer.product}</h3>
        <div className="drawer-state"><b>{drawer.attr}</b><SentimentBadge label={drawer.stateLabel} fg={drawer.fg} bg={drawer.bg} /></div>
        <p className="drawer-summary">{drawer.summary}</p>
        <div className="section-eyebrow left">Common phrases</div>
        <div className="phrase-row">{drawer.phrases.map((phrase) => <span key={phrase}>"{phrase}"</span>)}</div>
        {drawer.hasPos ? <EvidenceList title="Positive evidence" tone="pos" items={drawer.posEvidence} /> : null}
        {drawer.hasNeg ? <EvidenceList title="Negative evidence" tone="con" items={drawer.negEvidence} /> : null}
        <div className="drawer-footer"><span>{drawer.mentions}</span><SentimentBadge label={drawer.confLabel} fg={drawer.confFg} bg={drawer.confBg}/></div>
        <button className="secondary-button full-button" type="button" onClick={drawer.openAnalysis}>Open full analysis</button>
      </aside>
    </div>
  );
}

function EvidenceList({ title, tone, items }) {
  return <div className={`evidence-list evidence-list--${tone}`}><h4>{title}</h4><ul>{items.map((item) => <li key={item}>"{item}"</li>)}</ul></div>;
}
