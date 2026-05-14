import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error("MONGODB_URI is missing in .env.local")

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalAny = global as unknown as { mongoose?: MongooseCache }

if (!globalAny.mongoose) {
  globalAny.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  const cached = globalAny.mongoose!

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  cached.conn = await cached.promise
  return cached.conn
}
