const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'todo_db',
  user: process.env.DB_USER || 'todo_user',
  password: process.env.DB_PASSWORD || 'todo_pass',
});

/**
 * Crée la table tasks si elle n'existe pas encore.
 * Inclut un mécanisme de retry car avec docker-compose, depends_on
 * ne garantit pas que PostgreSQL est prêt à accepter des connexions.
 * @param {number} retries - nombre de tentatives
 * @param {number} delay   - délai en ms entre chaque tentative
 */
const initDB = async (retries = 10, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id          SERIAL PRIMARY KEY,
          title       VARCHAR(255),
          description TEXT,
          status      VARCHAR(50) NOT NULL DEFAULT 'todo',
          created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
          updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
        )
      `);
      console.log('[DB] Table tasks prête.');
      return;
    } catch (err) {
      console.log(
        `[DB] Tentative ${attempt}/${retries} échouée — retry dans ${delay / 1000}s... (${err.message})`
      );
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

module.exports = { pool, initDB };
