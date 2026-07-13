export const ATTRIBUTES = [
  { key: 'fit', label: 'Fit' },
  { key: 'comfort', label: 'Comfort' },
  { key: 'fabric', label: 'Fabric' },
  { key: 'quality', label: 'Quality' },
  { key: 'aesthetic', label: 'Aesthetic' },
  { key: 'durability', label: 'Durability' },
  { key: 'workmanship', label: 'Workmanship' },
  { key: 'price', label: 'Price' },
  { key: 'performance', label: 'Performance' },
  { key: 'functionality', label: 'Functionality' },
];

export const ATTRIBUTE_LABELS = Object.fromEntries(ATTRIBUTES.map((item) => [item.key, item.label]));

export const SENTIMENT_STATES = {
  strongpos: { label: 'Strong Positive', fg: '#2F6B4C', bg: '#E2EEE6' },
  pos: { label: 'Positive', fg: '#3F7A5C', bg: '#E9F1EB' },
  mixed: { label: 'Mixed', fg: '#9A6B1E', bg: '#F4EAD3' },
  neutral: { label: 'Neutral', fg: '#5F6873', bg: '#ECEEF1' },
  concern: { label: 'Concern', fg: '#BC4A2C', bg: '#F6E7E0' },
  strongconcern: { label: 'Strong Concern', fg: '#9F3117', bg: '#F4DED6' },
  lowconf: { label: 'Low Confidence', fg: '#8C7A3F', bg: '#EFEAD9' },
};

export const SENTIMENT_SPLIT = {
  strongpos: [80, 13, 7],
  pos: [64, 22, 14],
  mixed: [44, 19, 37],
  neutral: [28, 52, 20],
  concern: [26, 22, 52],
  strongconcern: [15, 15, 70],
  lowconf: [42, 34, 24],
};

export const CONFIDENCE_TONES = {
  strong: { fg: '#2F6B4C', bg: '#E2EEE6' },
  good: { fg: '#3C6485', bg: '#E5EDF3' },
  mod: { fg: '#5F6873', bg: '#ECEEF1' },
  early: { fg: '#9A6B1E', bg: '#F4EAD3' },
  low: { fg: '#B0562F', bg: '#F6E7E0' },
};

export const BRANDS = ['Nike', 'Adidas', 'H&M', 'Zara', 'Uniqlo', 'Gymshark', 'Lululemon', 'Champion', 'Victoria\u2019s Secret', 'Puma', 'Under Armour'];
export const TRENDING = ['running leggings', 'black sports bra', 'oversized hoodie', 'performance t-shirt', 'training shorts'];

const IMAGE_HASHES = {
  'nike-legging': '1618259181324-86a49fe68099',
  'adidas-legging': '1597297260448-3cc8d0a38388',
  'nike-oneluxe': '1506629082955-511b1aa562c8',
  'lulu-align': '1645318800735-737d3a422de6',
  'gymshark-seamless': '1699065186329-097ea2d9c07f',
  'zara-seamless': '1552364142-f06dd635a796',
  'hm-drymove': '1699065186865-7a1804806805',
  'uniqlo-airism': '1645207803533-e2cfe1382f2c',
  'vs-bra': '1584863495140-a320b13a11a8',
  'champion-hoodie': '1515614557830-ae0df9016e19',
  'ua-tech': '1699065186298-7f963b0d8c81',
};

const IMAGE_CREDITS = {
  'nike-legging': ['Alexandra Tran', 'https://unsplash.com/@alexgoesglobal'],
  'adidas-legging': ['Alexandra Tran', 'https://unsplash.com/@alexgoesglobal'],
  'nike-oneluxe': ['Alexandra Tran', 'https://unsplash.com/@alexgoesglobal'],
  'lulu-align': ['Andre Tan', 'https://unsplash.com/@andredantan19'],
  'gymshark-seamless': ['Benny Hassum', 'https://unsplash.com/@bennyhassum'],
  'zara-seamless': ['Lauren', 'https://unsplash.com/@lauren_alexandra'],
  'hm-drymove': ['Benny Hassum', 'https://unsplash.com/@bennyhassum'],
  'uniqlo-airism': ['Dagmar Klauzova', 'https://unsplash.com/@dagakla'],
  'vs-bra': ['Subtle Cinematics', 'https://unsplash.com/@subtlecinematics'],
  'champion-hoodie': ['Jeremy Bishop', 'https://unsplash.com/@jeremybishop'],
  'ua-tech': ['Benny Hassum', 'https://unsplash.com/@bennyhassum'],
};

