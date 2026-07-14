import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ATTRIBUTE_LABELS,
  ATTRIBUTES,
  BRANDS,
  COLLECTIONS_SEED,
  CONFIDENCE_TONES,
  PEOPLE,
  PHRASES,
  PRODUCT_MAP,
  PRODUCTS,
  REVIEW_SNIPPETS,
  SENTIMENT_SPLIT,
  SENTIMENT_STATES,
  TRENDING,
  chipStyle,
  confidenceFor,
  imageFor,
  pulseLabel,
  reviewCountLabel,
  shortName,
} from '../services/catalog';

const AVATAR_COLORS = ['#3F7A5C', '#5F6873', '#8C6A3F', '#4C6285', '#7A4A6B', '#B0562F'];

function avatarColor(initials) {
  let hash = 0;
  for (let index = 0; index < initials.length; index += 1) hash = (hash * 31 + initials.charCodeAt(index)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function person(name): any {
  if (name === 'me') return { ...PEOPLE.me };
  const rosterPerson = PEOPLE.roster.find((item) => item.name === name);
  if (rosterPerson) return { ...rosterPerson };
  return {
    name,
    initials: name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase(),
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@studio.com`,
  };
}

function scrollTop() {
  window.scrollTo({ top: 0 });
}

function routeToScreen(pathname) {
  if (pathname.startsWith('/results')) return 'results';
  if (pathname.startsWith('/analysis')) return 'analysis';
  if (pathname.startsWith('/collections/') && pathname.endsWith('/compare')) return 'compare';
  if (pathname.startsWith('/collections/')) return 'collectionDetail';
  if (pathname.startsWith('/collections')) return 'collections';
  return 'discover';
}

function routeCollectionId(pathname) {
  const match = pathname.match(/^\/collections\/([^/]+)/);
  return match?.[1] || '';
}

function productImageVM(id, suffix = '') {
  const product = PRODUCT_MAP[id];
  const image = imageFor(id);
  return {
    imgId: `img-${id}${suffix}`,
    imgSrc: image.src,
    imgCredit: image.credit,
    imgCreditHref: image.creditHref,
    imgPlaceholder: product ? `${product.brand} · drop photo` : 'Drop photo',
  };
}

function makeCardVM(id, openProduct, openAdd, asPage = false) {
  const item = PRODUCT_MAP[id];
  const confidence = confidenceFor(item.reviews);
  const confidenceTone = CONFIDENCE_TONES[confidence.tone];
  const sentiment = SENTIMENT_STATES[item.pulse];
  return {
    id,
    brand: item.brand,
    name: item.name,
    cat: item.cat,
    reviews: item.reviews,
    reviewsLabel: reviewCountLabel(item.reviews),
    ...productImageVM(id),
    pulseLabel: pulseLabel(item.pulse),
    pulseFg: sentiment.fg,
    pulseBg: sentiment.bg,
    confLabel: confidence.label,
    confFg: confidenceTone.fg,
    confBg: confidenceTone.bg,
    onOpen: () => openProduct(id, { asPage }),
    onAdd: (event) => {
      event?.stopPropagation();
      openAdd(id);
    },
  };
}

function buildReviews(product) {
  const names = ['Jordan R.', 'Priya S.', 'Marcus L.', 'Elena V.', 'Chen W.', 'Sofia M.', 'Dylan K.', 'Aisha B.', 'Tomas N.', 'Grace H.', 'Owen P.', 'Nadia F.'];
  const reviews = [];
  let id = 0;
  ATTRIBUTES.forEach((attribute) => {
    const attributeState = product.attrs[attribute.key].state;
    const polarities = attributeState === 'mixed'
      ? ['positive', 'negative']
      : ['strongpos', 'pos'].includes(attributeState)
        ? ['positive']
        : attributeState === 'neutral' || attributeState === 'lowconf'
          ? ['neutral']
          : ['negative'];
    polarities.forEach((polarity) => {
      const phraseBank = polarity === 'positive' ? PHRASES[attribute.key].pos : polarity === 'negative' ? PHRASES[attribute.key].neg : PHRASES[attribute.key].pos;
      const snippetBank = polarity === 'positive' ? REVIEW_SNIPPETS.pos : polarity === 'negative' ? REVIEW_SNIPPETS.neg : REVIEW_SNIPPETS.neutral;
      const name = names[id % names.length];
      const state = polarity === 'positive' ? SENTIMENT_STATES.pos : polarity === 'negative' ? SENTIMENT_STATES.concern : SENTIMENT_STATES.neutral;
      reviews.push({
        id: `r${id}`,
        attr: attribute.key,
        attrLabel: attribute.label,
        pol: polarity,
        phrase: phraseBank[id % phraseBank.length],
        text: snippetBank[id % snippetBank.length],
        name,
        initials: name.split(' ').map((word) => word[0]).join(''),
        fg: state.fg,
        bg: state.bg,
        sentLabel: polarity === 'positive' ? 'Positive' : polarity === 'negative' ? 'Negative' : 'Neutral',
      });
      id += 1;
    });
  });
  return reviews;
}

export function useCipherApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [query, setQuery] = useState('');
  const [resultsQuery, setResultsQuery] = useState('');
  const [resultsBrand, setResultsBrand] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [resultsBrands, setResultsBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevant');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterCat, setFilterCat] = useState('All');
  const [filterCats, setFilterCats] = useState<string[]>([]);
  const [productId, setProductId] = useState('nike-legging');
  const [analysisOn, setAnalysisOn] = useState(false);
  const [collections, setCollections] = useState(() => COLLECTIONS_SEED.map((collection) => ({ ...collection, products: [...collection.products], access: [...collection.access] })));
  const [collectionId, setCollectionId] = useState('c1');
  const [addState, setAddState] = useState<any>({ open: false, productId: null, checked: {}, search: '', newMode: false, name: '', desc: '' });
  const [shareState, setShareState] = useState<any>({ open: false, colId: null, input: '', pending: [], sent: false, link: '', copied: false });
  const [confirm, setConfirm] = useState<any>(null);
  const [compareMode, setCompareMode] = useState('summary');
  const [compareAttr, setCompareAttr] = useState('comfort');
  const [compareExcluded, setCompareExcluded] = useState({});
  const [comparePinned, setComparePinned] = useState([]);
  const [drawer, setDrawer] = useState<any>({ open: false, productId: null, attr: null });
  const [chatState, setChatState] = useState<any>({ open: false, context: null, input: '', messages: [], focusKey: 0, minimized: false });
  const [reviewSent, setReviewSent] = useState('all');
  const [reviewAttr, setReviewAttr] = useState('all');
  const [reviewSearch, setReviewSearch] = useState('');

  const screen = routeToScreen(location.pathname);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    setAnalysisOn(false);
    setDrawer({ open: false, productId: null, attr: null });
    setChatState((current) => {
      const nextScreen = routeToScreen(location.pathname);
      const nextCollectionId = routeCollectionId(location.pathname);
      const keepCollectionChat = ['collectionDetail', 'compare'].includes(nextScreen) && ['collection', 'compare'].includes(current.context?.type) && current.context?.id === nextCollectionId;
      return keepCollectionChat ? current : { ...current, open: false };
    });
    if (location.pathname.endsWith('/compare')) {
      setCompareMode('summary');
      setCompareExcluded({});
      setComparePinned([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (params.productId) setProductId(params.productId);
    if (params.collectionId) setCollectionId(params.collectionId);
  }, [params.productId, params.collectionId]);

  function login() {
    setLoggedIn(true);
    setUserMenuOpen(false);
    navigate('/discover');
    scrollTop();
  }

  function logout() {
    setLoggedIn(false);
    setUserMenuOpen(false);
    navigate('/discover');
    scrollTop();
  }

  function goDiscover() { navigate('/discover'); scrollTop(); }
  function goCollections() { navigate('/collections'); scrollTop(); }
  function goResultsAll() {
    setResultsQuery('');
    setResultsBrand('');
    setResultsBrands([]);
    setSelectedBrands([]);
    setFilterBrand('All');
    setFilterCat('All');
    setFilterCats([]);
    setChatState((current) => ({ ...current, open: false }));
    navigate('/results');
    scrollTop();
  }

  function doSearch(value = query) {
    const nextQuery = value.trim();
    setResultsQuery(nextQuery);
    setResultsBrand('');
    setResultsBrands(selectedBrands);
    setFilterBrand('All');
    setFilterCat('All');
    setFilterCats([]);
    navigate('/results');
    scrollTop();
  }

  function toggleBrandSelect(name) {
    setSelectedBrands((current) => (current.includes(name) ? current.filter((brand) => brand !== name) : [...current, name]));
  }

  function openProduct(id, options: any = {}) {
    setProductId(id);
    setReviewSent('all');
    setReviewAttr('all');
    setReviewSearch('');
    if (options.asPage) {
      setAnalysisOn(false);
      navigate(`/analysis/${id}`);
      scrollTop();
    } else {
      setAnalysisOn(true);
    }
  }

  function openAskAi(id) {
    const item = PRODUCT_MAP[id];
    if (!item) return;
    setChatState({ open: true, context: { type: 'product', id }, input: '', messages: [{ role: 'ai', text: `Ask me about ${item.name}'s sentiment, reviews, strengths, or concerns.` }], focusKey: Date.now(), minimized: false });
  }

  function openCollectionAskAi(id) {
    const collection = collections.find((item) => item.id === id);
    if (!collection) return;
    setChatState({ open: true, context: { type: 'collection', id }, input: '', messages: [{ role: 'ai', text: `Ask me about ${collection.name}, its products, shared themes, or design opportunities.` }], focusKey: Date.now(), minimized: false });
  }

  function openCompareAskAi(id) {
    const collection = collections.find((item) => item.id === id);
    if (!collection) return;
    const activeCount = collection.products.filter((product) => !compareExcluded[product]).length;
    setChatState({ open: true, context: { type: 'compare', id }, input: '', messages: [{ role: 'ai', text: `Ask me to compare the ${activeCount} selected products in ${collection.name}.` }], focusKey: Date.now(), minimized: false });
  }

  function sendAiQuestion(event) {
    event.preventDefault();
    const question = chatState.input.trim();
    const answer = buildAiChatAnswer(chatState.context, collections, compareExcluded);
    if (!question || !answer) return;
    setChatState((current) => ({ ...current, input: '', messages: [...current.messages, { role: 'user', text: question }, { role: 'ai', text: answer }] }));
  }

  function openCollection(id) {
    setCollectionId(id);
    navigate(`/collections/${id}`);
    scrollTop();
  }

  function startCompare(id) {
    setCollectionId(id);
    setCompareMode('summary');
    setCompareExcluded({});
    setComparePinned([]);
    navigate(`/collections/${id}/compare`);
    scrollTop();
  }

  function openAdd(id) {
    const checked = Object.fromEntries(collections.map((collection) => [collection.id, collection.products.includes(id)]));
    setAddState({ open: true, productId: id, checked, search: '', newMode: false, name: '', desc: '' });
  }

  function confirmAdd() {
    setCollections((current) => current.map((collection) => {
      const shouldInclude = addState.checked[collection.id];
      const hasProduct = collection.products.includes(addState.productId);
      if (shouldInclude && !hasProduct) return { ...collection, products: [...collection.products, addState.productId], updated: 'just now' };
      if (!shouldInclude && hasProduct) return { ...collection, products: collection.products.filter((id) => id !== addState.productId), updated: 'just now' };
      return collection;
    }));
    setAddState((current) => ({ ...current, open: false }));
  }

  function createCollection() {
    const name = addState.name.trim();
    if (!name) return;
    const id = `c${Date.now()}`;
    setCollections((current) => [{ id, name, desc: addState.desc.trim(), owner: 'me', access: [], updated: 'just now', products: addState.productId ? [addState.productId] : [] }, ...current]);
    setAddState((current) => ({ ...current, checked: { ...current.checked, [id]: true }, newMode: false, name: '', desc: '' }));
  }

  function openShare(id) {
    setShareState({ open: true, colId: id, input: '', pending: [], sent: false, copied: false, link: `https://cipher.studio/c/${id}?invite=${Math.random().toString(36).slice(2, 10)}` });
  }

  function addSharePerson(name = shareState.input) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const collection = collections.find((item) => item.id === shareState.colId);
    if (collection?.access.includes(trimmed) || shareState.pending.includes(trimmed)) return;
    setShareState((current) => ({ ...current, input: '', pending: [...current.pending, trimmed] }));
  }

  function shareAccess() {
    if (!shareState.pending.length) {
      setShareState((current) => ({ ...current, sent: true }));
      return;
    }
    setCollections((current) => current.map((collection) => collection.id === shareState.colId
      ? { ...collection, access: [...collection.access, ...shareState.pending.filter((name) => !collection.access.includes(name))], updated: 'just now' }
      : collection));
    setShareState((current) => ({ ...current, pending: [], sent: true }));
  }

  function copyShareLink() {
    try { navigator.clipboard?.writeText(shareState.link); } catch { /* best effort */ }
    setShareState((current) => ({ ...current, copied: true }));
    window.setTimeout(() => setShareState((current) => ({ ...current, copied: false })), 1800);
  }

  function removeFromCollection(colId, pid) {
    setCollections((current) => current.map((collection) => collection.id === colId ? { ...collection, products: collection.products.filter((id) => id !== pid), updated: 'just now' } : collection));
  }

  function confirmRemoveFromCollection(colId, pid) {
    const product = PRODUCT_MAP[pid];
    const collection = collections.find((item) => item.id === colId);
    setConfirm({
      title: 'Remove from collection?',
      message: `Remove "${product.brand} ${product.name}" from ${collection ? collection.name : 'this collection'}? You can add it back anytime.`,
      confirmLabel: 'Remove',
      onConfirm: () => removeFromCollection(colId, pid),
    });
  }

  function toggleExclude(pid) {
    setCompareExcluded((current) => ({ ...current, [pid]: !current[pid] }));
    setComparePinned((current) => current.filter((id) => id !== pid));
  }

  function togglePin(pid) {
    setComparePinned((current) => (current.includes(pid) ? [] : [pid]));
  }

  const values = useMemo<any>(() => {
    const base = {
      screen,
      loggedIn,
      loggedOut: !loggedIn,
      login,
      logout,
      theme,
      isDarkTheme: theme === 'dark',
      setTheme,
      userMenuOpen,
      toggleUserMenu: () => setUserMenuOpen((open) => !open),
      closeUserMenu: () => setUserMenuOpen(false),
      goDiscover,
      goCollections,
      goResultsAll,
      navDisc: ['discover', 'results', 'analysis'].includes(screen),
      navCol: ['collections', 'collectionDetail', 'compare'].includes(screen),
      query,
      setQuery,
      isUrl: /^https?:\/\/|www\.|\.com|\.co/i.test(query.trim()),
      doSearch,
      brands: BRANDS.map((name) => ({ name, selected: selectedBrands.includes(name), onClick: () => toggleBrandSelect(name) })),
      trending: TRENDING.map((label) => ({ label, onClick: () => { setQuery(label); doSearch(label); } })),
      recent: ['lulu-align', 'nike-legging', 'uniqlo-airism', 'champion-hoodie'].map((id) => makeCardVM(id, openProduct, openAdd)),
      stop: (event) => event?.stopPropagation(),
    };

    const resultValues: any = {};
    if (screen === 'results') {
      const q = resultsQuery.toLowerCase();
      let list = PRODUCTS.filter((item) => {
        if (resultsBrand && item.brand !== resultsBrand) return false;
        if (resultsBrands.length && !resultsBrands.includes(item.brand)) return false;
        if (q) {
          const haystack = `${item.brand} ${item.name} ${item.cat}s ${item.pulse}`.toLowerCase();
          if (!haystack.includes(q)) {
            const tokens = q.split(/\s+/).filter(Boolean).map((token) => token.replace(/s$/, ''));
            if (!tokens.some((token) => haystack.includes(token))) return false;
          }
        }
        return true;
      });
      const categories = ['All', ...Array.from(new Set(list.map((item) => item.cat)))];
      const categoryOptions = categories.filter((label) => label !== 'All');
      if (filterCats.length) list = list.filter((item) => filterCats.includes(item.cat));
      else if (filterCat !== 'All') list = list.filter((item) => item.cat === filterCat);
      if (filterBrand !== 'All') list = list.filter((item) => item.brand === filterBrand);
      list = list.slice().sort((a, b) => {
        if (sortBy === 'reviews') return b.reviews - a.reviews;
        if (sortBy === 'positive') return SENTIMENT_SPLIT[b.pulse][0] - SENTIMENT_SPLIT[a.pulse][0];
        if (sortBy === 'negative') return SENTIMENT_SPLIT[b.pulse][2] - SENTIMENT_SPLIT[a.pulse][2];
        return 0;
      });
      const activeBrands = resultsBrands.length ? resultsBrands : resultsBrand ? [resultsBrand] : filterBrand !== 'All' ? [filterBrand] : [];
      resultValues.resHeading = q ? `Search results for "${resultsQuery}"` : 'All Products';
      resultValues.resCount = `${list.length} product${list.length === 1 ? '' : 's'}`;
      resultValues.resCards = list.map((item) => makeCardVM(item.id, openProduct, openAdd));
      resultValues.resCategorySummary = filterCats.length ? `${filterCats.length} selected` : 'All categories';
      resultValues.resBrandSummary = activeBrands.length ? `${activeBrands.length} selected` : 'All brands';
      resultValues.resCategoryOptions = categoryOptions.map((label) => ({ label, selected: filterCats.includes(label), onToggle: () => { setFilterCat('All'); setFilterCats((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label])); } }));
      resultValues.resBrandOptions = BRANDS.map((label) => ({ label, selected: activeBrands.includes(label), onToggle: () => { setFilterBrand('All'); setResultsBrand(''); setResultsBrands((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label])); setSelectedBrands((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label])); } }));
      resultValues.resCategoryFilters = filterCats.map((label) => ({ label, onRemove: () => setFilterCats((current) => current.filter((item) => item !== label)) }));
      resultValues.resSortOpts = [['relevant', 'Most relevant'], ['reviews', 'Most reviews'], ['positive', 'Most positive'], ['negative', 'Most negative']].map(([key, label]) => ({ key, label, ...chipStyle(sortBy === key), onClick: () => setSortBy(key) }));
      resultValues.resSortValue = sortBy;
      resultValues.onSortChange = (event) => setSortBy(event.target.value);
      resultValues.resBrandFilters = activeBrands.map((brand) => ({ label: brand, onRemove: () => { setResultsBrands((current) => current.filter((item) => item !== brand)); setSelectedBrands((current) => current.filter((item) => item !== brand)); if (resultsBrand === brand) setResultsBrand(''); if (filterBrand === brand) setFilterBrand('All'); } }));
      resultValues.resClearBrand = () => { setFilterBrand('All'); setResultsBrand(''); setResultsBrands([]); setSelectedBrands([]); };
    }

    const analysisValues: any = {};
    if ((screen === 'analysis' || analysisOn) && PRODUCT_MAP[productId]) {
      const item = PRODUCT_MAP[productId];
      const confidence = confidenceFor(item.reviews);
      const confidenceTone = CONFIDENCE_TONES[confidence.tone];
      const sentiment = SENTIMENT_STATES[item.pulse];
      const split = SENTIMENT_SPLIT[item.pulse];
      const reviews = buildReviews(item);
      let reviewList = reviews;
      if (reviewSent !== 'all') reviewList = reviewList.filter((review) => review.pol === reviewSent);
      if (reviewAttr !== 'all') reviewList = reviewList.filter((review) => review.attr === reviewAttr);
      const search = reviewSearch.toLowerCase();
      if (search) reviewList = reviewList.filter((review) => `${review.text} ${review.phrase} ${review.attrLabel}`.toLowerCase().includes(search));
      analysisValues.showAnalysis = true;
      analysisValues.analysisIsOverlay = analysisOn && screen !== 'analysis';
      analysisValues.analysisIsPage = screen === 'analysis';
      analysisValues.closeAnalysisOverlay = () => { setAnalysisOn(false); setChatState((current) => ({ ...current, open: false })); };
      analysisValues.pv = {
        ...productImageVM(item.id), id: item.id, brand: item.brand, name: item.name, cat: item.cat, reviewsLabel: `${item.reviews} reviews analyzed`, origin: `View on ${item.brand.replace('’s', 's').split(' ')[0]}.com`,
        confLabel: `${confidence.label} Confidence`, confFg: confidenceTone.fg, confBg: confidenceTone.bg, low: confidence.tone === 'low' || confidence.tone === 'early',
        lowMsg: `Low confidence - only ${item.reviews} reviews available. Treat this as an early signal, not a strong recommendation.`,
        pulseLabel: pulseLabel(item.pulse), pulseFg: sentiment.fg, pulseBg: sentiment.bg, pulseText: item.pulseText,
        pos: split[0], neu: split[1], neg: split[2], onAdd: () => openAdd(item.id), onAskAi: () => openAskAi(item.id),
      };
      analysisValues.pvAttrs = ATTRIBUTES.map((attribute) => {
        const attr = item.attrs[attribute.key];
        const state = SENTIMENT_STATES[attr.state];
        return { key: attribute.key, label: attribute.label, stateLabel: state.label, fg: state.fg, bg: state.bg, p: attr.p, neu: attr.neu, n: attr.n, insight: attr.insight, ev: `${attr.ev} review mentions`, onEvidence: () => setDrawer({ open: true, productId: item.id, attr: attribute.key }) };
      });
      analysisValues.pvLoves = item.loves.map((entry) => ({ t: entry.t, c: `${entry.c} reviews` }));
      analysisValues.pvComplaints = item.complaints.map((entry) => ({ t: entry.t, c: `${entry.c} reviews` }));
      analysisValues.pvTakeaways = item.takeaways.map((text, index) => ({ n: index + 1, t: text }));
      analysisValues.pvReviews = reviewList;
      analysisValues.pvReviewCount = `${reviewList.length} of ${reviews.length} reviews`;
      analysisValues.pvSentChips = [['all', 'All'], ['positive', 'Positive'], ['neutral', 'Neutral'], ['negative', 'Negative']].map(([key, label]) => ({ label, active: reviewSent === key, ...chipStyle(reviewSent === key), onClick: () => setReviewSent(key) }));
      analysisValues.pvAttrChips = [{ label: 'All attributes', active: reviewAttr === 'all', ...chipStyle(reviewAttr === 'all'), onClick: () => setReviewAttr('all') }, ...ATTRIBUTES.map((attribute) => ({ label: attribute.label, active: reviewAttr === attribute.key, ...chipStyle(reviewAttr === attribute.key), onClick: () => setReviewAttr(attribute.key) }))];
      analysisValues.reviewSearch = reviewSearch;
      analysisValues.setReviewSearch = setReviewSearch;
    }

    const collectionValues: any = {};
    if (screen === 'collections') {
      collectionValues.colCards = collections.map((collection) => ({
        ...collection,
        owner: ownerVM(collection),
        countLabel: `${collection.products.length} product${collection.products.length === 1 ? '' : 's'}`,
        covers: (collection.products.slice(0, 4).length === 3 ? [...collection.products.slice(0, 3), collection.products[0]] : collection.products.slice(0, 4)).map((id, index) => ({ ...productImageVM(id, `-cv${index}`), ph: PRODUCT_MAP[id]?.brand || '' })),
        onOpen: () => openCollection(collection.id),
      }));
    }

    if (screen === 'collectionDetail') {
      const collection = collections.find((item) => item.id === collectionId) || collections[0];
      collectionValues.cd = { ...collection, owner: ownerVM(collection), countLabel: `${collection.products.length} products` };
      collectionValues.cdCards = collection.products.map((id) => {
        const card = makeCardVM(id, openProduct, openAdd);
        let best = null;
        let worst = null;
        let bestScore = -Infinity;
        let worstScore = Infinity;
        ATTRIBUTES.forEach((attribute) => {
          const attr = PRODUCT_MAP[id].attrs[attribute.key];
          const score = attr.p - attr.n;
          if (score > bestScore) { bestScore = score; best = attribute.label; }
          if (score < worstScore) { worstScore = score; worst = attribute.label; }
        });
        return { ...card, best, worst, onRemove: (event) => { event.stopPropagation(); confirmRemoveFromCollection(collection.id, id); } };
      });
      collectionValues.cdCompare = () => startCompare(collection.id);
      collectionValues.cdShare = () => openShare(collection.id);
      collectionValues.cdAskAi = () => openCollectionAskAi(collection.id);
    }

    const compareValues = buildCompareValues(screen, collections, collectionId, compareMode, compareAttr, compareExcluded, comparePinned, openCollection, openProduct, openCompareAskAi, setCompareMode, setCompareAttr, toggleExclude, togglePin, setDrawer);
    const overlayValues = buildOverlayValues({ addState, setAddState, confirmAdd, createCollection, collections, shareState, setShareState, addSharePerson, shareAccess, copyShareLink, setCollections, confirm, setConfirm, drawer, setDrawer, openProduct });
    const chatTitle = chatTitleFor(chatState.context, collections);
    const chatPlaceholder = chatPlaceholderFor(chatState.context);
    const chatValues = chatState.open && chatTitle ? {
      aiChatOpen: true,
      aiChat: { title: chatTitle, placeholder: chatPlaceholder, minimized: chatState.minimized, focusKey: chatState.focusKey, messages: chatState.messages, input: chatState.input, onInput: (event) => setChatState((current) => ({ ...current, input: event.target.value })), onSubmit: sendAiQuestion, onToggleMinimize: () => setChatState((current) => ({ ...current, minimized: !current.minimized, focusKey: current.minimized ? Date.now() : current.focusKey })), onMinimize: () => setChatState((current) => ({ ...current, minimized: true })), onRestore: () => setChatState((current) => ({ ...current, minimized: false, focusKey: Date.now() })), onClose: () => setChatState((current) => ({ ...current, open: false })) },
    } : { aiChatOpen: false };

    return { ...base, ...resultValues, ...analysisValues, ...collectionValues, ...compareValues, ...overlayValues, ...chatValues };
  }, [addState, analysisOn, chatState, collectionId, collections, compareAttr, compareExcluded, compareMode, comparePinned, confirm, drawer, filterBrand, filterCat, filterCats, loggedIn, location.pathname, productId, query, resultsBrand, resultsBrands, resultsQuery, reviewAttr, reviewSearch, reviewSent, screen, selectedBrands, shareState, sortBy, theme, userMenuOpen]);

  return values;
}

