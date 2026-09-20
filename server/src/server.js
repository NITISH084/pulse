import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './shared/config/index.js';
import ResponseFormatter from '../utils/responseFormatter.js'
import errorHandler from './shared/middlewares/errorhandler.js';
import logger from './shared/config/logger.js';
import mongodb from './shared/config/mongodb.js';
import postgres from './shared/config/postgres.js';
import rabbitmq from './shared/config/rabbitmq.js';
/**
 * Initialize Express app
 */
const app = express();

/**
 * Apply middlewares.
 */
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Request logging middleware
 * Logs the HTTP method, path, IP address, and user agent for each incoming request.
 */
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });
  next();
})

/**
 * Health check endpoint.
 */
app.get('/health', (req, res) => {
  res.status(200).json(
    ResponseFormatter.success(
      {
        service: 'Pulse',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          auth: '/api/auth',
          ingest: '/api/hit',
          analytics: '/api/analytics',
        },
      },
      'Pulse is healthy'
    )
  );
});

/**
 * TODO: API Routes.
 */

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json(
    ResponseFormatter.error(
      "Endpoint not found",
      404
    )
  )
})

app.use(errorHandler);

/**
 * Initialize database connections and start the server
 */
async function initializeConnection() {
  try {
    logger.info("Initializing database connections...")

    // Connecting to MongoDB;
    await mongodb.connect();

    // Connecting to PG;
    await postgres.testConnection();

    // Connect to RabbitMQ;
    await rabbitmq.connect();

    logger.info("All connections established successfully")
  } catch (error) {
    logger.error("Failed to initialize connections", error);
    throw error;
  }
}

  /**
   * Start the Express server after establishing database connections.
   * Also sets up graceful shutdown handlers for SIGINT and SIGTERM signals.
   * On shutdown, it closes the HTTP server and all database connections before exiting the process.
   * If any error occurs during startup or shutdown, it logs the error and exits with a non-zero status code.
   */
  async function startServer() {
    try {
      await initializeConnection();

      const server = app.listen(config.port, () => {
        logger.info(`Server started on port ${config.port}`);
        logger.info(`Environment: ${config.node_env}`);
        logger.info(`API available at: http://localhost:${config.port}`);
      });

      const gracefulShutdown = async (signal) => {
        logger.info(`${signal} recieved, shutting down gracefully...`);

        server.close(async () => {
          logger.info("HTTP server closed");

          try {
            await mongodb.disconnect();
            await postgres.close();
            await rabbitmq.close();
            logger.info('All connections closed, exiting process');
            process.exit(0);
          } catch (error) {
            logger.error('Error during shutdown:', error);
            process.exit(1);
          }
        })

        setTimeout(() => {
          logger.error("Forced shutdown");
          process.exit(1);
        }, 10000);
      }

      process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
      process.on("SIGINT", () => gracefulShutdown("SIGINT"));

      // Handle uncaught exceptions
      process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception:', error);
        gracefulShutdown('uncaughtException');
      });

      process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        gracefulShutdown('unhandledRejection');
      });
    } catch (error) {
      logger.error('Failed to start server', error);
      process.exit(1);
    }
  }

  startServer();
