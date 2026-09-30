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
      return res.status(200).json({
        success: true,
        storage: 'local_fallback',
        message: 'Running in local fallback mode (MONGODB_URI not configured)',
        stores: []
      });
    }

    const storesCol = db.collection('stores');

    // GET /api/stores
    if (req.method === 'GET') {
      const { city, type } = req.query || {};
      const filter = {};
      if (city && city !== 'all') filter.city = city;
      if (type && type !== 'all') filter.type = type;

      const stores = await storesCol.find(filter).toArray();
      return res.status(200).json({ success: true, count: stores.length, stores });
    }

    // POST /api/stores (Add new store outlet)
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const storeDoc = {
        id: body.id || `store_${Date.now()}`,
        name: body.name || 'Karachi Bakery Outlet',
        city: body.city || 'hyderabad',
        cityLabel: body.cityLabel || 'Hyderabad, Telangana',
        type: body.type || 'express',
        typeLabel: body.typeLabel || '🛍️ Express Retail',
        address: body.address || '',
        hours: body.hours || '9:00 AM – 10:30 PM',
        openHour: Number(body.openHour) || 9,
        closeHour: Number(body.closeHour) || 22.5,
        is24Hours: Boolean(body.is24Hours),
        phone: body.phone || '+91 40 2461 4872',
        amenities: body.amenities || ['🍪 Fresh Biscuits', '⚡ Fast Service'],
        mapsUrl: body.mapsUrl || 'https://maps.google.com/?q=Karachi+Bakery',
        createdAt: new Date().toISOString()
      };

      await storesCol.insertOne(storeDoc);
      return res.status(201).json({ success: true, store: storeDoc });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/stores:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
