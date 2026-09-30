const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  console.warn('⚠️ [MongoDB] MONGODB_URI is not set in environment variables. Running in hybrid/mock mode.');
}

async function getDatabase(dbName = 'karachi_bakery') {
  if (!clientPromise) {
    return null;
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

module.exports = {
  clientPromise,
  getDatabase
};
