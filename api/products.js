const { getDatabase } = require('../lib/mongodb');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDatabase();

    if (!db) {
      return res.status(200).json({
        success: true,
        storage: 'local_fallback',
        message: 'Running in local fallback mode (MONGODB_URI not configured)',
        products: []
      });
    }

    const productsCol = db.collection('products');

    // GET /api/products
    if (req.method === 'GET') {
      const { category, inStock } = req.query || {};
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      if (inStock !== undefined) filter.inStock = inStock === 'true';

      const products = await productsCol.find(filter).toArray();
      return res.status(200).json({ success: true, count: products.length, products });
    }

    // POST /api/products (Publish new delicacy)
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const productDoc = {
        id: body.id || `p_${Date.now()}`,
        name: body.name || 'New Delicacy',
        category: body.category || 'biscuits',
        price: Number(body.price) || 100,
        originalPrice: Number(body.originalPrice) || Number(body.price) || 100,
        unit: body.unit || '400g Pack',
        inStock: body.inStock !== false,
        rating: Number(body.rating) || 4.8,
        reviewsCount: Number(body.reviewsCount) || 1,
        dietary: body.dietary || ['veg', 'eggless'],
        shelfLife: body.shelfLife || '6 Months',
        description: body.description || '',
        createdAt: new Date().toISOString()
      };

      await productsCol.insertOne(productDoc);
      return res.status(201).json({ success: true, product: productDoc });
    }

    // PATCH /api/products (Update price / stock)
    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, price, inStock } = body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Product id is required' });
      }

      const updates = { updatedAt: new Date().toISOString() };
      if (price !== undefined) updates.price = Number(price);
      if (inStock !== undefined) updates.inStock = Boolean(inStock);

      const result = await productsCol.updateOne({ id }, { $set: updates });
      return res.status(200).json({ success: true, matchedCount: result.matchedCount, updates });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/products:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
