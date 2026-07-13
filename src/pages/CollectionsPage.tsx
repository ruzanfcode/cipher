import ImageSlot from '../components/UI/ImageSlot';

function Facepile({ owner }) {
  return (
    <div className="facepile" title={owner.peopleTooltip}>
      {owner.faces.map((face) => <span key={`${face.name}-${face.initials}`} className="avatar" style={{ background: face.color }}>{face.initials}</span>)}
      {owner.faceOverflow ? <span className="avatar avatar--more">+{owner.faceOverflow}</span> : null}
    </div>
  );
}

export function CollectionCard({ collection }) {
  return (
    <article className="collection-card lift-card" onClick={collection.onOpen}>
      <div className="collection-card__cover">
        {collection.covers.map((cover, index) => <div key={`${cover.imgId}-${index}`}><ImageSlot id={cover.imgId} src={cover.imgSrc} credit={cover.imgCredit} creditHref={cover.imgCreditHref} placeholder={cover.ph} /></div>)}
      </div>
      <footer className="collection-card__footer">
        <h3>{collection.name}</h3>
        <p>{collection.desc}</p>
        <div className="collection-card__shared"><Facepile owner={collection.owner} /><span>{collection.owner.ownerLabel}</span></div>
        <div className="collection-card__meta"><b>{collection.countLabel}</b><span>{collection.updated}</span></div>
      </footer>
    </article>
  );
}

function CollectionsPage({ app }) {
  return (
    <main className="page wide-page fade-page">
      <div className="page-intro">
        <h1>Collections</h1>
        <p>Research boards for grouping products by concept, competitor, or category.</p>
      </div>
      <div className="card-grid card-grid--three">
        {app.colCards?.map((collection) => <CollectionCard key={collection.id} collection={collection} />)}
      </div>
    </main>
  );
}

export default CollectionsPage;
export { Facepile };
