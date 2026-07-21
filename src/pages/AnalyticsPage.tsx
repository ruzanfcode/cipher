import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BRANDS, COLLECTIONS_SEED, PEOPLE, PRODUCT_MAP } from '../services/catalog';

const ANALYSIS_TYPES = ['Single page', 'Comparison', 'Aggregate'];
const PERIODS = ['This week', 'This month', 'This year', 'Custom'];
const SBUS = ['Activewear', 'Athleisure', 'Basics', 'Innerwear', 'Loungewear', 'Outerwear', 'Performance'];
const ANCHOR_DATE = new Date('2026-07-21T12:00:00');

const rowSeeds = [
  ['2026-07-21T09:30:00', 'single', 'nike-legging', 'Activewear', 'Priya Nair'],
  ['2026-07-20T14:15:00', 'comparison', 'c1', 'Performance', 'Sofia Bianchi'],
  ['2026-07-18T11:10:00', 'aggregate', 'c3', 'Athleisure', 'Liam Ortega'],
  ['2026-07-15T16:45:00', 'single', 'lulu-align', 'Athleisure', 'Mayasomethingonetest Chenthisisfor test'],
  ['2026-07-11T10:20:00', 'comparison', 'c2', 'Innerwear', 'Noah Feldman'],
  ['2026-07-03T13:00:00', 'single', 'uniqlo-airism', 'Basics', 'Amara Diallo'],
  ['2026-06-28T12:25:00', 'aggregate', 'c4', 'Loungewear', 'Jonas Vidal'],
  ['2026-06-21T15:30:00', 'single', 'champion-hoodie', 'Outerwear', 'Priya Nair'],
  ['2026-06-14T08:45:00', 'single', 'ua-tech', 'Performance', 'Sofia Bianchi'],
  ['2026-06-08T17:30:00', 'single', 'vs-bra', 'Innerwear', 'Liam Ortega'],
  ['2026-05-29T10:10:00', 'single', 'adidas-legging', 'Activewear', 'Noah Feldman'],
  ['2026-05-16T14:55:00', 'comparison', 'c1', 'Performance', 'Amara Diallo'],
  ['2026-04-25T09:20:00', 'single', 'gymshark-seamless', 'Activewear', 'Jonas Vidal'],
  ['2026-03-18T12:00:00', 'aggregate', 'c3', 'Athleisure', 'Priya Nair'],
  ['2026-02-06T16:00:00', 'single', 'zara-seamless', 'Activewear', 'Sofia Bianchi'],
  ['2026-01-19T11:35:00', 'single', 'hm-drymove', 'Activewear', 'Liam Ortega'],
];

const userOptions = [PEOPLE.me, ...PEOPLE.roster].map((person) => person.name);

function collectionBrands(collectionId) {
  const collection = COLLECTIONS_SEED.find((item) => item.id === collectionId);
  if (!collection) return [];
  return [...new Set(collection.products.map((id) => PRODUCT_MAP[id]?.brand).filter(Boolean))];
}

function collectionReviewCount(collectionId) {
  const collection = COLLECTIONS_SEED.find((item) => item.id === collectionId);
  if (!collection) return 0;
  return collection.products.reduce((total, id) => total + (PRODUCT_MAP[id]?.reviews || 0), 0);
}

function makeActivity([date, type, targetId, sbu, user], index) {
  const isProduct = type === 'single';
  const product = isProduct ? PRODUCT_MAP[targetId] : null;
  const collection = isProduct ? null : COLLECTIONS_SEED.find((item) => item.id === targetId);
  const brands = isProduct ? [product?.brand] : collectionBrands(targetId);
  const reviews = isProduct ? product?.reviews || 0 : collectionReviewCount(targetId);
  return {
    id: `activity-${index}`,
    date: new Date(date),
    type,
    typeLabel: ANALYSIS_TYPES.find((label) => label.toLowerCase().startsWith(type)) || 'Aggregate',
    targetKind: isProduct ? 'product' : 'collection',
    targetId,
    targetName: isProduct ? product?.name : collection?.name,
    brands: brands.filter(Boolean),
    brandLabel: brands.filter(Boolean).join(', '),
    reviews,
    sbu,
    user,
    email: `${user.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')}@mas.com`,
  };
}

