/**
 * Middleware de gestion d'erreurs centralisée.
 * Doit être déclaré en dernier dans app.js (après toutes les routes).
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
