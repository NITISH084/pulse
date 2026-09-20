import mongoose from "mongoose"
import config from "./index.js"
import logger from "./logger.js"

/**
 * @description MongoDB Connector with Singelton design pattern.
 */
class MongoConnection {
  constructor() {
    this.connection = null;
  }

  /**
   * Connect to MongoDB 
   */
  async connect() {
    try {
      if (this.connection) {
        logger.info("MongoDB is already connected");
        return this.connection;
      }

      await mongoose.connect(
        config.mongo.uri,
        {
          dbName: config.mongo.dbName
        }
      )

      this.connection = mongoose.connection;
      logger.info(`MongoDB is connected: ${config.mongo.uri}`);

      this.connection.on("error", err => {
        logger.error("MongoDB connection error", err);
      })

      this.connection.on("disconnected", () => {
        logger.error("MongoDB connection disconnected");
      })

      return this.connection;
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Disconnect the active MongoDB connection.
   */
  async disconnect() {
    try {
      if(this.connection){
        await mongoose.disconnect();
        this.connection = null;
        logger.info("MongoDB disconnected!")
      }
    } catch (error) {
      logger.error('Failed to disconnect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get the active MongoDB connection.
   */
  getConnection() {
    return this.connection;
  }
}

export default new MongoConnection();