function confidence(reviewCount) {
  if (reviewCount >= 1000) return { label: 'Very Strong', tone: 'strong' };
  if (reviewCount >= 500) return { label: 'Strong', tone: 'strong' };
  if (reviewCount >= 100) return { label: 'Good', tone: 'good' };
  if (reviewCount >= 50) return { label: 'Moderate', tone: 'mod' };
  if (reviewCount >= 20) return { label: 'Early Signal', tone: 'early' };
  return { label: 'Low Confidence', tone: 'low' };
}

function defaultInsight(key, state) {
  const label = {
    fit: 'the fit',
    comfort: 'comfort',
    fabric: 'the fabric',
    quality: 'build quality',
    aesthetic: 'the styling',
    durability: 'durability',
    workmanship: 'the stitching',
    price: 'the value',
    performance: 'performance',
    functionality: 'the functional details',
  }[key];
  const cap = label.charAt(0).toUpperCase() + label.slice(1);
  if (state === 'strongpos') return `Reviewers are strongly positive about ${label}.`;
  if (state === 'pos') return `Customers respond well to ${label}.`;
  if (state === 'mixed') return `Opinions on ${label} are split.`;
  if (state === 'neutral') return `${cap} draws few strong opinions.`;
  if (state === 'concern') return `Several reviews raise concerns about ${label}.`;
  if (state === 'strongconcern') return `${cap} is a repeated, serious complaint.`;
  return `Limited data on ${label} so far.`;
}

function attribute(state, insight, mentions) {
  const [positive, neutral, negative] = SENTIMENT_SPLIT[state];
  return { state, p: positive, neu: neutral, n: negative, insight, ev: mentions };
}

function attributesFrom(base, reviews, overrides = {}) {
  const values = Object.fromEntries(
    ATTRIBUTES.map((item) => [
      item.key,
      attribute(base, defaultInsight(item.key, base), Math.max(3, Math.round(reviews * 0.11))),
    ]),
  );
  return { ...values, ...overrides };
}

function splitList(items) {
  return items.map((entry) => {
    const index = entry.lastIndexOf('|');
    return { t: entry.slice(0, index), c: Number(entry.slice(index + 1)) };
  });
}

function product(id, brand, name, cat, reviews, pulse, pulseText, attrs, loves, complaints, takeaways) {
  return { id, brand, name, cat, reviews, pulse, pulseText, attrs, loves: splitList(loves), complaints: splitList(complaints), takeaways };
}