function ownerVM(collection): any {
  const ownedByMe = collection.owner === 'me';
  const owner = person(collection.owner);
  const access = (collection.access || []).map((name) => {
    const accessPerson = person(name);
    return { name: accessPerson.me ? `${accessPerson.name} (You)` : accessPerson.name, initials: accessPerson.initials, color: avatarColor(accessPerson.initials), email: accessPerson.email };
  });
  const faces = [{ name: owner.me ? `${owner.name} (Owner)` : `${owner.name} (Owner)`, initials: owner.initials, color: avatarColor(owner.initials) }, ...access];
  return {
    ownedByMe,
    ownerLabel: ownedByMe ? 'Owned by you' : `Owned by ${owner.name}`,
    access,
    accessCount: access.length,
    accessLabel: access.length === 0 ? (ownedByMe ? 'Only you' : 'Just the owner') : `${access.length} ${access.length === 1 ? 'person has' : 'people have'} access`,
    peopleTooltip: faces.map((face) => face.name).join('\n'),
    faces: faces.slice(0, 4),
    faceOverflow: Math.max(0, faces.length - 4),
  };
}

function chatTitleFor(context, collections) {
  if (!context) return '';
  if (context.type === 'product') return PRODUCT_MAP[context.id]?.name || '';
  const collection = collections.find((item) => item.id === context.id);
  if (!collection) return '';
  return context.type === 'compare' ? `${collection.name} comparison` : collection.name;
}

