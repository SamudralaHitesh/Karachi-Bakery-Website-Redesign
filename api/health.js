const { getDatabase } = require('../lib/mongodb');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const startTime = Date.now();
  const uriConfigured = Boolean(process.env.MONGODB_URI);

  try {
    const db = await getDatabase();

    if (!db) {
      return res.status(200).json({
        status: 'hybrid_local_fallback',
        mongodbConnected: false,
        message: 'MONGODB_URI environment variable is not configured. Running in high-performance local fallback mode.',
        help: 'To connect your live MongoDB Atlas cluster, set the MONGODB_URI environment variable in Vercel.',
        latencyMs: Date.now() - startTime
      });
    }

    // Ping the database
    await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    return res.status(200).json({
      status: 'healthy',
      mongodbConnected: true,
      database: db.databaseName,
      collections: collectionNames,
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      mongodbConnected: false,
      error: err.message,
      latencyMs: Date.now() - startTime
    });
  }
};