export const PRODUCTS = [
  product('nike-legging', 'Nike', 'Dri-FIT High-Waist Running Legging', 'Legging', 540, 'pos', 'Customers are generally positive about comfort and fabric feel, but fit consistency is a repeated concern.', attributesFrom('pos', 540, {
    fit: attribute('mixed', 'Many like the shape, but several say the sizing runs small.', 82),
    comfort: attribute('pos', 'Soft and breathable, even on longer runs.', 96),
    fabric: attribute('strongpos', 'The sweat-wicking fabric feels genuinely premium.', 128),
    aesthetic: attribute('strongpos', 'The clean, minimal look is widely praised.', 84),
    durability: attribute('mixed', 'A few mention the fabric thinning after repeated washes.', 27),
    price: attribute('mixed', 'Seen as pricey unless the quality clearly justifies it.', 24),
  }), ['Soft fabric feel|128', 'Comfortable for long wear|96', 'Minimal, clean design|84', 'Good four-way stretch|72', 'Flattering high-rise shape|61'], ['Sizing runs small|58', 'Waistband feels tight|41', 'Stitching loosens after washing|27', 'High price for the quality|24', 'Fabric thins over time|19'], ['Keep the soft, breathable fabric direction', 'Improve sizing consistency across the size run', 'Avoid an overly tight waistband construction', 'Reinforce stitching for better wash durability', 'Maintain the clean, minimal aesthetic', 'Only hold premium pricing if quality reads clearly superior']),
  product('nike-oneluxe', 'Nike', 'One Luxe Mid-Rise Training Legging', 'Legging', 286, 'pos', 'A plush, supportive training legging - customers love the hold but split on the price.', attributesFrom('pos', 286, {
    fit: attribute('pos', 'Supportive, holds you in without feeling restrictive.', 70), comfort: attribute('strongpos', 'The brushed inner face feels plush and soft.', 88), fabric: attribute('pos', 'A thicker, opaque fabric people trust for the gym.', 64), performance: attribute('pos', 'Stays put through squats and lifts.', 40), durability: attribute('pos', 'Holds shape well after repeated washes.', 34), price: attribute('mixed', 'Some feel it is expensive for a training legging.', 26),
  }), ['Plush brushed feel|88', 'Supportive hold|70', 'Fully opaque|64', 'Stays put in the gym|40', 'Keeps its shape|34'], ['Pricey for training|26', 'Runs warm|17', 'Waistband can roll on deep squats|13', 'Limited colours|9', 'Heavier fabric|8'], ['Keep the plush brushed hand and full opacity', 'Preserve the supportive hold', 'Address waistband roll under deep flexion', 'Offer a lighter-weight summer option', 'Watch the price ceiling for training tiers']),
  product('adidas-legging', 'Adidas', 'Training Essentials High-Rise Legging', 'Legging', 312, 'mixed', 'Comfortable and good value, but the waistband fit divides opinion sharply.', attributesFrom('mixed', 312, {
    fit: attribute('concern', 'The waistband feels too tight for a lot of reviewers.', 74), comfort: attribute('pos', 'Comfortable through most workouts.', 52), price: attribute('pos', 'Widely seen as good value for money.', 48), aesthetic: attribute('pos', 'Simple three-stripe styling reads clean.', 34), durability: attribute('mixed', 'Holds up okay, though some pilling is reported.', 22),
  }), ['Good value|61', 'Comfortable for workouts|52', 'Clean, simple styling|34', 'Stays in place|28', 'Breathable|24'], ['Waistband too tight|74', 'Runs small|39', 'Some pilling|22', 'Thin in lighter colours|17', 'Short inseam|12'], ['Loosen waistband tension', 'Keep the strong value positioning', 'Improve opacity in lighter colours', 'Watch pilling on the fabric blend', 'Keep the styling clean and simple']),
  product('lulu-align', 'Lululemon', 'Align High-Rise Pant', 'Legging', 1240, 'strongpos', 'A benchmark for comfort and fabric feel - price is the main point of friction.', attributesFrom('pos', 1240, {
    fit: attribute('pos', 'Flattering and true to size for most.', 180), comfort: attribute('strongpos', 'Exceptionally comfortable for all-day wear.', 310), fabric: attribute('strongpos', 'The buttery-soft handfeel is the signature draw.', 288), aesthetic: attribute('strongpos', 'A minimal, elevated look people wear beyond the gym.', 150), quality: attribute('strongpos', 'Perceived as a premium, well-made product.', 120), durability: attribute('pos', 'Generally durable, though a few note pilling.', 96), price: attribute('concern', 'The premium price is the most common complaint.', 132),
  }), ['Buttery-soft fabric|288', 'All-day comfort|310', 'Elevated, minimal look|150', 'True to size|180', 'Feels premium|120'], ['Very high price|132', 'Pilling over time|54', 'Sheer in some colours|38', 'Delicate fabric|29', 'Limited support|18'], ['Match the soft, weightless handfeel', 'Preserve the elevated, minimal aesthetic', 'Improve pilling resistance', 'Address sheerness in light colours', 'Justify any premium with visible quality']),
  product('gymshark-seamless', 'Gymshark', 'Vital Seamless 2.0 Legging', 'Legging', 208, 'pos', 'The sculpting fit and value land well; opacity under stretch is the watch-out.', attributesFrom('pos', 208, {
    fit: attribute('pos', 'The sculpting seamless fit is a favourite.', 60), comfort: attribute('pos', 'Comfortable and stays put.', 44), aesthetic: attribute('pos', 'A popular, flattering silhouette.', 36), fabric: attribute('mixed', 'Can feel thin or sheer when stretched.', 30), durability: attribute('mixed', 'Some report snags over time.', 18), price: attribute('pos', 'Good value for the look.', 22),
  }), ['Sculpting fit|60', 'Flattering silhouette|36', 'Comfortable|44', 'Good value|22', 'Holds shape|16'], ['Sheer when stretched|30', 'Snags easily|18', 'Runs small|15', 'Waistband rolls down|12', 'Limited colours|8'], ['Keep the sculpting seamless construction', 'Increase opacity under stretch', 'Reduce snagging on the knit', 'Refine the waistband to stop rolling']),
  product('zara-seamless', 'Zara', 'Seamless Sports Legging', 'Legging', 46, 'mixed', 'Early signal only - reviewers like the price but flag durability and sizing.', attributesFrom('mixed', 46, { price: attribute('pos', 'An attractive price point.', 14), aesthetic: attribute('pos', 'An on-trend look.', 12), durability: attribute('concern', 'Early reviews mention quick wear.', 9), fit: attribute('mixed', 'Sizing feels inconsistent.', 10), quality: attribute('concern', 'Build quality reads budget.', 8) }), ['Low price|14', 'On-trend look|12', 'Lightweight|7'], ['Wears out quickly|9', 'Inconsistent sizing|10', 'Feels budget|8', 'Sheer|5'], ['Treat this as an early signal only', 'If chasing this price tier, protect durability', 'Sizing consistency is the quickest win']),
  product('hm-drymove', 'H&M', 'DryMove Training Tights', 'Legging', 96, 'mixed', 'Solid value basics; fit and durability are the inconsistent notes.', attributesFrom('mixed', 96, { price: attribute('pos', 'Strong value for a training basic.', 20), performance: attribute('pos', 'The moisture-wicking works as promised.', 16), fit: attribute('mixed', 'Fit varies between sizes.', 18), durability: attribute('concern', 'Some report thinning after washes.', 14), fabric: attribute('mixed', 'Serviceable but not premium.', 12) }), ['Great value|20', 'Effective wicking|16', 'Good for the gym|11', 'Range of colours|8'], ['Inconsistent fit|18', 'Thins after washing|14', 'Basic fabric feel|9', 'Waistband slips|7'], ['Keep the value + wicking story', 'Tighten size grading for consistency', 'Improve wash durability']),
  product('uniqlo-airism', 'Uniqlo', 'AIRism Cotton Crew Neck T-Shirt', 'T-Shirt', 780, 'pos', 'Loved for its soft, cooling fabric and price; fit reads a little boxy.', attributesFrom('pos', 780, { fabric: attribute('strongpos', 'The cooling AIRism-cotton feel is the star.', 180), price: attribute('strongpos', 'Outstanding value.', 120), comfort: attribute('strongpos', 'Light and comfortable in the heat.', 150), fit: attribute('mixed', 'A little boxy or short for some.', 70), durability: attribute('pos', 'Holds its shape well for the price.', 48), aesthetic: attribute('pos', 'A clean wardrobe staple.', 40) }), ['Cooling, soft fabric|180', 'Comfortable in heat|150', 'Excellent value|120', 'Holds its shape|48', 'Wardrobe staple|40'], ['Boxy fit|70', 'Runs short|33', 'Limited colours|20', 'Slightly sheer in white|15', 'Collar loosens|10'], ['Keep the cooling handfeel and value', 'Refine the body length and boxy fit', 'Strengthen collar retention', 'Reduce sheerness in white']),
  product('vs-bra', 'Victoria\u2019s Secret', 'VSX Medium-Support Sports Bra', 'Sports Bra', 415, 'mixed', 'Comfort and look are strong; support level and cup sizing split opinion.', attributesFrom('mixed', 415, { comfort: attribute('pos', 'Soft and comfortable for low-impact wear.', 88), aesthetic: attribute('strongpos', 'The design and colours are a big draw.', 96), fit: attribute('mixed', 'Cup sizing runs inconsistent.', 80), performance: attribute('concern', 'Support falls short for higher-impact activity.', 66), fabric: attribute('pos', 'A soft, pleasant fabric.', 40), durability: attribute('mixed', 'Some report stretching after washes.', 24) }), ['Looks great|96', 'Comfortable|88', 'Soft fabric|40', 'Nice colours|30', 'Good for low impact|26'], ['Not enough support|66', 'Cup sizing off|80', 'Stretches out|24', 'Straps dig in|18', 'Runs small|20'], ['Keep the design-led aesthetic', 'Increase medium-impact support', 'Fix cup-size consistency', 'Improve strap comfort and wash recovery']),
  product('champion-hoodie', 'Champion', 'Reverse Weave Pullover Hoodie', 'Hoodie', 660, 'pos', 'Heavyweight durability and the classic fit are big wins; it runs warm and heavy.', attributesFrom('pos', 660, { durability: attribute('strongpos', 'The heavyweight build lasts for years.', 150), quality: attribute('strongpos', 'Feels substantial and well made.', 120), fit: attribute('pos', 'The classic, roomy fit lands well.', 90), fabric: attribute('pos', 'A thick, cozy fleece.', 80), price: attribute('pos', 'Fair for the durability.', 44), functionality: attribute('mixed', 'Runs warm and heavy for some.', 30) }), ['Extremely durable|150', 'Substantial quality|120', 'Classic fit|90', 'Cozy fleece|80', 'Holds up in the wash|60'], ['Runs warm|30', 'Heavy|22', 'Boxy for some|18', 'Limited colours|12', 'Shrinks if hot-washed|14'], ['Protect the heavyweight durability reputation', 'Offer a lighter-weight option', 'Keep the classic fit', 'Flag wash-temperature guidance clearly']),
  product('ua-tech', 'Under Armour', 'Tech 2.0 Short-Sleeve Tee', 'T-Shirt', 154, 'mixed', 'Good performance value; the fabric feel and odour control divide users.', attributesFrom('mixed', 154, { performance: attribute('pos', 'Wicks and dries quickly.', 34), price: attribute('pos', 'Good value in a multipack.', 26), fit: attribute('mixed', 'Fit runs slightly long and loose.', 24), fabric: attribute('mixed', 'The synthetic feel is not for everyone.', 22), durability: attribute('pos', 'Durable through repeated washes.', 20), comfort: attribute('mixed', 'Comfortable but can feel plasticky.', 18) }), ['Fast-drying|34', 'Good value|26', 'Durable|20', 'Lightweight|14', 'Range of colours|10'], ['Synthetic feel|22', 'Odour retention|17', 'Loose fit|24', 'Not very soft|13', 'Static cling|8'], ['Keep the performance + value core', 'Improve the fabric hand and odour control', 'Refine the loose fit']),
];

