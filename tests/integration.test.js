const request = require('supertest');
const app = require('../src/app');
const { pool, initDB } = require('../src/db');

beforeAll(async () => {
  // Initialise la table tasks dans la base de test
  await initDB();
});

afterAll(async () => {
  // Ferme la connexion à la base pour éviter que Jest ne reste bloqué
  await pool.end();
});

describe('Todo API Integration Tests', () => {
  // Nettoyer la table avant chaque test
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE tasks RESTART IDENTITY CASCADE');
  });

  // Happy path
  test('POST /api/tasks crée une tâche et GET /api/tasks la retrouve', async () => {
    const postRes = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Tâche Test',
        description: 'Tester l\'API',
        status: 'todo'
      });

    expect(postRes.status).toBe(201);
    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body.title).toBe('Tâche Test');

    const getRes = await request(app).get('/api/tasks');
    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveLength(1);
    expect(getRes.body[0].title).toBe('Tâche Test');
  });

  // Edge case
  test('GET /api/tasks/:id pour un id inexistant retourne 404', async () => {
    const res = await request(app).get('/api/tasks/9999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Task not found');
  });

  // Adverse scenario
  test('POST /api/tasks avec un body vide retourne 400', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'title ou description requis');
  });
});
