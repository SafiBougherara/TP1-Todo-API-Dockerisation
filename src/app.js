const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');
const { client, httpRequests } = require('./monitoring');

const app = express();

// Sécurité & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Métriques Prometheus middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    if (req.path !== '/metrics') {
      httpRequests.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status: res.statusCode,
      });
    }
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Endpoint de métriques
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Routes
app.use('/api/tasks', taskRoutes);

// Gestion centralisée des erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;