export const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((item) => [item.id, item]));

export const COLLECTIONS_SEED = [
  { id: 'c1', name: 'Running Leggings Research', desc: 'Competitor research for next season\u2019s high-support running legging.', owner: 'me', access: ['Priya Nair', 'Sofia Bianchi', 'Liam Ortega'], updated: '2 days ago', products: ['nike-legging', 'nike-oneluxe', 'adidas-legging', 'lulu-align', 'gymshark-seamless', 'zara-seamless', 'hm-drymove'] },
  { id: 'c2', name: 'Sports Bra Competitor Review', desc: 'Medium-support sports bra benchmark for the SS26 line.', owner: 'me', access: ['Priya Nair', 'Noah Feldman'], updated: '5 days ago', products: ['vs-bra', 'gymshark-seamless', 'adidas-legging'] },
  { id: 'c3', name: 'Premium Athleisure Benchmark', desc: 'What premium buyers reward - and complain about.', owner: 'Liam Ortega', access: ['me', 'Priya Nair'], updated: '1 week ago', products: ['lulu-align', 'nike-legging', 'uniqlo-airism'] },
  { id: 'c4', name: 'Summer Activewear Ideas', desc: 'Lightweight, breathable references for the summer capsule.', owner: 'me', access: ['Amara Diallo'], updated: '3 weeks ago', products: ['uniqlo-airism', 'ua-tech', 'champion-hoodie'] },
];

