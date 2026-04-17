export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  materials: string[];
  ecoScore: number; // 1-10
  weight: string;
  featured: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  sessionId: string;
}

export interface Order {
  id: string;
  sessionId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  customerInfo: CustomerInfo;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
}

export const products: Product[] = [
  // Bamboo Cleaning Supplies
  {
    id: 'p001',
    name: 'Bamboo Dish Brush Set',
    description: 'Premium set of 3 bamboo dish brushes with natural sisal bristles. Handles crafted from sustainably harvested Moso bamboo. Biodegrades completely within 6 months in compost.',
    price: 349,
    originalPrice: 499,
    category: 'bamboo-cleaning',
    image: 'bamboo-brush',
    badge: 'Best Seller',
    rating: 4.8,
    reviewCount: 342,
    stock: 150,
    tags: ['bamboo', 'dish', 'brush', 'kitchen', 'biodegradable'],
    materials: ['Moso Bamboo', 'Natural Sisal', 'Organic Cotton'],
    ecoScore: 9,
    weight: '180g',
    featured: true,
  },
  {
    id: 'p002',
    name: 'Organic Cotton Cleaning Cloths',
    description: 'Pack of 10 reusable organic cotton cleaning cloths. Replaces 3,000 paper towels per year. Machine washable up to 200 times. GOTS certified organic cotton.',
    price: 599,
    originalPrice: 799,
    category: 'bamboo-cleaning',
    image: 'cotton-cloth',
    badge: 'Eco Choice',
    rating: 4.9,
    reviewCount: 521,
    stock: 200,
    tags: ['cotton', 'reusable', 'cloth', 'cleaning', 'zero-waste'],
    materials: ['GOTS Certified Organic Cotton'],
    ecoScore: 10,
    weight: '250g',
    featured: true,
  },
  {
    id: 'p003',
    name: 'Bamboo Toilet Brush',
    description: 'Sleek bamboo toilet brush with replaceable natural fiber head. The bamboo handle is naturally antimicrobial. Replacement heads sold separately.',
    price: 449,
    category: 'bamboo-cleaning',
    image: 'toilet-brush',
    rating: 4.6,
    reviewCount: 187,
    stock: 120,
    tags: ['bamboo', 'toilet', 'bathroom', 'antimicrobial'],
    materials: ['Bamboo', 'Natural Plant Fiber'],
    ecoScore: 8,
    weight: '210g',
    featured: false,
  },
  {
    id: 'p004',
    name: 'Bamboo Scrub Pad Set',
    description: 'Set of 6 bamboo fiber scrub pads. Tough on grease but gentle on non-stick surfaces. 100% plant-based and home compostable.',
    price: 279,
    category: 'bamboo-cleaning',
    image: 'scrub-pad',
    badge: 'New',
    rating: 4.7,
    reviewCount: 93,
    stock: 300,
    tags: ['bamboo', 'scrub', 'kitchen', 'compostable'],
    materials: ['Bamboo Fiber', 'Natural Loofah'],
    ecoScore: 9,
    weight: '120g',
    featured: false,
  },

  // Biodegradable Kitchenware
  {
    id: 'p005',
    name: 'Wheat Straw Dinner Set',
    description: 'Complete 16-piece dinner set made from natural wheat straw fiber. BPA-free, microwave-safe, and dishwasher-safe. Biodegrades in 2-5 years.',
    price: 1299,
    originalPrice: 1799,
    category: 'biodegradable-kitchenware',
    image: 'wheat-straw-set',
    badge: 'Top Rated',
    rating: 4.7,
    reviewCount: 412,
    stock: 80,
    tags: ['wheat straw', 'dinner set', 'BPA-free', 'biodegradable'],
    materials: ['Wheat Straw Fiber', 'PP (Food Grade)'],
    ecoScore: 8,
    weight: '1.2kg',
    featured: true,
  },
  {
    id: 'p006',
    name: 'Bamboo Fiber Cups Set of 4',
    description: 'Elegant bamboo fiber cups with natural wood grain texture. Suitable for hot and cold beverages. Lightweight and durable, perfect for family use.',
    price: 699,
    category: 'biodegradable-kitchenware',
    image: 'bamboo-cups',
    rating: 4.5,
    reviewCount: 234,
    stock: 160,
    tags: ['bamboo', 'cups', 'beverages', 'natural'],
    materials: ['Bamboo Fiber', 'Organic Resin'],
    ecoScore: 9,
    weight: '380g',
    featured: false,
  },
  {
    id: 'p007',
    name: 'Sugarcane Bagasse Plates (100 pcs)',
    description: 'Compostable plates made from sugarcane bagasse — a byproduct of sugar production. Sturdy, leak-proof, and fully compostable within 90 days.',
    price: 449,
    originalPrice: 599,
    category: 'biodegradable-kitchenware',
    image: 'sugarcane-plates',
    badge: 'Sale',
    rating: 4.4,
    reviewCount: 678,
    stock: 500,
    tags: ['sugarcane', 'compostable', 'plates', 'party'],
    materials: ['Sugarcane Bagasse'],
    ecoScore: 10,
    weight: '900g',
    featured: false,
  },
  {
    id: 'p008',
    name: 'Areca Palm Leaf Bowls',
    description: 'Hand-crafted bowls from naturally shed areca palm leaves. No trees are cut. Each piece has unique natural patterns. Fully compostable.',
    price: 399,
    category: 'biodegradable-kitchenware',
    image: 'palm-bowls',
    badge: 'Handcrafted',
    rating: 4.8,
    reviewCount: 156,
    stock: 240,
    tags: ['palm', 'handcrafted', 'bowls', 'natural', 'unique'],
    materials: ['Areca Palm Leaf'],
    ecoScore: 10,
    weight: '450g',
    featured: true,
  },

  // Reusable Storage Solutions
  {
    id: 'p009',
    name: 'Beeswax Food Wraps (3-Pack)',
    description: 'Natural beeswax food wraps in 3 sizes. Replaces plastic cling film. Washable and reusable for 1+ year. Made with organic cotton, beeswax, pine resin, and jojoba oil.',
    price: 799,
    originalPrice: 999,
    category: 'reusable-storage',
    image: 'beeswax-wrap',
    badge: 'Best Seller',
    rating: 4.9,
    reviewCount: 892,
    stock: 350,
    tags: ['beeswax', 'food wrap', 'zero-waste', 'plastic-free'],
    materials: ['Organic Cotton', 'Beeswax', 'Pine Resin', 'Jojoba Oil'],
    ecoScore: 10,
    weight: '90g',
    featured: true,
  },
  {
    id: 'p010',
    name: 'Glass Storage Jars (Set of 6)',
    description: 'Premium borosilicate glass storage jars with bamboo lids. Airtight seal keeps food fresh longer. Oven, freezer, and dishwasher safe. Zero plastic.',
    price: 1499,
    originalPrice: 1999,
    category: 'reusable-storage',
    image: 'glass-jars',
    badge: 'Premium',
    rating: 4.8,
    reviewCount: 445,
    stock: 100,
    tags: ['glass', 'storage', 'bamboo', 'airtight', 'kitchen'],
    materials: ['Borosilicate Glass', 'Bamboo', 'Silicone'],
    ecoScore: 9,
    weight: '2.1kg',
    featured: true,
  },
  {
    id: 'p011',
    name: 'Organic Cotton Produce Bags',
    description: 'Set of 9 mesh produce bags in 3 sizes. Perfect for shopping and storing fruits and vegetables. Machine washable. Eliminates single-use plastic bags.',
    price: 499,
    category: 'reusable-storage',
    image: 'produce-bags',
    rating: 4.7,
    reviewCount: 623,
    stock: 400,
    tags: ['cotton', 'bags', 'produce', 'mesh', 'zero-waste'],
    materials: ['100% Organic Cotton Mesh'],
    ecoScore: 10,
    weight: '95g',
    featured: false,
  },
  {
    id: 'p012',
    name: 'Stainless Steel Container Set',
    description: 'Set of 5 food-grade 304 stainless steel containers with locking lids. Leak-proof and perfect for meal prep. Lifetime warranty. Zero plastic.',
    price: 1899,
    originalPrice: 2499,
    category: 'reusable-storage',
    image: 'steel-containers',
    badge: 'Lifetime Warranty',
    rating: 4.9,
    reviewCount: 337,
    stock: 70,
    tags: ['stainless steel', 'containers', 'meal prep', 'leak-proof'],
    materials: ['304 Food-Grade Stainless Steel'],
    ecoScore: 9,
    weight: '1.8kg',
    featured: true,
  },

  // Eco-friendly Cleaning Agents
  {
    id: 'p013',
    name: 'Plant-Based All-Purpose Cleaner',
    description: 'Concentrated all-purpose cleaner made from 100% plant-derived ingredients. One bottle makes up to 10 liters when diluted. Non-toxic, biodegrades in 28 days.',
    price: 549,
    originalPrice: 699,
    category: 'eco-cleaning-agents',
    image: 'all-purpose-cleaner',
    badge: 'Concentrated',
    rating: 4.7,
    reviewCount: 789,
    stock: 280,
    tags: ['plant-based', 'cleaner', 'concentrate', 'non-toxic'],
    materials: ['Plant Surfactants', 'Citric Acid', 'Essential Oils'],
    ecoScore: 9,
    weight: '500ml',
    featured: true,
  },
  {
    id: 'p014',
    name: 'Natural Dishwasher Tablets (40 pcs)',
    description: 'Phosphate-free dishwasher tablets with natural cleaning power. Plastic-free packaging. Safe for septic tanks. Made with mineral salts and plant enzymes.',
    price: 699,
    category: 'eco-cleaning-agents',
    image: 'dishwasher-tabs',
    badge: 'Plastic-Free Pack',
    rating: 4.6,
    reviewCount: 523,
    stock: 200,
    tags: ['dishwasher', 'tablets', 'phosphate-free', 'natural'],
    materials: ['Sodium Carbonate', 'Citric Acid', 'Plant Enzymes'],
    ecoScore: 9,
    weight: '680g',
    featured: false,
  },
  {
    id: 'p015',
    name: 'Zero-Waste Laundry Strips (64 loads)',
    description: 'Ultra-concentrated laundry detergent in dissolvable strip format. No plastic jug. Works in hot and cold water. Hypoallergenic and dermatologist tested.',
    price: 899,
    originalPrice: 1199,
    category: 'eco-cleaning-agents',
    image: 'laundry-strips',
    badge: 'Zero Plastic',
    rating: 4.8,
    reviewCount: 1024,
    stock: 350,
    tags: ['laundry', 'strips', 'zero-waste', 'hypoallergenic'],
    materials: ['PVA', 'Plant Enzymes', 'Mineral Salts'],
    ecoScore: 10,
    weight: '100g',
    featured: true,
  },
  {
    id: 'p016',
    name: 'Natural Floor Cleaner Concentrate',
    description: 'Lemon and eucalyptus infused floor cleaner. Safe for marble, tiles, and wood. Concentrated formula — 50ml makes 5 liters. Kid and pet friendly.',
    price: 399,
    category: 'eco-cleaning-agents',
    image: 'floor-cleaner',
    rating: 4.5,
    reviewCount: 312,
    stock: 190,
    tags: ['floor', 'cleaner', 'lemon', 'eucalyptus', 'pet-safe'],
    materials: ['Plant Surfactants', 'Lemon Oil', 'Eucalyptus Extract'],
    ecoScore: 8,
    weight: '250ml',
    featured: false,
  },
];

export const carts: CartItem[] = [];
export const orders: Order[] = [];