function chatPlaceholderFor(context) {
  if (context?.type === 'collection') return 'Ask about this collection or collection products';
  if (context?.type === 'compare') return 'Ask about this comparison or collection products';
  return 'Ask about this product';
}

function buildAiChatAnswer(context, collections, compareExcluded) {
  if (!context) return '';
  if (context.type === 'product') {
    const item = PRODUCT_MAP[context.id];
    if (!item) return '';
    const split = SENTIMENT_SPLIT[item.pulse];
    return `${item.name} is trending ${pulseLabel(item.pulse).toLowerCase()} with ${split[0]}% positive signal. Customers most often praise ${item.loves[0]?.t.toLowerCase() || 'the product experience'}, while the main concern is ${item.complaints[0]?.t.toLowerCase() || 'mixed review feedback'}.`;
  }
  const collection = collections.find((item) => item.id === context.id);
  if (!collection) return '';
  const ids = context.type === 'compare' ? collection.products.filter((id) => !compareExcluded[id]) : collection.products;
  const products = ids.map((id) => PRODUCT_MAP[id]).filter(Boolean);
  if (!products.length) return `There are no selected products in ${collection.name} to summarize right now.`;
  const positiveShare = Math.round(products.reduce((sum, product) => sum + SENTIMENT_SPLIT[product.pulse][0], 0) / products.length);
  const topPraise = products[0]?.loves[0]?.t.toLowerCase() || 'comfort';
  const topConcern = products[0]?.complaints[0]?.t.toLowerCase() || 'fit consistency';
  if (context.type === 'compare') return `${collection.name} comparison has ${products.length} selected products averaging ${positiveShare}% positive signal. The clearest strength is ${topPraise}, while ${topConcern} is the main area to inspect across products.`;
  return `${collection.name} includes ${products.length} products averaging ${positiveShare}% positive signal. A useful starting point is ${topPraise}, with ${topConcern} as the key concern to watch.`;
}