export const PEOPLE = {
  me: { name: 'Maya Chen', first: 'Maya', initials: 'MC', email: 'maya.chen@mas.com', me: true },
  roster: [
    { name: 'Priya Nair', initials: 'PN', email: 'priya.nair@studio.com' },
    { name: 'Sofia Bianchi', initials: 'SB', email: 'sofia.bianchi@studio.com' },
    { name: 'Liam Ortega', initials: 'LO', email: 'liam.ortega@studio.com' },
    { name: 'Noah Feldman', initials: 'NF', email: 'noah.feldman@studio.com' },
    { name: 'Amara Diallo', initials: 'AD', email: 'amara.diallo@studio.com' },
    { name: 'Jonas Vidal', initials: 'JV', email: 'jonas.vidal@studio.com' },
  ],
};

export const PHRASES = {
  fit: { pos: ['true to size', 'flattering fit', 'fits perfectly'], neg: ['runs small', 'tight waist', 'size up', 'not true to size'] },
  comfort: { pos: ['so comfortable', 'soft on the skin', 'forget I am wearing them'], neg: ['digs in', 'uncomfortable after a while', 'itchy seams'] },
  fabric: { pos: ['buttery soft', 'premium feel', 'lovely material'], neg: ['feels thin', 'sheer', 'cheap feeling'] },
  quality: { pos: ['well made', 'holds up', 'great quality'], neg: ['poor quality', 'fell apart', 'loose threads'] },
  aesthetic: { pos: ['love the look', 'so flattering', 'clean design'], neg: ['boxy', 'plain', 'odd shape'] },
  durability: { pos: ['lasts forever', 'still like new', 'durable'], neg: ['pilled quickly', 'thinned out', 'wore out fast'] },
  workmanship: { pos: ['neat stitching', 'well finished', 'solid seams'], neg: ['loose stitching', 'seams came undone', 'uneven hems'] },
  price: { pos: ['great value', 'worth it', 'good price'], neg: ['too expensive', 'not worth the price', 'overpriced'] },
  performance: { pos: ['wicks well', 'dries fast', 'great for workouts'], neg: ['gets sweaty', 'no support', 'poor breathability'] },
  functionality: { pos: ['handy pockets', 'stays put', 'versatile'], neg: ['no pockets', 'rides up', 'runs hot'] },
};