const mockActivities = rowSeeds.map(makeActivity);

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}

function periodStart(period) {
  const start = new Date(ANCHOR_DATE);
  if (period === 'This week') start.setDate(start.getDate() - 7);
  if (period === 'This month') start.setMonth(start.getMonth() - 1);
  if (period === 'This year') start.setFullYear(start.getFullYear() - 1);
  start.setHours(0, 0, 0, 0);
  return start;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      <b>{label}</b>
      {payload.map((item) => <span key={item.dataKey}>{item.name}: {item.value}</span>)}
    </div>
  );
}

function AnalyticsPage({ app: _app }) {
  const navigate = useNavigate();
  const [brand, setBrand] = useState('All brands');
  const [sbu, setSbu] = useState('All SBUs');
  const [user, setUser] = useState('All users');
  const [analysisType, setAnalysisType] = useState('All analysis types');
  const [period, setPeriod] = useState('This month');
  const [customOpen, setCustomOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState('2026-06-01');
  const [customTo, setCustomTo] = useState('2026-07-21');

  const filteredActivities = useMemo(() => {
    const from = period === 'Custom' ? new Date(`${customFrom}T00:00:00`) : periodStart(period);
    const to = period === 'Custom' ? new Date(`${customTo}T23:59:59`) : ANCHOR_DATE;
    return mockActivities.filter((activity) => {
      if (activity.date < from || activity.date > to) return false;
      if (brand !== 'All brands' && !activity.brands.includes(brand)) return false;
      if (sbu !== 'All SBUs' && activity.sbu !== sbu) return false;
      if (user !== 'All users' && activity.user !== user) return false;
      if (analysisType !== 'All analysis types' && activity.typeLabel !== analysisType) return false;
      return true;
    });
  }, [analysisType, brand, customFrom, customTo, period, sbu, user]);

  const timelineData = useMemo(() => {
    const groups = new Map();
    filteredActivities.forEach((activity) => {
      const label = formatDate(activity.date).slice(0, 5);
      groups.set(label, (groups.get(label) || 0) + 1);
    });
    return [...groups.entries()].map(([date, analyses]) => ({ date, analyses })).reverse();
  }, [filteredActivities]);

  const activeBrands = useMemo(() => [...new Set(filteredActivities.flatMap((activity) => activity.brands))], [filteredActivities]);

  const brandData = useMemo(() => {
    const dateLabels = [...new Set(filteredActivities.map((activity) => formatDate(activity.date).slice(0, 5)))].reverse();
    return dateLabels.map((date) => {
      const row = { date };
      activeBrands.forEach((activeBrand) => {
        row[activeBrand] = filteredActivities.filter((activity) => formatDate(activity.date).slice(0, 5) === date && activity.brands.includes(activeBrand)).length;
      });
      return row;
    });
  }, [activeBrands, filteredActivities]);

  const reviewsProcessed = filteredActivities.reduce((total, activity) => total + activity.reviews, 0);
  const visibleBrands = activeBrands.slice(0, 6);

  function handlePeriodChange(value) {
    setPeriod(value);
    if (value === 'Custom') setCustomOpen(true);
  }

  function openActivity(activity) {
    navigate(activity.targetKind === 'product' ? `/analysis/${activity.targetId}` : `/collections/${activity.targetId}`);
  }

  return (
    <main className="page wide-page fade-page analytics-page">
      <div className="page-intro">
        <h1>Analytics</h1>
        <p>Track analysis volume, active brands, review throughput, and recent intelligence activity.</p>
      </div>

      <div className="analytics-toolbar">
        <label className="sort-select"><span>Brand</span><select value={brand} onChange={(event) => setBrand(event.target.value)}><option>All brands</option>{BRANDS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="sort-select"><span>SBU</span><select value={sbu} onChange={(event) => setSbu(event.target.value)}><option>All SBUs</option>{SBUS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="sort-select"><span>User</span><select value={user} onChange={(event) => setUser(event.target.value)}><option>All users</option>{userOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="sort-select"><span>Analysis type</span><select value={analysisType} onChange={(event) => setAnalysisType(event.target.value)}><option>All analysis types</option>{ANALYSIS_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="sort-select"><span>Period</span><select value={period} onChange={(event) => handlePeriodChange(event.target.value)}>{PERIODS.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>

      <section className="analytics-kpis" aria-label="Analytics summary">
        <div className="analytics-kpi"><span>Total analyses</span><strong>{filteredActivities.length}</strong></div>
        <div className="analytics-kpi"><span>Active brands</span><strong>{activeBrands.length}</strong></div>
        <div className="analytics-kpi"><span>Reviews processed</span><strong>{reviewsProcessed.toLocaleString()}</strong></div>
      </section>

      <section className="analytics-chart-grid">
        <article className="analytics-card">
          <div className="analytics-card__head"><h2>Analysis timeline</h2><span className="analytics-pill">{period}</span></div>
          <div className="analytics-chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 12, right: 14, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="2 7" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="analyses" name="Analyses" stroke="var(--pos)" fill="var(--pos-bg)" strokeWidth={3} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="analytics-card">
          <div className="analytics-card__head"><h2>Analyses by brand</h2><span>{visibleBrands.length ? 'Filtered mix' : 'No matching data'}</span></div>
          <div className="analytics-chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={brandData} margin={{ top: 12, right: 14, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="2 7" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--muted)', fontSize: 12, paddingTop: 10 }} />
                {visibleBrands.map((item, index) => <Line connectNulls dataKey={item} key={item} name={item} stroke={['var(--pos)', 'var(--amber)', 'var(--con)', 'var(--neu)', 'var(--ink)', 'var(--faint)'][index]} strokeWidth={2.5} type="monotone" />)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <article className="analytics-card analytics-table-card">
        <div className="analytics-table__head"><h2>Recent activity</h2><span className="analytics-table__meta">{filteredActivities.length} entries</span></div>
        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead><tr><th>User</th><th>Product / collection</th><th>Type</th><th>SBU</th><th>Brand</th><th>Reviews</th><th>Time</th></tr></thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr className="analytics-table__row" key={activity.id} onClick={() => openActivity(activity)}>
                  <td>{activity.email}</td>
                  <td><strong>{activity.targetName}</strong></td>
                  <td><span className={`analytics-type analytics-type--${activity.type}`}>{activity.typeLabel}</span></td>
                  <td>{activity.sbu}</td>
                  <td><strong>{activity.brandLabel}</strong></td>
                  <td>{activity.reviews.toLocaleString()}</td>
                  <td>{formatTime(activity.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="analytics-table__foot"><span className="analytics-table__meta">Showing {filteredActivities.length ? `1-${filteredActivities.length}` : '0'} of {filteredActivities.length}</span><div className="analytics-pager"><button type="button">Previous</button><span>1</span><button type="button">Next</button></div></div>
      </article>

      {customOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-dialog analytics-date-modal" role="dialog" aria-modal="true" aria-label="Custom analytics period">
            <h3>Custom period</h3>
            <p>Select a start and end date for the analytics filters.</p>
            <div className="analytics-date-grid">
              <label><span>From date</span><input type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} /></label>
              <label><span>To date</span><input type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} /></label>
            </div>
            <div className="confirm-actions">
              <button className="secondary-button" type="button" onClick={() => { setPeriod('This month'); setCustomOpen(false); }}>Cancel</button>
              <button className="primary-button" type="button" onClick={() => setCustomOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default AnalyticsPage;