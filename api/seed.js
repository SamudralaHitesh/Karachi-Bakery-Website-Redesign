const { getDatabase } = require('../lib/mongodb');

const SEED_PRODUCTS = [
  {
    id: 'p1',
    name: 'Original Fruit Biscuits',
    category: 'biscuits',
    price: 180,
    originalPrice: 200,
    unit: '400g Tin',
    rating: 4.9,
    reviewsCount: 1420,
    shelfLife: '6 Months',
    dietary: ['veg', 'eggless'],
    description: 'The world-famous signature Karachi Bakery delicacy since 1953, loaded with colorful candied fruits.'
  },
  {
    id: 'p2',
    name: 'Hyderabadi Osmania Biscuits',
    category: 'biscuits',
    price: 160,
    originalPrice: 175,
    unit: '400g Box',
    rating: 4.8,
    reviewsCount: 980,
    shelfLife: '6 Months',
    dietary: ['veg', 'eggless'],
    description: 'Named after Nizam Mir Osman Ali Khan; sweet and savory balance crafted for dipping in steaming Irani Chai.'
  },
  {
    id: 'p3',
    name: 'Cashew & Pista Butter Biscuits',
    category: 'biscuits',
    price: 240,
    originalPrice: 260,
    unit: '400g Tin',
    rating: 4.9,
    reviewsCount: 750,
    shelfLife: '6 Months',
    dietary: ['veg', 'eggless'],
    description: 'Golden-baked butter biscuits generously topped with crunchy roasted cashews and Iranian pistachios.'
  },
  {
    id: 'p4',
    name: 'Royal Kaju Katli Diamond Cut',
    category: 'sweets',
    price: 450,
    originalPrice: 480,
    unit: '500g Box',
    rating: 4.9,
    reviewsCount: 620,
    shelfLife: '45 Days',
    dietary: ['veg', 'gluten-free'],
    description: 'Pure Goan cashew paste slow-cooked with organic sugar and garnished with edible silver vark.'
  },
  {
    id: 'p5',
    name: 'Pure Desi Ghee Motichoor Ladoo',
    category: 'sweets',
    price: 360,
    originalPrice: 390,
    unit: '500g Box',
    rating: 4.8,
    reviewsCount: 510,
    shelfLife: '20 Days',
    dietary: ['veg'],
    description: 'Melt-in-the-mouth tiny gram-flour pearls fried in pure desi cow ghee and infused with green cardamom.'
  },
  {
    id: 'p6',
    name: 'Irani Double-Baked Butter Rusk',
    category: 'rusks',
    price: 120,
    originalPrice: 135,
    unit: '300g Pack',
    rating: 4.7,
    reviewsCount: 430,
    shelfLife: '4 Months',
    dietary: ['veg', 'eggless'],
    description: 'Slow twice-baked golden brioche toasts, seasoned with cardamom and fennel seeds for teatime dunking.'
  }
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDatabase();
    if (!db) {
      return res.status(400).json({
        success: false,
        message: 'Cannot seed: MONGODB_URI is not configured in environment variables.'
      });
    }

    const productsCol = db.collection('products');
    const existingProductsCount = await productsCol.countDocuments();
    let seededProducts = 0;

    if (existingProductsCount === 0) {
      await productsCol.insertMany(SEED_PRODUCTS);
      seededProducts = SEED_PRODUCTS.length;
    }

    return res.status(200).json({
      success: true,
      message: 'MongoDB database initialized successfully!',
      seededProducts,
      existingProductsCount,
      database: db.databaseName
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
