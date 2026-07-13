import ProductCard from '../components/UI/ProductCard';
import { Facepile } from './CollectionsPage';

function CollectionDetailPage({ app }) {
  const collection = app.cd;
  if (!collection) return null;
  return (
    <main className="page wide-page fade-page">
      <button className="text-back" type="button" style={{ marginBottom: '22px' }} onClick={app.goCollections}>← All collections</button>
      <div className="collection-detail-head">
        <div>
          <div className="muted-line">{collection.countLabel}</div>
          <h1>{collection.name}</h1>
          <p>{collection.desc}</p>
          <div className="owner-row"><Facepile owner={collection.owner} /><span>{collection.owner.ownerLabel}</span><span>·</span><span>{collection.owner.accessLabel}</span></div>
        </div>
        <div className="detail-actions">
          <button className="secondary-button" type="button" onClick={app.cdShare}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 12a4 4 0 1 0-4-4M8 12a4 4 0 1 0 4 4" /><path d="M2 21a7 7 0 0 1 11-1M13 20a7 7 0 0 1 9-4" /></svg>Share access</button>
          <button className="primary-button cd-compare-btn" type="button" onClick={app.cdCompare}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M3 3v18h18M8 15v3M13 10v8M18 6v12" /></svg>Compare Products</button>
        </div>
      </div>
      <div className="card-grid card-grid--four collection-products">
        {app.cdCards?.map((product) => <ProductCard key={product.id} product={product} variant="collection" onOpen={product.onOpen} onRemove={product.onRemove} />)}
      </div>
    </main>
  );
}

export default CollectionDetailPage;
