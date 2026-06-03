const { pool } = require('../db');

/**
 * Récupère toutes les tâches, triées par date de création desc.
 */
const findAll = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM tasks ORDER BY created_at DESC'
  );
  return rows;
};

/**
 * Récupère une tâche par son id.
 */
const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM tasks WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

/**
 * Crée une nouvelle tâche.
 * @param {{ title?: string, description?: string, status?: string }} data
 */
const create = async ({ title, description, status = 'todo' }) => {
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, description, status)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, description, status]
  );
  return rows[0];
};

/**
 * Met à jour une tâche (champs partiels autorisés via COALESCE).
 * @param {number} id
 * @param {{ title?: string, description?: string, status?: string }} data
 */
const update = async (id, { title, description, status }) => {
  const { rows } = await pool.query(
    `UPDATE tasks
     SET title       = COALESCE($1, title),
         description = COALESCE($2, description),
         status      = COALESCE($3, status),
         updated_at  = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, description, status, id]
  );
  return rows[0] || null;
};

/**
 * Supprime une tâche et la retourne.
 */
const remove = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
};

module.exports = { findAll, findById, create, update, remove };
