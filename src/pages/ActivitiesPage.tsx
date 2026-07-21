function ActivitiesPage({ app }) {
  const activities = app.recent?.map((product, index) => ({
    id: product.id,
    title: product.name,
    description: `Product sentiment analysis ${index === 0 ? 'was updated' : 'was reviewed'}`,
    meta: product.brand || 'MAS Cipher',
  })) || [];

  return (
    <main className="page wide-page fade-page">
      <div className="page-intro">
        <h1>Activities</h1>
        <p>Recent workspace updates and product analysis activity.</p>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <article className="activity-row" key={activity.id}>
            <span className="activity-row__mark" />
            <div>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
            </div>
            <small>{activity.meta}</small>
          </article>
        ))}
      </div>
    </main>
  );
}

export default ActivitiesPage;