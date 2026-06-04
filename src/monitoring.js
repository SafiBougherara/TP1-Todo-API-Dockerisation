const client = require('prom-client');

// Collecte automatique des métriques par défaut (CPU, mémoire, event loop...)
client.collectDefaultMetrics();

// Un compteur custom : le nombre total de requêtes HTTP
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status'],
});

module.exports = { client, httpRequests };
