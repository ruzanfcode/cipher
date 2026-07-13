import ImageSlot from './ImageSlot';
import SentimentBadge from './SentimentBadge';

function ProductCard({ product, variant = 'default', onOpen, onAdd, onRemove }: { product: any; variant?: string; onOpen?: () => void; onAdd?: (event: any) => void; onRemove?: (event: any) => void }) {
  return (
    <article className={`product-card lift-card${variant === 'collection' ? ' product-card--collection' : ''}`}>
      <button className="product-card__image" type="button" onClick={onOpen}>
        <ImageSlot id={product.imgId} src={product.imgSrc} credit={product.imgCredit} creditHref={product.imgCreditHref} placeholder={product.imgPlaceholder || product.ph} />
      </button>
      {onAdd ? (
        <button className="product-card__action" type="button" title="Add to collection" onClick={onAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--con)" strokeWidth="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
        </button>
      ) : null}
      {onRemove ? (
        <button className="product-card__action" type="button" title="Delete from collection" onClick={onRemove}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--con)" strokeWidth="1.9"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></svg>
        </button>
      ) : null}
      <button className="product-card__body" type="button" onClick={onOpen}>
        <div className="product-card__meta">
          <span>{product.brand}</span>
          {product.cat && variant !== 'collection' ? <span>{product.cat}</span> : null}
        </div>
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__badges">
          <SentimentBadge label={product.pulseLabel} fg={product.pulseFg} bg={product.pulseBg} dot />
          {variant !== 'recent' ? <SentimentBadge label={product.confLabel} fg={product.confFg} bg={product.confBg} /> : null}
          {variant === 'recent' ? <span className="product-card__reviews">{product.reviewsLabel}</span> : null}
        </div>
        {variant === 'collection' ? (
          <div className="product-card__strengths">
            <div><span className="up">↑</span><span>Strongest</span><b>{product.best}</b></div>
            <div><span className="down">↓</span><span>Biggest concern</span><b>{product.worst}</b></div>
          </div>
        ) : null}
        {variant === 'default' ? <div className="product-card__reviews product-card__reviews--block">{product.reviewsLabel}</div> : null}
      </button>
    </article>
  );
}

export default ProductCard;
