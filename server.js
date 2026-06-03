require('dotenv').config();
const app = require('./src/app');
const { initDB } = require('./src/db');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`[SERVER] App démarrée sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[SERVER] Erreur au démarrage :', err.message);
    process.exit(1);
  }
};

start();
