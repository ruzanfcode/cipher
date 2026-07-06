import type { Product, SavedCollection, Role, SBU, SBUUser } from "@/app/types";

export const BRANDS = [
  { id:  1, name: "Nike" },
  { id:  2, name: "Adidas" },
  { id:  3, name: "H&M" },
  { id:  4, name: "Zara" },
  { id:  5, name: "Uniqlo" },
  { id:  6, name: "Gymshark" },
  { id:  7, name: "Lululemon" },
  { id:  8, name: "Champion" },
  { id:  9, name: "Carhartt" },
  { id: 10, name: "Patagonia" },
];

export const PRODUCTS: Product[] = [
  // ── Nike ──────────────────────────────────────────────────────────────────
  { id:  1, name: "Dri-FIT Training Tee",         brand: "Nike",      category: "Sport Tops",       reviews: 2897, rating: 4.3, sentiment: { positive: 72, neutral: 16, negative: 12 }, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=280&fit=crop&auto=format" },
  { id:  2, name: "Tech Fleece Full-Zip Hoodie",  brand: "Nike",      category: "Athleisure",       reviews: 3170, rating: 4.6, sentiment: { positive: 80, neutral: 12, negative: 8  }, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=280&fit=crop&auto=format" },
  { id:  3, name: "Club Fleece Jogger Pants",     brand: "Nike",      category: "Athleisure",       reviews: 2237, rating: 4.2, sentiment: { positive: 67, neutral: 19, negative: 14 }, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=280&fit=crop&auto=format" },
  { id:  4, name: "Windrunner Running Jacket",    brand: "Nike",      category: "Outerwear",        reviews: 2037, rating: 4.5, sentiment: { positive: 78, neutral: 13, negative: 9  }, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=280&fit=crop&auto=format" },
  { id:  5, name: "Pro Compression Shorts",       brand: "Nike",      category: "Sport Bottoms",    reviews: 1593, rating: 4.1, sentiment: { positive: 63, neutral: 21, negative: 16 }, image: "https://images.unsplash.com/photo-1562886877-f7e20b63b7b0?w=400&h=280&fit=crop&auto=format" },
  { id:  6, name: "Sportswear Phoenix Fleece",    brand: "Nike",      category: "Tops",             reviews: 1654, rating: 4.0, sentiment: { positive: 61, neutral: 22, negative: 17 }, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=280&fit=crop&auto=format" },
  // ── Adidas ────────────────────────────────────────────────────────────────
  { id:  7, name: "Trefoil Graphic Tee",          brand: "Adidas",    category: "Originals",        reviews: 2260, rating: 4.3, sentiment: { positive: 71, neutral: 17, negative: 12 }, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=280&fit=crop&auto=format" },
  { id:  8, name: "Essentials Fleece Hoodie",     brand: "Adidas",    category: "Athleisure",       reviews: 1704, rating: 4.2, sentiment: { positive: 68, neutral: 18, negative: 14 }, image: "https://images.unsplash.com/photo-1578681041175-9717c638de37?w=400&h=280&fit=crop&auto=format" },
  { id:  9, name: "Tiro 21 Track Pants",          brand: "Adidas",    category: "Training",         reviews: 1482, rating: 4.0, sentiment: { positive: 62, neutral: 22, negative: 16 }, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=280&fit=crop&auto=format" },
  { id: 10, name: "Stadium Track Jacket",         brand: "Adidas",    category: "Outerwear",        reviews: 2391, rating: 4.5, sentiment: { positive: 76, neutral: 14, negative: 10 }, image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&h=280&fit=crop&auto=format" },
  { id: 11, name: "Adicolor Classics Tee",        brand: "Adidas",    category: "Originals",        reviews: 1876, rating: 4.4, sentiment: { positive: 74, neutral: 15, negative: 11 }, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=280&fit=crop&auto=format" },
  { id: 12, name: "Techfit Compression Tights",   brand: "Adidas",    category: "Training",         reviews: 987,  rating: 4.1, sentiment: { positive: 65, neutral: 20, negative: 15 }, image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=280&fit=crop&auto=format" },
  // ── H&M ───────────────────────────────────────────────────────────────────
  { id: 13, name: "Slim Fit Cotton Tee",          brand: "H&M",       category: "Basics",           reviews: 4521, rating: 3.8, sentiment: { positive: 56, neutral: 24, negative: 20 }, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=280&fit=crop&auto=format" },
  { id: 14, name: "Regular Fit Pullover Hoodie",  brand: "H&M",       category: "Basics",           reviews: 3210, rating: 3.9, sentiment: { positive: 58, neutral: 23, negative: 19 }, image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&h=280&fit=crop&auto=format" },
  { id: 15, name: "Slim Fit Chino Trousers",      brand: "H&M",       category: "Trousers",         reviews: 2876, rating: 4.0, sentiment: { positive: 61, neutral: 22, negative: 17 }, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=280&fit=crop&auto=format" },
  { id: 16, name: "Oversized Denim Jacket",       brand: "H&M",       category: "Outerwear",        reviews: 3127, rating: 4.2, sentiment: { positive: 67, neutral: 20, negative: 13 }, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=280&fit=crop&auto=format" },
  { id: 17, name: "Ribbed Tank Top",              brand: "H&M",       category: "Tops",             reviews: 2541, rating: 3.8, sentiment: { positive: 55, neutral: 25, negative: 20 }, image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=280&fit=crop&auto=format" },
  { id: 18, name: "Relaxed Fit Sweatshirt",       brand: "H&M",       category: "Basics",           reviews: 1987, rating: 4.1, sentiment: { positive: 64, neutral: 21, negative: 15 }, image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&h=280&fit=crop&auto=format" },
  { id: 19, name: "Wide-Leg Linen Trousers",      brand: "H&M",       category: "Trousers",         reviews: 1654, rating: 4.0, sentiment: { positive: 62, neutral: 22, negative: 16 }, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b8a79?w=400&h=280&fit=crop&auto=format" },
  // ── Zara ──────────────────────────────────────────────────────────────────
  { id: 20, name: "Linen Overshirt",              brand: "Zara",      category: "Shirts",           reviews: 1543, rating: 4.4, sentiment: { positive: 75, neutral: 15, negative: 10 }, image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&h=280&fit=crop&auto=format" },
  { id: 21, name: "Wide-Leg Pull-On Trousers",    brand: "Zara",      category: "Trousers",         reviews: 2310, rating: 4.5, sentiment: { positive: 77, neutral: 14, negative: 9  }, image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=280&fit=crop&auto=format" },
  { id: 22, name: "Oversized Blazer",             brand: "Zara",      category: "Outerwear",        reviews: 1876, rating: 4.6, sentiment: { positive: 80, neutral: 12, negative: 8  }, image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=280&fit=crop&auto=format" },
  { id: 23, name: "Textured Knit Sweater",        brand: "Zara",      category: "Knitwear",         reviews: 1432, rating: 4.3, sentiment: { positive: 73, neutral: 16, negative: 11 }, image: "https://images.unsplash.com/photo-1614495952581-db2b57ffec8d?w=400&h=280&fit=crop&auto=format" },
  { id: 24, name: "Printed Floral Midi Dress",    brand: "Zara",      category: "Dresses",          reviews: 2187, rating: 4.4, sentiment: { positive: 75, neutral: 16, negative: 9  }, image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=400&h=280&fit=crop&auto=format" },
  { id: 25, name: "Soft Flow Midi Skirt",         brand: "Zara",      category: "Bottoms",          reviews: 1654, rating: 4.2, sentiment: { positive: 70, neutral: 18, negative: 12 }, image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=280&fit=crop&auto=format" },
  // ── Uniqlo ────────────────────────────────────────────────────────────────
  { id: 26, name: "Heattech Extra Warm Crewneck", brand: "Uniqlo",    category: "Innerwear",        reviews: 5431, rating: 4.7, sentiment: { positive: 85, neutral: 10, negative: 5  }, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=280&fit=crop&auto=format" },
  { id: 27, name: "Ultra Light Down Jacket",      brand: "Uniqlo",    category: "Outerwear",        reviews: 4210, rating: 4.8, sentiment: { positive: 88, neutral: 8,  negative: 4  }, image: "https://images.unsplash.com/photo-1545572009-f028bab7bf8c?w=400&h=280&fit=crop&auto=format" },
  { id: 28, name: "AIRism UV Cut Polo Shirt",     brand: "Uniqlo",    category: "Tops",             reviews: 3187, rating: 4.5, sentiment: { positive: 79, neutral: 13, negative: 8  }, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=280&fit=crop&auto=format" },
  { id: 29, name: "Supima Cotton Crew Neck Tee",  brand: "Uniqlo",    category: "Tops",             reviews: 4876, rating: 4.6, sentiment: { positive: 82, neutral: 11, negative: 7  }, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=280&fit=crop&auto=format" },
  { id: 30, name: "Merino Turtleneck Sweater",    brand: "Uniqlo",    category: "Knitwear",         reviews: 2341, rating: 4.7, sentiment: { positive: 84, neutral: 10, negative: 6  }, image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?w=400&h=280&fit=crop&auto=format" },
  { id: 31, name: "Wide-Fit Cargo Pants",         brand: "Uniqlo",    category: "Trousers",         reviews: 1987, rating: 4.3, sentiment: { positive: 72, neutral: 17, negative: 11 }, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=280&fit=crop&auto=format" },
  { id: 32, name: "Fleece Full-Zip Jacket",       brand: "Uniqlo",    category: "Outerwear",        reviews: 3654, rating: 4.6, sentiment: { positive: 81, neutral: 12, negative: 7  }, image: "https://images.unsplash.com/photo-1578681041175-9717c638de37?w=400&h=280&fit=crop&auto=format" },
  // ── Gymshark ──────────────────────────────────────────────────────────────
  { id: 33, name: "Energy Seamless Leggings",     brand: "Gymshark",  category: "Activewear",       reviews: 3210, rating: 4.5, sentiment: { positive: 78, neutral: 13, negative: 9  }, image: "https://images.unsplash.com/photo-1520316587275-5e4f06f355e8?w=400&h=280&fit=crop&auto=format" },
  { id: 34, name: "Flex Sports Bra",              brand: "Gymshark",  category: "Activewear",       reviews: 2876, rating: 4.4, sentiment: { positive: 75, neutral: 15, negative: 10 }, image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&h=280&fit=crop&auto=format" },
  { id: 35, name: "Crest Pullover Hoodie",        brand: "Gymshark",  category: "Tops",             reviews: 1987, rating: 4.3, sentiment: { positive: 72, neutral: 17, negative: 11 }, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=280&fit=crop&auto=format" },
  { id: 36, name: "Training Woven Shorts",        brand: "Gymshark",  category: "Activewear",       reviews: 1543, rating: 4.2, sentiment: { positive: 68, neutral: 20, negative: 12 }, image: "https://images.unsplash.com/photo-1562886877-f7e20b63b7b0?w=400&h=280&fit=crop&auto=format" },
  { id: 37, name: "Legacy Graphic Tee",           brand: "Gymshark",  category: "Tops",             reviews: 1210, rating: 4.1, sentiment: { positive: 65, neutral: 22, negative: 13 }, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=280&fit=crop&auto=format" },
  { id: 38, name: "Vital Seamless Set",           brand: "Gymshark",  category: "Activewear",       reviews: 2100, rating: 4.6, sentiment: { positive: 81, neutral: 12, negative: 7  }, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=280&fit=crop&auto=format" },
  // ── Lululemon ─────────────────────────────────────────────────────────────
  { id: 39, name: "Align High-Rise Leggings",     brand: "Lululemon", category: "Yoga",             reviews: 4321, rating: 4.8, sentiment: { positive: 87, neutral: 8,  negative: 5  }, image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=280&fit=crop&auto=format" },
  { id: 40, name: "ABC Classic-Fit Trouser",      brand: "Lululemon", category: "Smart Casual",     reviews: 2876, rating: 4.7, sentiment: { positive: 84, neutral: 10, negative: 6  }, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=280&fit=crop&auto=format" },
  { id: 41, name: "Scuba Oversized Hoodie",       brand: "Lululemon", category: "Athleisure",       reviews: 3210, rating: 4.8, sentiment: { positive: 88, neutral: 8,  negative: 4  }, image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&h=280&fit=crop&auto=format" },
  { id: 42, name: "License to Train Short",       brand: "Lululemon", category: "Sport Bottoms",    reviews: 1876, rating: 4.5, sentiment: { positive: 79, neutral: 13, negative: 8  }, image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=280&fit=crop&auto=format" },
  { id: 43, name: "Metal Vent Tech Long Sleeve",  brand: "Lululemon", category: "Sport Tops",       reviews: 1543, rating: 4.4, sentiment: { positive: 76, neutral: 15, negative: 9  }, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=280&fit=crop&auto=format" },
  { id: 44, name: "Define Jacket Luon",           brand: "Lululemon", category: "Outerwear",        reviews: 2187, rating: 4.6, sentiment: { positive: 81, neutral: 12, negative: 7  }, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=280&fit=crop&auto=format" },
  // ── Champion ──────────────────────────────────────────────────────────────
  { id: 45, name: "Reverse Weave Hoodie",         brand: "Champion",  category: "Athleisure",       reviews: 3876, rating: 4.5, sentiment: { positive: 78, neutral: 14, negative: 8  }, image: "https://images.unsplash.com/photo-1578681041175-9717c638de37?w=400&h=280&fit=crop&auto=format" },
  { id: 46, name: "Classic C Logo Tee",           brand: "Champion",  category: "Tops",             reviews: 2654, rating: 4.2, sentiment: { positive: 69, neutral: 19, negative: 12 }, image: "https://images.unsplash.com/photo-1621070957778-c8db3e001e01?w=400&h=280&fit=crop&auto=format" },
  { id: 47, name: "Powerblend Sweatpants",        brand: "Champion",  category: "Athleisure",       reviews: 2341, rating: 4.4, sentiment: { positive: 74, neutral: 16, negative: 10 }, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=280&fit=crop&auto=format" },
  { id: 48, name: "Jersey Mesh Shorts",           brand: "Champion",  category: "Sport Bottoms",    reviews: 1765, rating: 4.0, sentiment: { positive: 63, neutral: 23, negative: 14 }, image: "https://images.unsplash.com/photo-1562886877-f7e20b63b7b0?w=400&h=280&fit=crop&auto=format" },
  { id: 49, name: "Packable Wind Jacket",         brand: "Champion",  category: "Outerwear",        reviews: 1432, rating: 4.1, sentiment: { positive: 65, neutral: 22, negative: 13 }, image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=280&fit=crop&auto=format" },
  // ── Carhartt ──────────────────────────────────────────────────────────────
  { id: 50, name: "Heavyweight Crewneck Tee",     brand: "Carhartt",  category: "Workwear Tops",    reviews: 3210, rating: 4.5, sentiment: { positive: 79, neutral: 13, negative: 8  }, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=280&fit=crop&auto=format" },
  { id: 51, name: "Duck Active Jacket",           brand: "Carhartt",  category: "Outerwear",        reviews: 2187, rating: 4.7, sentiment: { positive: 83, neutral: 11, negative: 6  }, image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&h=280&fit=crop&auto=format" },
  { id: 52, name: "Double-Front Work Pants",      brand: "Carhartt",  category: "Workwear Bottoms", reviews: 1876, rating: 4.6, sentiment: { positive: 81, neutral: 12, negative: 7  }, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=280&fit=crop&auto=format" },
  { id: 53, name: "Thermal Knit Henley",          brand: "Carhartt",  category: "Workwear Tops",    reviews: 2341, rating: 4.4, sentiment: { positive: 76, neutral: 15, negative: 9  }, image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?w=400&h=280&fit=crop&auto=format" },
  { id: 54, name: "Washed Duck Chore Coat",       brand: "Carhartt",  category: "Outerwear",        reviews: 1543, rating: 4.3, sentiment: { positive: 73, neutral: 17, negative: 10 }, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=280&fit=crop&auto=format" },
  { id: 55, name: "Relaxed Fit Flannel Shirt",    brand: "Carhartt",  category: "Shirts",           reviews: 1987, rating: 4.5, sentiment: { positive: 78, neutral: 14, negative: 8  }, image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&h=280&fit=crop&auto=format" },
  // ── Patagonia ─────────────────────────────────────────────────────────────
  { id: 56, name: "Nano Puff Jacket",             brand: "Patagonia", category: "Outerwear",        reviews: 3210, rating: 4.8, sentiment: { positive: 88, neutral: 8,  negative: 4  }, image: "https://images.unsplash.com/photo-1545572009-f028bab7bf8c?w=400&h=280&fit=crop&auto=format" },
  { id: 57, name: "Better Sweater Fleece Jacket", brand: "Patagonia", category: "Outerwear",        reviews: 2876, rating: 4.7, sentiment: { positive: 85, neutral: 10, negative: 5  }, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=280&fit=crop&auto=format" },
  { id: 58, name: "Baggies Lightweight Shorts",   brand: "Patagonia", category: "Outdoor Bottoms",  reviews: 1987, rating: 4.6, sentiment: { positive: 82, neutral: 12, negative: 6  }, image: "https://images.unsplash.com/photo-1562886877-f7e20b63b7b0?w=400&h=280&fit=crop&auto=format" },
  { id: 59, name: "Capilene Cool Trail Shirt",    brand: "Patagonia", category: "Outdoor Tops",     reviews: 1654, rating: 4.5, sentiment: { positive: 79, neutral: 13, negative: 8  }, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=280&fit=crop&auto=format" },
  { id: 60, name: "Synchilla Snap-T Pullover",    brand: "Patagonia", category: "Fleece",           reviews: 2341, rating: 4.7, sentiment: { positive: 84, neutral: 10, negative: 6  }, image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&h=280&fit=crop&auto=format" },
  { id: 61, name: "R1 Air Full-Zip Hoody",        brand: "Patagonia", category: "Fleece",           reviews: 1432, rating: 4.5, sentiment: { positive: 80, neutral: 13, negative: 7  }, image: "https://images.unsplash.com/photo-1578681041175-9717c638de37?w=400&h=280&fit=crop&auto=format" },
];

export const ATTRIBUTES = [
  { name: "Fit",               positive: 78, neutral: 12, negative: 10, usage: 0.95 },
  { name: "Quality",           positive: 74, neutral: 14, negative: 12, usage: 0.6  },
  { name: "Comfort",           positive: 81, neutral: 12, negative: 7,  usage: 0.7  },
  { name: "Aesthetic",         positive: 69, neutral: 18, negative: 13, usage: 0.75 },
  { name: "Price",             positive: 67, neutral: 19, negative: 14, usage: 0.88 },
  { name: "Performance",       positive: 58, neutral: 23, negative: 19, usage: 0.5  },
  { name: "Functionality",     positive: 72, neutral: 15, negative: 13, usage: 0.9  },
  { name: "Workmanship",       positive: 65, neutral: 20, negative: 15, usage: 0.85 },
  { name: "Quality",           positive: 52, neutral: 22, negative: 26, usage: 0.8  },
  { name: "Durability",        positive: 60, neutral: 21, negative: 19, usage: 0.45 },
];

export const ATTRIBUTE_NAMES = ATTRIBUTES.map(a => a.name);

export const REVIEWS = [
  { id: 1, reviewer: "Sarah M.",   rating: 5, sentiment: "positive", text: "Absolutely love these shoes! The comfort level is incredible and they look amazing. Wore them for a 10-mile run without any discomfort.", attributes: ["Comfort", "Aesthetic"], date: "Mar 12, 2024" },
  { id: 2, reviewer: "James T.",   rating: 2, sentiment: "negative", text: "Very disappointed with the sizing. Runs about half a size small, and the material started peeling after just 3 months.", attributes: ["Fit", "Durability"], date: "Feb 28, 2024" },
  { id: 3, reviewer: "Priya K.",   rating: 4, sentiment: "positive", text: "Great performance shoes. The cushioning is top-notch and provides excellent support during long runs.", attributes: ["Performance", "Comfort"], date: "Mar 8, 2024" },
  { id: 4, reviewer: "Mike R.",    rating: 3, sentiment: "neutral",  text: "Decent shoes for the price. Nothing exceptional but gets the job done. Value is about right for what you get.", attributes: ["Price"], date: "Mar 1, 2024" },
  { id: 5, reviewer: "Lisa C.",    rating: 1, sentiment: "negative", text: "Sole started detaching within weeks. Customer service was unhelpful. Quality control has dropped significantly.", attributes: ["Workmanship", "Durability"], date: "Feb 20, 2024" },
  { id: 6, reviewer: "David H.",   rating: 5, sentiment: "positive", text: "Hands down the best running shoes I've owned. Fit is perfect, feel premium, still look new after 200+ miles.", attributes: ["Fit", "Quality", "Durability"], date: "Mar 15, 2024" },
  { id: 7, reviewer: "Emma W.",    rating: 4, sentiment: "positive", text: "Really comfortable for daily wear. The design is sleek and modern. Would definitely recommend.", attributes: ["Aesthetic", "Comfort"], date: "Mar 20, 2024" },
  { id: 8, reviewer: "Carlos R.",  rating: 2, sentiment: "negative", text: "Not worth the price. The material feels cheap for what you pay. Expected much better from this brand.", attributes: ["Price", "Quality"], date: "Mar 3, 2024" },
];

export const USERS: SBUUser[] = [
  { id: 1, name: "Alex Chen",      email: "alex.chen@acme.com",  role: "SBU Admin", status: "Active",  sbu: "Americas", lastActive: "2 hours ago" },
  { id: 2, name: "Maria Santos",   email: "m.santos@acme.com",   role: "SBU User",  status: "Active",  sbu: "Americas", lastActive: "1 day ago" },
  { id: 3, name: "Robert Kim",     email: "r.kim@acme.com",      role: "SBU User",  status: "Pending", sbu: "Americas", lastActive: "Never" },
  { id: 4, name: "Priya Patel",    email: "p.patel@acme.com",    role: "SBU User",  status: "Active",  sbu: "APAC",     lastActive: "3 hours ago" },
  { id: 5, name: "James O'Brien",  email: "j.obrien@acme.com",   role: "SBU Admin", status: "Active",  sbu: "EMEA",     lastActive: "30 min ago" },
];

export const SBUS: SBU[] = [
  { id: 1, name: "Americas",      admin: "Alex Chen",     users: 24, allowedUsers: 40, status: "Active",   products: 156, collections: 18 },
  { id: 2, name: "APAC",          admin: "Priya Patel",   users: 31, allowedUsers: 50, status: "Active",   products: 203, collections: 24 },
  { id: 3, name: "EMEA",          admin: "James O'Brien", users: 19, allowedUsers: 35, status: "Active",   products: 142, collections: 15 },
  { id: 4, name: "Global Brands", admin: "Unassigned",    users: 8,  allowedUsers: 20, status: "Inactive", products: 67,  collections: 9  },
];

export const USER_PROFILES: Record<Role, { name: string; email: string; sbu: string; roleLabel: string }> = {
  system_admin: { name: "Jordan Lee",   email: "jordan.lee@fcodelabs.com", sbu: "Global",   roleLabel: "System Admin" },
  sbu_admin:    { name: "Alex Chen",    email: "alex.chen@fcodelabs.com",  sbu: "Americas", roleLabel: "SBU Admin" },
  sbu_user:     { name: "Maria Santos", email: "m.santos@fcodelabs.com",   sbu: "Americas", roleLabel: "User" },
};

export const AI_RESPONSES = [
  "Based on the sentiment data, Value Perception at 26% negative is the top driver of dissatisfaction. Customers feel the price-quality ratio needs improvement.",
  "Fresh Foam 1080v12 leads in Comfort at 79% positive, outperforming the category average by ~8 points.",
  "Durability shows significant brand variance — the gap strongly correlates with material quality ratings in reviews.",
  "Review volume spikes correlate with seasonal launch events, indicating a strong post-launch feedback window.",
  "The Comfort attribute consistently drives positive sentiment across all products in your collection. This is a strong differentiator worth highlighting.",
];

export const INITIAL_SAVED: SavedCollection[] = [
  { id: 1, name: "Q3 Competitor Analysis", owner: "Alex Chen", created: "Mar 10, 2024", productIds: [1, 2, 3] },
  { id: 2, name: "Premium Segment Study",  owner: "You",       created: "Feb 28, 2024", productIds: [4, 8] },
];
