import Chip from '../components/UI/Chip';
import ImageSlot from '../components/UI/ImageSlot';
import SentimentBadge from '../components/UI/SentimentBadge';

function SplitBar({ pos, neu, neg, compact = false }) {
  return <div className={`split-bar ${compact ? 'split-bar--compact' : ''}`}><span style={{ width: `${pos}%`, background: 'var(--pos)' }} /><span style={{ width: `${neu}%`, background: 'var(--neu)' }} /><span style={{ width: `${neg}%`, background: 'var(--con)' }} /></div>;
}

function AnalysisPage({ app, overlay = false }) {
  const pv = app.pv;
  if (!pv) return null;
  return (
    <div className={overlay ? 'analysis-overlay' : ''}>
      {overlay ? <div className="analysis-overlay__close"><button type="button" onClick={app.closeAnalysisOverlay}>×</button></div> : null}
      <main className={`page analysis-page ${overlay ? 'analysis-page--overlay' : ''}`}>
        {!overlay ? <button className="text-back" type="button" onClick={app.goResultsAll}>← Back to results</button> : null}
        <section className="analysis-top">
          <div className="analysis-image"><ImageSlot id={pv.imgId} src={pv.imgSrc} credit={pv.imgCredit} creditHref={pv.imgCreditHref} placeholder={pv.imgPlaceholder} /></div>
          <div>
            <div className="eyebrow left">{pv.brand}</div>
            <h1>{pv.name}</h1>
            <div className="analysis-origin">{pv.cat} · <a href="#top">{pv.origin}</a></div>
            <div className="badge-row"><SentimentBadge label={pv.pulseLabel} fg={pv.pulseFg} bg={pv.pulseBg} dot size="lg" /><SentimentBadge label={pv.confLabel} fg={pv.confFg} bg={pv.confBg} size="lg" /><span>{pv.reviewsLabel}</span></div>
            {pv.low ? <div className="low-note">{pv.lowMsg}</div> : null}
            <div className="pulse-panel">
              <div className="section-eyebrow-product left">Overall pulse</div>
              <p>"{pv.pulseText}"</p>
              <SplitBar pos={pv.pos} neu={pv.neu} neg={pv.neg} />
              <div className="split-legend"><span><i className="pos" />Positive <b>{pv.pos}%</b></span><span><i className="neu" />Neutral <b>{pv.neu}%</b></span><span><i className="neg" />Negative <b>{pv.neg}%</b></span></div>
            </div>
            <div className="analysis-action-row">
              <button className="analysis-add-btn" type="button" onClick={pv.onAdd}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>Add to Collection</button>
              <button className="analysis-ask-btn" type="button" onClick={pv.onAskAi}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /><path d="M8 9h8M8 13h5" /></svg>ASK AI</button>
            </div>
          </div>
        </section>
        <section className="analysis-section">
          <h2>Attribute sentiment</h2><p>How customers feel across the details that shape a garment.</p>
          <div className="attribute-grid">
            {app.pvAttrs.map((attr) => <article className="attribute-card" key={attr.key}><div><b>{attr.label}</b><SentimentBadge label={attr.stateLabel} fg={attr.fg} bg={attr.bg} /></div><SplitBar compact pos={attr.p} neu={attr.neu} neg={attr.n} /><div className="attr-split"><span>{attr.p}%</span><span>{attr.neu}%</span><span>{attr.n}%</span></div><p>{attr.insight}</p><footer><span>{attr.ev}</span><button type="button" onClick={attr.onEvidence}>View evidence →</button></footer></article>)}
          </div>
        </section>
        <section className="love-complain-grid">
          <div className="love-panel"><h3>What customers love</h3>{app.pvLoves.map((item) => <div key={item.t}><span>{item.t}</span><small>{item.c}</small></div>)}</div>
          <div className="complain-panel"><h3>What customers complain about</h3>{app.pvComplaints.map((item) => <div key={item.t}><span>{item.t}</span><small>{item.c}</small></div>)}</div>
        </section>
        <section className="takeaway-panel"><div className="section-eyebrow left">For your next garment</div><h2>Design takeaways</h2><div>{app.pvTakeaways.map((item) => <p key={item.n}><span>{item.n}</span>{item.t}</p>)}</div></section>
        <section className="analysis-section">
          <h2>Review explorer</h2><p>Read the evidence behind the sentiment.</p>
          <div className="review-controls"><div className="chip-row">{app.pvSentChips.map((item) => <Chip key={item.label} style={{ color: item.fg, background: item.bg, borderColor: item.borderColor }} onClick={item.onClick}>{item.label}</Chip>)}<label className="review-search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg><input value={app.reviewSearch} onChange={(event) => app.setReviewSearch(event.target.value)} placeholder="Search within reviews" /></label></div><div className="chip-row wrap">{app.pvAttrChips.map((item) => <Chip key={item.label} style={{ color: item.fg, background: item.bg, borderColor: item.borderColor }} onClick={item.onClick} sm='chip-sm'>{item.label}</Chip>)}</div></div>
          <div className="muted-line" style={{ marginBottom: '14px' }}>{app.pvReviewCount}</div>
          <div className="review-grid">{app.pvReviews.map((review) => <article className="review-card" key={review.id}><header><span className="review-avatar">{review.initials}</span><b>{review.name}</b><SentimentBadge label={`${review.attrLabel} · ${review.sentLabel}`} fg={review.fg} bg={review.bg} /></header><p>"{review.text}"</p><small>Mentions: <i>"{review.phrase}"</i></small></article>)}</div>
        </section>
      </main>
    </div>
  );
}

export default AnalysisPage;
