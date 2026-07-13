import Chip from '../components/UI/Chip';
import ProductCard from '../components/UI/ProductCard';

function ResultsPage({ app }) {
  return (
    <main className="page wide-page fade-page">
      <div className="results-header">
        <div>
          <button className="text-back" type="button" onClick={app.goDiscover}>← Back to Discover</button>
          <h1>{app.resHeading}</h1>
          <div className="muted-line">{app.resCount}</div>
        </div>
        <div className="chip-row"><span>Sort</span>{app.resSortOpts?.map((item) => <Chip key={item.label} active={item.fg === 'var(--paper)'} style={{ color: item.fg, background: item.bg, borderColor: item.borderColor }} onClick={item.onClick}>{item.label}</Chip>)}</div>
      </div>
      <div className="filter-row">
        <span>Category</span>
        {app.resCatOpts?.map((item) => <Chip key={item.label} active={item.fg === 'var(--paper)'} style={{ color: item.fg, background: item.bg, borderColor: item.borderColor }} onClick={item.onClick}>{item.label}</Chip>)}
        {app.resBrandActive ? <span className="active-filter">{app.resBrandActive}<button type="button" onClick={app.resClearBrand}>x</button></span> : null}
      </div>
      <div className="card-grid card-grid--four">
        {app.resCards?.map((product) => <ProductCard key={product.id} product={product} onOpen={product.onOpen} onAdd={product.onAdd} />)}
      </div>
    </main>
  );
}

export default ResultsPage;