export const REVIEW_SNIPPETS = {
  pos: ['Genuinely impressed - exactly what I hoped for.', 'I keep coming back to buy more.', 'Better than I expected for the price.'],
  neg: ['Wanted to love these but there is a real issue.', 'I usually wear medium, but this felt off.', 'Good in some ways, let down in others.'],
  neutral: ['Fine - nothing stood out either way.'],
};

export function confidenceFor(reviewCount) {
  return confidence(reviewCount);
}

export function chipStyle(active) {
  return active
    ? { bg: 'var(--ink)', fg: 'var(--paper)', borderColor: 'var(--ink)' }
    : { bg: 'var(--surface)', fg: 'var(--ink-2)', borderColor: 'var(--line)' };
}

export function pulseLabel(state) {
  if (state === 'strongpos' || state === 'pos') return 'Mostly Positive';
  if (state === 'mixed') return 'Mixed';
  if (state === 'neutral') return 'Neutral';
  return 'Mostly Critical';
}

export function reviewCountLabel(count) {
  if (count >= 500) return '500+ reviews';
  if (count >= 100) return `${Math.floor(count / 10) * 10}+ reviews`;
  return `${count} reviews`;
}

export function shortName(productItem) {
  return (productItem.name || '').split(/\s+/).filter(Boolean).slice(-2).join(' ');
}

export function imageFor(id) {
  const hash = IMAGE_HASHES[id];
  const credit = IMAGE_CREDITS[id];
  return {
    src: hash ? `https://images.unsplash.com/photo-${hash}?fm=jpg&q=72&w=800&auto=format&fit=crop` : '',
    credit: credit ? `Photo by ${credit[0]} on Unsplash` : '',
    creditHref: credit ? credit[1] : '',
  };
}