function buildCompareValues(screen, collections, collectionId, compareMode, compareAttr, compareExcluded, comparePinned, openCollection, openProduct, openCompareAskAi, setCompareMode, setCompareAttr, toggleExclude, togglePin, setDrawer): any {
  if (screen !== 'compare') return {};
  const collection = collections.find((item) => item.id === collectionId) || collections[0];
  const allIds = collection.products;
  const activeIds = allIds.filter((id) => !compareExcluded[id]);
  const pinnedIds = comparePinned.filter((id) => activeIds.includes(id));
  const aggregate = ATTRIBUTES.map((attribute) => {
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    activeIds.forEach((id) => {
      const attr = PRODUCT_MAP[id].attrs[attribute.key];
      positive += attr.p;
      negative += attr.n;
      neutral += attr.neu;
    });
    const count = Math.max(1, activeIds.length);
    const p = Math.round(positive / count);
    const neg = Math.round(negative / count);
    const neu = Math.round(neutral / count);
    const score = p - neg;
    const state = score >= 40 ? 'strongpos' : score >= 15 ? 'pos' : score >= -6 ? 'mixed' : score >= -28 ? 'concern' : 'strongconcern';
    return { key: attribute.key, label: attribute.label, p, neu, neg, score, state, fg: SENTIMENT_STATES[state].fg, bg: SENTIMENT_STATES[state].bg, stateLabel: SENTIMENT_STATES[state].label };
  });
  const sorted = aggregate.slice().sort((a, b) => b.score - a.score);
  const strongest = sorted.slice(0, 3);
  const weakest = sorted.slice(-3).reverse();
  const modeDefs = [['summary', 'Summary'], ['heatmap', 'Heatmap'], ['side', 'Side-by-side'], ['attribute', 'Attribute view'], ['opportunity', 'Opportunities']];
  const out: any = {
    cmp: { name: collection.name, countLabel: `${activeIds.length} of ${allIds.length} selected`, startCompareBack: () => openCollection(collection.id), askAi: () => openCompareAskAi(collection.id) },
    cmpSelector: allIds.map((id) => ({ id, brand: PRODUCT_MAP[id].brand, name: PRODUCT_MAP[id].name, on: !compareExcluded[id], pin: comparePinned.includes(id), onToggle: () => toggleExclude(id), onPin: () => togglePin(id) })),
    cmpModes: modeDefs.map(([key, label]) => ({ key, label, ...chipStyle(compareMode === key), onClick: () => setCompareMode(key) })),
    cmpIsSum: compareMode === 'summary', cmpIsHeat: compareMode === 'heatmap', cmpIsSide: compareMode === 'side', cmpIsAttr: compareMode === 'attribute', cmpIsOpp: compareMode === 'opportunity',
  };
  if (compareMode === 'summary') {
    out.sumText = `Across these ${activeIds.length} selected products, ${strongest[0]?.label.toLowerCase()} and ${strongest[1]?.label.toLowerCase()} are the strongest positives. ${weakest[0]?.label} and ${weakest[1]?.label.toLowerCase()} are the most repeated concerns. Premium products perform better on fabric feel, but customers are more critical of price.`;
    out.sumStrong = strongest.map((item) => ({ label: item.label, state: item.stateLabel, fg: item.fg, bg: item.bg }));
    out.sumWeak = weakest.map((item) => ({ label: item.label, state: item.stateLabel, fg: item.fg, bg: item.bg }));
    out.sumPraises = strongest.map((item) => ({ label: item.label, text: PHRASES[item.key].pos[0] }));
    out.sumComplaints = weakest.map((item) => ({ label: item.label, text: PHRASES[item.key].neg[0] }));
    out.sumAgg = aggregate.slice().sort((a, b) => (b.p - b.neg) - (a.p - a.neg)).map((item) => ({ ...item, netLabel: `${item.p - item.neg > 0 ? '+' : ''}${item.p - item.neg}`, netPos: item.p - item.neg >= 0, state: item.stateLabel }));
    out.goOpp = () => setCompareMode('opportunity');
    out.sumOppCount = `${weakest.length} opportunities identified`;
  }
  if (compareMode === 'heatmap') {
    const shortState = { strongpos: 'Strong +', pos: 'Positive', mixed: 'Mixed', neutral: 'Neutral', concern: 'Concern', strongconcern: 'Strong -', lowconf: 'Low data' };
    out.hmCols = activeIds.map((id) => ({ ...PRODUCT_MAP[id], ...productImageVM(id), short: shortName(PRODUCT_MAP[id]), low: PRODUCT_MAP[id].reviews < 50, onOpen: () => openProduct(id) }));
    out.hmRows = ATTRIBUTES.map((attribute) => ({ label: attribute.label, cells: activeIds.map((id) => { const attr = PRODUCT_MAP[id].attrs[attribute.key]; const state = SENTIMENT_STATES[attr.state]; return { short: shortState[attr.state], stateLabel: state.label, fg: state.fg, bg: state.bg, low: PRODUCT_MAP[id].reviews < 50, onClick: () => setDrawer({ open: true, productId: id, attr: attribute.key }) }; }) }));
    out.hmColCount = activeIds.length;
  }
  if (compareMode === 'side') {
    const order = [...pinnedIds, ...activeIds.filter((id) => !pinnedIds.includes(id))];
    out.sideCols = order.map((id) => {
      const card = makeCardVM(id, openProduct, () => {}, false);
      const pinned = pinnedIds.includes(id);
      return {
        ...card,
        pin: pinned,
        pinBg: pinned ? 'var(--ink)' : 'var(--surface-2)',
        pinFg: pinned ? 'var(--paper)' : 'var(--muted)',
        onPin: () => togglePin(id),
      };
    });
    out.sideRows = ATTRIBUTES.map((attribute) => ({ label: attribute.label, cells: order.map((id) => { const attr = PRODUCT_MAP[id].attrs[attribute.key]; const state = SENTIMENT_STATES[attr.state]; return { pin: pinnedIds.includes(id), stateLabel: state.label, fg: state.fg, bg: state.bg, insight: attr.insight, onClick: () => setDrawer({ open: true, productId: id, attr: attribute.key }) }; }) }));
    out.sideColCount = order.length;
  }
  if (compareMode === 'attribute') {
    out.attrChips = ATTRIBUTES.map((attribute) => ({ label: attribute.label, ...chipStyle(compareAttr === attribute.key), onClick: () => setCompareAttr(attribute.key) }));
    const groups = { best: [], mixed: [], concern: [] };
    activeIds.forEach((id) => {
      const item = PRODUCT_MAP[id];
      const attr = item.attrs[compareAttr];
      const state = SENTIMENT_STATES[attr.state];
      const vm = { id, brand: item.brand, name: item.name, ...productImageVM(id), stateLabel: state.label, fg: state.fg, bg: state.bg, insight: attr.insight, ev: `${attr.ev} mentions`, confLabel: confidenceFor(item.reviews).label, onOpen: () => openProduct(id) };
      if (['strongpos', 'pos'].includes(attr.state)) groups.best.push(vm);
      else if (['mixed', 'neutral', 'lowconf'].includes(attr.state)) groups.mixed.push(vm);
      else groups.concern.push(vm);
    });
    out.attrGroups = [{ label: 'Best performing', color: 'var(--pos)', items: groups.best }, { label: 'Mixed', color: 'var(--amber)', items: groups.mixed }, { label: 'Concerns', color: 'var(--con)', items: groups.concern }].filter((group) => group.items.length).map((group) => ({ ...group, countLabel: `${group.items.length} product${group.items.length === 1 ? '' : 's'}` }));
  }
  if (compareMode === 'opportunity') {
    const improveTitles = { fit: 'Improve fit consistency', comfort: 'Protect all-day comfort', fabric: 'Elevate the fabric hand', quality: 'Raise perceived quality', aesthetic: 'Keep the aesthetic clean and minimal', durability: 'Strengthen durability', workmanship: 'Tighten the stitching and finish', price: 'Balance premium feel and price', performance: 'Boost real-world performance', functionality: 'Refine the functional details' };
    const keepTitles = { fit: 'Keep the flattering fit', comfort: 'Keep comfort as a core strength', fabric: 'Keep the soft fabric direction', quality: 'Maintain the quality perception', aesthetic: 'Maintain the minimal aesthetic', durability: 'Preserve the durability edge', workmanship: 'Hold the finish quality', price: 'Protect the value positioning', performance: 'Keep performance strong', functionality: 'Keep the useful details' };
    out.opportunities = [...weakest.map((item, index) => ({ n: index + 1, type: 'improve', title: improveTitles[item.key], reason: `${item.label} draws the most concern across these products - "${PHRASES[item.key].neg[0]}" recurs in reviews.` })), ...strongest.slice(0, 2).map((item, index) => ({ n: weakest.length + index + 1, type: 'keep', title: keepTitles[item.key], reason: `${item.label} is one of the strongest positive drivers - customers consistently note "${PHRASES[item.key].pos[0]}".` }))].map((item) => ({ ...item, tagBg: item.type === 'improve' ? 'var(--con-bg)' : 'var(--pos-bg)', tagFg: item.type === 'improve' ? 'var(--con)' : 'var(--pos)', tagLabel: item.type === 'improve' ? 'Improve' : 'Keep' }));
  }
  return out;
}

