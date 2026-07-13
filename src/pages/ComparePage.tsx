import Chip from '../components/UI/Chip';
import ImageSlot from '../components/UI/ImageSlot';
import SentimentBadge from '../components/UI/SentimentBadge';

function PinIcon({ pinned = false }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 17v5" />
      <path d="M9 3h6l-1 7 3 3H7l3-3-1-7Z" fill={pinned ? 'currentColor' : 'none'} />
    </svg>
  );
}

function CompareShell({ app, children }) {
  return (
    <main className="page wide-page fade-page compare-page">
      <button className="text-back" type="button" onClick={app.cmp.startCompareBack}>← Back to collection</button>
      <div className="compare-head">
        <div>
          <div className="eyebrow left">Comparing</div>
          <h1>{app.cmp.name}</h1>
        </div>
        <span className="compare-count">{app.cmp.countLabel}</span>
      </div>
      <div className="mode-switch">
        {app.cmpModes.map((mode) => <Chip key={mode.key} style={{ color: mode.fg, background: mode.bg, borderColor: mode.borderColor }} onClick={mode.onClick}>{mode.label}</Chip>)}
      </div>
      <div className="compare-selector">
        <div>Products in comparison · toggle to include, pin to keep visible</div>
        <div>
          {app.cmpSelector.map((item) => (
            <span className="selector-pill" key={item.id}>
              <button type="button" onClick={item.onToggle}>
                <i className={item.on ? 'checked' : ''}>{item.on ? '✓' : ''}</i>
                <span>
                  <b>{item.brand}</b>
                  <small title={item.name}>{item.name}</small>
                </span>
              </button>
              <button type="button" className={`compare-pin-button${item.pin ? ' pinned' : ''}`} onClick={item.onPin} title="Pin">
                <PinIcon pinned={item.pin} />
              </button>
            </span>
          ))}
        </div>
      </div>
      {children}
    </main>
  );
}

function ComparePage({ app }) {
  if (!app.cmp) return null;
  return (
    <CompareShell app={app}>
      {app.cmpIsSum ? <Summary app={app} /> : null}
      {app.cmpIsHeat ? <Heatmap app={app} /> : null}
      {app.cmpIsSide ? <SideBySide app={app} /> : null}
      {app.cmpIsAttr ? <AttributeView app={app} /> : null}
      {app.cmpIsOpp ? <Opportunities app={app} /> : null}
    </CompareShell>
  );
}

function Summary({ app }) {
  return <><section className="summary-hero"><div className="section-eyebrow left">Collection summary <b>AI</b></div><p>{app.sumText}</p></section><div className="summary-grid"><ListPanel title="Strongest attributes" items={app.sumStrong} /><ListPanel title="Weakest attributes" items={app.sumWeak} /></div><div className="summary-grid"><QuotePanel title="Most repeated praises" tone="pos" items={app.sumPraises} /><QuotePanel title="Most repeated complaints" tone="con" items={app.sumComplaints} /></div><section className="aggregate-panel"><div className="section-heading"><h3>Aggregate sentiment by attribute</h3><span>Ranked by net sentiment · averaged across selected products</span></div><div className="aggregate-legend"><span><i className="con" />Concern leans left</span><span><i className="pos" />Praise leans right</span></div>{app.sumAgg.map((item) => <div className="agg-row" key={item.label}><b>{item.label}</b><span className="agg-bars"><span><i style={{ width: `${item.neg}%`, background: 'var(--con)' }} /></span><span><i style={{ width: `${item.p}%`, background: 'var(--pos)' }} /></span></span><strong>{item.netLabel}</strong><SentimentBadge label={item.state} fg={item.fg} bg={item.bg} /></div>)}</section><button className="opportunity-link" type="button" onClick={app.goOpp}>{app.sumOppCount} <span>See the design opportunity map →</span></button></>;
}

function ListPanel({ title, items }) { return <section className="list-panel"><h3>{title}</h3>{items.map((item) => <div key={item.label}><span>{item.label}</span><SentimentBadge label={item.state} fg={item.fg} bg={item.bg} /></div>)}</section>; }
function QuotePanel({ title, tone, items }) { return <section className={`quote-panel quote-panel--${tone}`}><h3>{title}</h3>{items.map((item) => <p key={item.label}><b>{item.label}</b><span> - "{item.text}"</span></p>)}</section>; }

