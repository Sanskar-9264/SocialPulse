import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to provided URI: ${uri}`);
      return uri;
    } catch (err) {
      console.warn(`[MongoDB] Failed to connect to MONGODB_URI. Falling back to Memory Server.`, err);
    }
  }

  // Fallback: In-memory database server
  mongoMemoryServer = await MongoMemoryServer.create();
  const memUri = mongoMemoryServer.getUri();
  await mongoose.connect(memUri);
  console.log(`[MongoDB] Connected to MongoMemoryServer: ${memUri}`);
  return memUri;
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
