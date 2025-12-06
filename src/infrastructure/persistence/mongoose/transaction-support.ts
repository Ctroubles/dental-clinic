import mongoose from "mongoose"
import { logger } from "~/config"

/**
 * Checks if MongoDB supports transactions by checking the server configuration.
 * @returns Promise<boolean> - true if transactions are supported, false otherwise
 */
export async function checkTransactionSupport(): Promise<boolean> {
  try {
    // Ensure connection is ready
    if (mongoose.connection.readyState !== 1) {
      logger.warn(
        "[TransactionSupport] MongoDB connection not ready. Cannot check transaction support."
      )
      return false
    }

    const admin = mongoose.connection.db?.admin()
    if (!admin) {
      logger.warn(
        "[TransactionSupport] Cannot access MongoDB admin. Cannot check transaction support."
      )
      return false
    }

    const serverStatus = await admin.serverStatus()

    // Check if it's a replica set
    const isReplicaSet =
      serverStatus.repl?.setName !== undefined &&
      serverStatus.repl?.setName !== null &&
      serverStatus.repl?.setName !== ""

    if (isReplicaSet) {
      const replicaSetName = serverStatus.repl.setName

      // Check if it's MongoDB Atlas (Atlas clusters have specific naming patterns)
      const connectionString = mongoose.connection.host || ""
      const isAtlas =
        connectionString.includes("mongodb.net") ||
        connectionString.includes("atlas") ||
        process.env.MONGODB_URI?.includes("mongodb.net") ||
        process.env.MONGODB_URI?.includes("atlas")

      if (isAtlas) {
        logger.info(
          `[TransactionSupport] MongoDB Atlas detected with replica set: ${replicaSetName}. Transactions are fully supported.`
        )
      } else {
        logger.info(
          `[TransactionSupport] MongoDB replica set detected: ${replicaSetName}. Transactions are supported.`
        )
      }

      return true
    }

    // Check if it's a mongos (sharded cluster)
    const isMongos = serverStatus.process === "mongos"
    if (isMongos) {
      logger.info(
        "[TransactionSupport] MongoDB sharded cluster (mongos) detected. Transactions are supported."
      )
      return true
    }

    logger.warn(
      "[TransactionSupport] MongoDB standalone detected. Transactions are not supported."
    )
    return false
  } catch (error) {
    logger.error(
      "[TransactionSupport] Error checking transaction support",
      error
    )
    // If we can't check, assume transactions are not supported to be safe
    return false
  }
}

/**
 * Verifies that MongoDB supports transactions and throws an error with
 * instructions if transactions are not available.
 * @throws Error with instructions if transactions are not supported
 */
export async function ensureTransactionSupport(): Promise<void> {
  const supportsTransactions = await checkTransactionSupport()

  if (!supportsTransactions) {
    // Check if it might be Atlas (connection string pattern)
    const isAtlasConnection =
      process.env.MONGODB_URI?.includes("mongodb.net") ||
      process.env.MONGODB_URI?.includes("atlas")

    if (isAtlasConnection) {
      const errorMessage = `
MongoDB Atlas connection detected, but transactions are not available.

This is unusual because MongoDB Atlas (including free tier M0) comes pre-configured
as a replica set and should support transactions.

Possible causes:
1. The connection string might be incorrect or incomplete
2. The cluster might be in an unusual state
3. There might be a network/connectivity issue

Please verify:
- Your MONGODB_URI connection string is correct
- Your Atlas cluster is running and accessible
- You have the correct network access rules configured in Atlas

If the issue persists, check your Atlas cluster status in the MongoDB Atlas dashboard.
`

      throw new Error(errorMessage.trim())
    }

    // Local/standalone MongoDB
    const errorMessage = `
MongoDB transactions are not available. Transactions require MongoDB to be configured
as a replica set or sharded cluster.

Your MongoDB instance appears to be running in standalone mode (not a replica set).

To enable transactions in development:

1. Stop MongoDB
2. Start MongoDB with replica set configuration:
   mongod --replSet rs0 --port 27017

3. In another terminal, connect to MongoDB and initialize the replica set:
   mongosh
   rs.initiate()

4. Update your MONGODB_URI to include the replica set name:
   mongodb://localhost:27017/your-database?replicaSet=rs0

For production, use MongoDB Atlas which comes pre-configured as a replica set.

Alternatively, you can use Docker with a replica set:
  docker run -d --name mongodb -p 27017:27017 mongo:latest mongod --replSet rs0
  docker exec -it mongodb mongosh --eval "rs.initiate()"
`

    throw new Error(errorMessage.trim())
  }
}