function Heatmap({ app }) {
  return <><section className="heatmap-panel"><div className="heatmap-grid" style={{ gridTemplateColumns: `130px repeat(${app.hmColCount}, 1fr)` }}><span />{app.hmCols.map((col) => <button type="button" key={col.id} onClick={col.onOpen}><span><ImageSlot id={col.imgId} src={col.imgSrc} credit={col.imgCredit} creditHref={col.imgCreditHref} placeholder="" /></span><b>{col.brand}</b><small>{col.short}</small>{col.low ? <em>low data</em> : null}</button>)}{app.hmRows.map((row) => [<b className="heatmap-label" key={`${row.label}-label`}>{row.label}</b>, ...row.cells.map((cell, index) => <button className="heatmap-cell" type="button" key={`${row.label}-${index}`} style={{ color: cell.fg, background: cell.bg }} onClick={cell.onClick}>{cell.stateLabel}{cell.low ? <i /> : null}</button>)])}</div></section><div className="heatmap-legend"><span>Click any cell to see the evidence.</span><span><i className="heatmap-legend__pos" />Positive</span><span><i className="heatmap-legend__mix" />Mixed</span><span><i className="heatmap-legend__con" />Concern</span><span><i className="heatmap-legend__low" />Low review data</span></div></>;
}

function SideBySide({ app }) {
  return (
    <section className="side-panel">
      <div className="side-grid" style={{ gridTemplateColumns: `150px repeat(${app.sideColCount}, minmax(190px, 1fr))` }}>
        <span />
        {app.sideCols.map((col) => (
          <div className={`side-product ${col.pin ? 'side-product--pinned' : ''}`} key={col.id}>
            <div className="side-product__image"><ImageSlot id={col.imgId} src={col.imgSrc} credit={col.imgCredit} creditHref={col.imgCreditHref} placeholder={col.brand} /></div>
            <div className="side-product__meta">
              <small>{col.brand}</small>
              <button className={`compare-pin-button${col.pin ? ' pinned' : ''}`} type="button" onClick={col.onPin} title="Pin">
                <PinIcon pinned={col.pin} />
              </button>
            </div>
            <button className="side-product__name" type="button" onClick={col.onOpen}>{col.name}</button>
            <div className="side-product__badges">
              <SentimentBadge label={col.pulseLabel} fg={col.pulseFg} bg={col.pulseBg} />
              <SentimentBadge label={col.confLabel} fg={col.confFg} bg={col.confBg} />
            </div>
          </div>
        ))}
        {app.sideRows.map((row) => [
          <b className="side-label" key={`${row.label}-label`}>{row.label}</b>,
          ...row.cells.map((cell, index) => <button className={`side-cell${cell.pin ? ' side-cell--pinned' : ''}`} type="button" key={`${row.label}-${index}`} onClick={cell.onClick}><SentimentBadge label={cell.stateLabel} fg={cell.fg} bg={cell.bg} /><span>{cell.insight}</span></button>),
        ])}
      </div>
    </section>
  );
}

function AttributeView({ app }) {
  return <section className="attribute-view"><div className="chip-row wrap"><span>Attribute</span>{app.attrChips.map((item) => <Chip key={item.label} style={{ color: item.fg, background: item.bg, borderColor: item.borderColor }} onClick={item.onClick}>{item.label}</Chip>)}</div><div className="attribute-groups">{app.attrGroups.map((group) => <div key={group.label}><h3><i style={{ background: group.color }} />{group.label}<span>{group.countLabel}</span></h3><div className="attr-product-grid">{group.items.map((item) => <button type="button" key={item.id} onClick={item.onOpen}><span className="attr-product-image"><ImageSlot id={item.imgId} src={item.imgSrc} credit={item.imgCredit} creditHref={item.imgCreditHref} placeholder="" /></span><span className="attr-product-copy"><b>{item.brand}</b><strong>{item.name}</strong><SentimentBadge label={item.stateLabel} fg={item.fg} bg={item.bg} /><p>{item.insight}</p><small>{item.ev} · {item.confLabel}</small></span></button>)}</div></div>)}</div></section>;
}

function Opportunities({ app }) {
  return <section className="opportunity-panel"><div className="page-intro"><h2>Design opportunity map</h2><p>Product comparison, translated into a practical brief for the next garment.</p></div>{app.opportunities.map((item) => <article key={item.n}><span>{item.n}</span><div><h3>{item.title}<SentimentBadge label={item.tagLabel} fg={item.tagFg} bg={item.tagBg} /></h3><p>{item.reason}</p></div></article>)}</section>;
}

export default ComparePage;
