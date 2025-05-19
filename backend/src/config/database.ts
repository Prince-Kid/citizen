import mongoose from "mongoose";
import { logger } from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Log database name and collections
    const dbName = conn.connection.db.databaseName;
    const collections = await conn.connection.db.listCollections().toArray();
    logger.info(`Connected to database: ${dbName}`);
    logger.info(
      `Available collections: ${collections.map((c) => c.name).join(", ")}`
    );
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
