import { useEffect, useRef } from 'react';
import ProductCard from '../components/UI/ProductCard';

function ResultsPage({ app }) {
  const controlsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (controlsRef.current?.contains(event.target as Node)) return;
      controlsRef.current?.querySelectorAll('details[open]').forEach((item) => item.removeAttribute('open'));
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <main className="page wide-page fade-page">
      <div className="results-header">
        <div>
          <button className="text-back" type="button" onClick={app.goDiscover}>← Back to Discover</button>
          <h1>{app.resHeading}</h1>
          <div className="muted-line">{app.resCount}</div>
        </div>
        <div className="results-controls" ref={controlsRef}>
          <label className="sort-select"><span>SORT BY</span><select value={app.resSortValue} onChange={app.onSortChange}>{app.resSortOpts?.map((item) => <option key={item.label} value={item.key}>{item.label}</option>)}</select></label>
          <div className="filter-dropdowns">
            <details className="filter-dropdown">
              <summary><span>Categories</span><b>{app.resCategorySummary}</b></summary>
              <div className="filter-dropdown__panel">{app.resCategoryOptions?.map((item) => <button className={item.selected ? 'selected' : ''} type="button" key={item.label} onClick={item.onToggle}><i>{item.selected ? '✓' : ''}</i>{item.label}</button>)}</div>
            </details>
            <details className="filter-dropdown">
              <summary><span>Brands</span><b>{app.resBrandSummary}</b></summary>
              <div className="filter-dropdown__panel">{app.resBrandOptions?.map((item) => <button className={item.selected ? 'selected' : ''} type="button" key={item.label} onClick={item.onToggle}><i>{item.selected ? '✓' : ''}</i>{item.label}</button>)}</div>
            </details>
          </div>
        </div>
      </div>
      <div className="card-grid card-grid--four">
        {app.resCards?.map((product) => <ProductCard key={product.id} product={product} onOpen={product.onOpen} onAdd={product.onAdd} />)}
      </div>
    </main>
  );
}

export default ResultsPage;