function buildOverlayValues({ addState, setAddState, confirmAdd, createCollection, collections, shareState, setShareState, addSharePerson, shareAccess, copyShareLink, setCollections, confirm, setConfirm, drawer, setDrawer, openProduct }): any {
  const out: any = { addOpen: addState.open, shareOpen: shareState.open, confirmOpen: !!confirm, drawerOpen: drawer.open };
  if (addState.open) {
    const search = addState.search.toLowerCase();
    out.addProduct = addState.productId ? PRODUCT_MAP[addState.productId] : { name: '' };
    out.addEmpty = collections.length === 0;
    out.addHasCols = collections.length > 0;
    out.notNewColMode = !addState.newMode;
    out.addCols = collections.filter((collection) => !search || collection.name.toLowerCase().includes(search)).map((collection) => ({ ...collection, count: `${collection.products.length} product${collection.products.length === 1 ? '' : 's'}`, checked: !!addState.checked[collection.id], onToggle: () => setAddState((current) => ({ ...current, checked: { ...current.checked, [collection.id]: !current.checked[collection.id] } })) }));
    out.addSearch = addState.search;
    out.onAddSearch = (event) => setAddState((current) => ({ ...current, search: event.target.value }));
    out.closeAdd = () => setAddState((current) => ({ ...current, open: false, newMode: false }));
    out.confirmAdd = confirmAdd;
    out.startNewCol = () => setAddState((current) => ({ ...current, newMode: true }));
    out.cancelNewCol = () => setAddState((current) => ({ ...current, newMode: false, name: '', desc: '' }));
    out.createCollection = createCollection;
    out.newColMode = addState.newMode;
    out.newColName = addState.name;
    out.newColDesc = addState.desc;
    out.onNewColName = (event) => setAddState((current) => ({ ...current, name: event.target.value }));
    out.onNewColDesc = (event) => setAddState((current) => ({ ...current, desc: event.target.value }));
    out.confirmLabel = Object.values(addState.checked).some(Boolean) ? 'Done' : 'Close';
  }
  if (shareState.open && shareState.colId) {
    const collection = collections.find((item) => item.id === shareState.colId);
    if (collection) {
      const owner = person(collection.owner);
      const current = [{ name: owner.me ? `${owner.name} (You)` : owner.name, initials: owner.initials, color: avatarColor(owner.initials), email: owner.email, role: 'Owner', removable: false }].concat(collection.access.map((name) => { const accessPerson = person(name); return { name: accessPerson.me ? `${accessPerson.name} (You)` : accessPerson.name, initials: accessPerson.initials, color: avatarColor(accessPerson.initials), email: accessPerson.email, role: 'Can view & edit', removable: !accessPerson.me, onRemove: () => setCollections((items) => items.map((item) => item.id === collection.id ? { ...item, access: item.access.filter((entry) => entry !== name), updated: 'just now' } : item)) }; }));
      const taken = new Set([collection.owner === 'me' ? PEOPLE.me.name : collection.owner, ...collection.access, ...shareState.pending]);
      const q = shareState.input.trim().toLowerCase();
      const suggestions = q ? PEOPLE.roster.filter((item) => !taken.has(item.name) && (item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q))).slice(0, 4).map((item) => ({ ...item, color: avatarColor(item.initials), onAdd: () => addSharePerson(item.name) })) : [];
      out.share = { colName: collection.name, accessCount: current.length, current, suggestions, hasSuggestions: suggestions.length > 0, pending: shareState.pending.map((name) => { const pendingPerson = person(name); return { name: pendingPerson.name, initials: pendingPerson.initials, color: avatarColor(pendingPerson.initials), onRemove: () => setShareState((state) => ({ ...state, pending: state.pending.filter((entry) => entry !== name) })) }; }), hasPending: shareState.pending.length > 0, input: shareState.input, onInput: (event) => setShareState((state) => ({ ...state, input: event.target.value })), onKey: (event) => { if (event.key === 'Enter') { event.preventDefault(); addSharePerson(); } }, onAddTyped: () => addSharePerson(), canAddTyped: shareState.input.trim().length > 0, shareLabel: shareState.pending.length ? `Share access with ${shareState.pending.length} ${shareState.pending.length === 1 ? 'person' : 'people'}` : 'Done', onShare: shareAccess, sent: shareState.sent, copied: shareState.copied, copyLabel: shareState.copied ? 'Link copied' : 'Copy shareable link', onCopy: copyShareLink, onClose: () => setShareState((state) => ({ ...state, open: false, pending: [], input: '', sent: false })) };
    }
  }
  if (confirm) {
    out.confirm = { title: confirm.title, message: confirm.message, confirmLabel: confirm.confirmLabel || 'Confirm' };
    out.closeConfirm = () => setConfirm(null);
    out.doConfirm = () => { const next = confirm; setConfirm(null); next?.onConfirm?.(); };
  }
  if (drawer.open && drawer.productId && drawer.attr) {
    const item = PRODUCT_MAP[drawer.productId];
    const attr = item.attrs[drawer.attr];
    const state = SENTIMENT_STATES[attr.state];
    const confidence = confidenceFor(item.reviews);
    const tone = CONFIDENCE_TONES[confidence.tone];
    const hasNegative = ['concern', 'strongconcern', 'mixed'].includes(attr.state);
    const hasPositive = ['strongpos', 'pos', 'mixed'].includes(attr.state);
    out.drawer = { brand: item.brand, product: item.name, attr: ATTRIBUTE_LABELS[drawer.attr], stateLabel: state.label, fg: state.fg, bg: state.bg, summary: attr.insight, phrases: hasNegative ? PHRASES[drawer.attr].neg : PHRASES[drawer.attr].pos, hasPos: hasPositive, hasNeg: hasNegative, posEvidence: PHRASES[drawer.attr].pos.slice(0, 3).map((phrase) => `Honestly, ${phrase} - no complaints here.`), negEvidence: PHRASES[drawer.attr].neg.slice(0, 3).map((phrase) => `A bit disappointing - ${phrase}.`), mentions: `${attr.ev} related review mentions`, confLabel: `${confidence.label} confidence`, confFg: tone.fg, confBg: tone.bg, openAnalysis: () => { setDrawer({ open: false, productId: null, attr: null }); openProduct(item.id); } };
    out.closeDrawer = () => setDrawer({ open: false, productId: null, attr: null });
  }
  return out;
}
