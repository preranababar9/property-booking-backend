import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(mongoUri?: string): Promise<mongoose.Connection> {
  if (isConnected) {
    return mongoose.connection;
  }

  const uri = mongoUri || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: true
  });

  isConnected = true;

  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    // eslint-disable-next-line no-console
    console.warn('MongoDB disconnected');
  });

  return mongoose.connection;
}


