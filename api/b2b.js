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
          quoteId: `B2B-${Date.now().toString().slice(-5)}`,
          inquiry: { ...body, createdAt: new Date().toISOString() }
        });
      }
      return res.status(200).json({ success: true, storage: 'local_fallback', inquiries: [] });
    }

    const b2bCol = db.collection('b2b_inquiries');

    // GET /api/b2b
    if (req.method === 'GET') {
      const inquiries = await b2bCol.find({}).sort({ createdAt: -1 }).limit(50).toArray();
      return res.status(200).json({ success: true, count: inquiries.length, inquiries });
    }

    // POST /api/b2b
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const quoteId = `B2B-${Date.now().toString().slice(-5)}`;

      const inquiryDoc = {
        quoteId,
        companyName: body.companyName || 'Corporate Client',
        contactPerson: body.contactPerson || '',
        email: body.email || '',
        phone: body.phone || '',
        gstin: body.gstin || '',
        quantity: Number(body.quantity) || 50,
        boxFinish: body.boxFinish || 'Nizam Heritage Gold',
        requiredDate: body.requiredDate || '',
        status: 'Quote Generated',
        notes: body.notes || '',
        createdAt: new Date().toISOString()
      };

      await b2bCol.insertOne(inquiryDoc);
      return res.status(201).json({ success: true, quoteId, inquiry: inquiryDoc });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/b2b:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
