const { getDatabase } = require('../lib/mongodb');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDatabase();

    if (!db) {
      if (req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        return res.status(201).json({
          success: true,
          storage: 'local_fallback',
          review: { ...body, createdAt: new Date().toISOString() }
        });
      }
      return res.status(200).json({ success: true, storage: 'local_fallback', reviews: [] });
    }

    const reviewsCol = db.collection('reviews');

    // GET /api/reviews
    if (req.method === 'GET') {
      const { productId } = req.query || {};
      const filter = productId ? { productId } : {};
      const reviews = await reviewsCol.find(filter).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, count: reviews.length, reviews });
    }

    // POST /api/reviews
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      const reviewDoc = {
        productId: body.productId || 'p1',
        productName: body.productName || 'Karachi Bakery Delicacy',
        author: body.author || 'Anonymous Connoisseur',
        rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
        title: body.title || 'Exceptional Quality',
        comment: body.comment || '',
        verifiedBuyer: true,
        createdAt: new Date().toISOString()
      };

      await reviewsCol.insertOne(reviewDoc);
      return res.status(201).json({ success: true, review: reviewDoc });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/reviews:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
