const { getDatabase } = require('../lib/mongodb');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDatabase();

    // If MongoDB is not connected, return graceful mock/fallback mode
    if (!db) {
      if (req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const mockOrder = {
          orderId: body.orderId || `KB-${Date.now().toString().slice(-6)}`,
          ...body,
          createdAt: new Date().toISOString(),
          storage: 'local_fallback'
        };
        return res.status(201).json({
          success: true,
          message: 'Order created in local fallback mode (MONGODB_URI not configured).',
          order: mockOrder
        });
      }
      return res.status(200).json({
        success: true,
        storage: 'local_fallback',
        orders: []
      });
    }

    const ordersCol = db.collection('orders');

    // GET /api/orders
    if (req.method === 'GET') {
      const { id, phone } = req.query || {};

      if (id) {
        const order = await ordersCol.findOne({ orderId: id });
        if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
        }
        return res.status(200).json({ success: true, order });
      }

      if (phone) {
        const orders = await ordersCol.find({ 'customer.phone': phone }).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ success: true, orders });
      }

      // Return recent 50 orders for Admin operations
      const orders = await ordersCol.find({}).sort({ createdAt: -1 }).limit(50).toArray();
      return res.status(200).json({ success: true, count: orders.length, orders });
    }

    // POST /api/orders
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const orderId = body.orderId || `KB-${Date.now().toString().slice(-6)}`;

      const orderDoc = {
        orderId,
        customer: body.customer || {},
        items: body.items || [],
        pricing: {
          subtotal: body.subtotal || 0,
          discount: body.discount || 0,
          shipping: body.shipping || 0,
          grandTotal: body.grandTotal || 0
        },
        payment: {
          method: body.paymentMethod || 'UPI',
          status: body.paymentStatus || 'Paid (Verified)',
          transactionRef: body.transactionRef || `TXN${Date.now()}`
        },
        delivery: {
          address: body.address || '',
          city: body.city || 'Hyderabad',
          pincode: body.pincode || '',
          slot: body.deliverySlot || 'Standard Delivery (2-3 Days)'
        },
        status: body.status || 'Order Placed',
        timeline: [
          { stage: 'Order Placed', timestamp: new Date().toISOString(), completed: true },
          { stage: 'Baking in Central Kitchen', timestamp: null, completed: false },
          { stage: 'Air Cargo Transit', timestamp: null, completed: false },
          { stage: 'Out for Delivery', timestamp: null, completed: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await ordersCol.insertOne(orderDoc);

      return res.status(201).json({
        success: true,
        message: 'Order saved to MongoDB Atlas',
        orderId,
        order: orderDoc
      });
    }

    // PATCH /api/orders
    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { orderId, status } = body;

      if (!orderId || !status) {
        return res.status(400).json({ success: false, message: 'orderId and status required' });
      }

      const result = await ordersCol.updateOne(
        { orderId },
        { 
          $set: { 
            status, 
            updatedAt: new Date().toISOString() 
          } 
        }
      );

      return res.status(200).json({
        success: true,
        message: `Order ${orderId} updated to ${status}`,
        matchedCount: result.matchedCount
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/orders:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
