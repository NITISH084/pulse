// File containing shared global level configs.

import dotenv from "dotenv";

dotenv.config();

const config = {
  // 1. server
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || "5000", 10),

  // 2. MongoDB
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pulse',
    dbName: process.env.MONGO_DB_NAME || 'pulse',
  },

  // 3. postgreSQL
  postgres: {
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || "5432", 10),
    database: process.env.PG_DATABASE || 'pulse_postgres',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'nitish'
  },

  // 4. RabbitMQ
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    queue: process.env.RABBITMQ_QUEUE || 'api_hits',
    publisherConfirms: process.env.RABBITMQ_PUBLISHER_CONFIRMS === 'true' || false, // Lost messages.
    retryAttempts: parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(process.env.RABBITMQ_RETRY_DELAY || '1000', 10),
  },

  // 5. jwt
  jwt: {
    secret: process.env.JWT_SECRET || '3b1c65550f4e2a56963a99af6e25a1f3',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  // 6. Rate Limit
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10), // 1000 req / 15 min per IP
  },

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expiresIn: 24*60*60*1000 // 1 day
  }
}

export default config;
