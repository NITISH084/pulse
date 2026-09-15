import pg from "pg"
import config from "./index.js"
import logger from "./logger.js"

const { Pool } = pg

/**
 * @description PostgreSQL Connector with Singelton design pattern.
 */
class PostgresConnection {
  constructor() {
    this.pool = null;
  }

  getPool() {
    if(!this.pool){
      this.pool = new Pool({
        host: config.postgres.host,
        port: config.postgres.port,
        database: config.postgres.database,
        user: config.postgres.user,
        password: config.postgres.password,
        max:20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      })

      this.pool.on("error", err => {
        logger.error("Unexpected error on idle PG client", err);
      })
      logger.info(`PostgreSQL is connected: ${config.postgres.host}:${config.postgres.port}`);
    }
    return this.pool;
  }

  // TODOs:
  // 1. testconnection()
  // 2. query()

  async close() {
    if(this.pool){
      await this.pool.end();
      this.pool = null;
      logger.info("PG pool closed!")
    }
  }
}

export default new PostgresConnection();
