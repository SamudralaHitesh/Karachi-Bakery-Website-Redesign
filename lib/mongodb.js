const { MongoClient } = require('mongodb');

/**
 * Global MongoDB Client Connection Cache
 * Bulletproofs the database tier against Atlas connection pool exhaustion
 * during high-concurrency bursts by caching MongoClient and Db handles globally
 * outside serverless handler execution scopes.
 */
const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
};

let client;
let clientPromise;

if (uri) {
  // Global cache across all serverless invocations (both dev & Vercel production)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClient = client;
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  console.warn('⚠️ [MongoDB] MONGODB_URI is not set in environment variables. Running in hybrid/mock mode.');
}

async function getDatabase(dbName = 'crumbelle') {
  // Return cached Db handle if already established
  if (global._cachedDb && global._cachedDbName === dbName) {
    return global._cachedDb;
  }

  if (!clientPromise && !global._mongoClientPromise) {
    return null;
  }

  try {
    const activePromise = clientPromise || global._mongoClientPromise;
    const connectedClient = await activePromise;
    global._cachedDb = connectedClient.db(dbName);
    global._cachedDbName = dbName;
    return global._cachedDb;
  } catch (err) {
    console.error('❌ [MongoDB] Global connection acquisition failed:', err.message);
    // Invalidate cache if connection errored out so next request retries cleanly
    global._mongoClientPromise = null;
    global._cachedDb = null;
    return null;
  }
}

module.exports = {
  clientPromise,
  getDatabase
};
