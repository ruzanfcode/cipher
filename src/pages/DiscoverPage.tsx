import ProductCard from '../components/UI/ProductCard';

function DiscoverPage({ app }) {
  return (
    <main className="page page--discover narrow-page">
      <section className="hero-section">
        <div className="eyebrow">Garment Sentiment Intelligence</div>
        <h1>Discover what customers <span>really</span> think about garments</h1>
        <p>Search products, analyze review sentiment, and uncover design insights across fit, comfort, quality, style, price, and more.</p>
        <div className="search-panel">
          <div className="search-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input value={app.query} onChange={(event) => app.setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') app.doSearch(); }} placeholder="Search by keyword or paste a product URL" />
            {app.isUrl ? <span className="url-detected">URL detected</span> : null}
            <button className="primary-button search-button" type="button" onClick={() => app.doSearch()}>Search</button>
          </div>
        </div>
      </section>
      <section className="brand-jump">
        <div className="brand-grid">
          {app.brands.map((brand) => <button className={`brand-tile lift-card${brand.selected ? ' brand-tile--selected' : ''}`} type="button" key={brand.name} onClick={brand.onClick}>{brand.name}</button>)}
        </div>
      </section>
      <section className="recent-section">
        <div className="section-heading"><h2>Recently analyzed</h2><button type="button" onClick={app.goResultsAll}>Browse all <span>→</span></button></div>
        <div className="card-grid card-grid--four">
          {app.recent.map((product) => <ProductCard key={product.id} product={product} variant="recent" onOpen={product.onOpen} />)}
        </div>
      </section>
    </main>
  );
}

export default DiscoverPage;
