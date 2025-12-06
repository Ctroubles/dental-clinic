import mongoose from "mongoose"

declare global {
  var mongooseCache: {
    connection: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const MONGODB_URI: string = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  throw new ReferenceError(
    "MONGODB_URI environment variable is not defined. Database connection cannot be established."
  )
}

let cachedDB = global.mongooseCache

if (!cachedDB) {
  cachedDB = global.mongooseCache = { connection: null, promise: null }
}

export async function ensureDbConnection() {
  if (cachedDB.connection) {
    return cachedDB.connection
  }

  if (!cachedDB.promise) {
    cachedDB.promise = mongoose
      .connect(MONGODB_URI)
      .then(mongoose => {
        import("@/infrastructure/persistence/mongoose/models")
        return mongoose
      })
      .catch(error => {
        throw error
      })
  }
  cachedDB.connection = await cachedDB.promise
  return cachedDB.connection
}

export default ensureDbConnection
