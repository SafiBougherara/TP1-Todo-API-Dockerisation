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
 * Appelée au démarrage du serveur.
 */
const initDB = async () => {
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
};

module.exports = { pool, initDB };
