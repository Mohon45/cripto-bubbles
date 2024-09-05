import mongoose from "mongoose";

const cached = {};

async function connectToDatabase() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!process.env.ATLAS_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }

  const conn = await mongoose.connect(process.env.ATLAS_URI);

  cached.conn = conn;
  return conn;
}

export default connectToDatabase;
