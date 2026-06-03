const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// GET /api/tasks — lister toutes les tâches
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id — voir une tâche
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks — créer une tâche
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!description && !title) {
      return res.status(400).json({ error: 'title ou description requis' });
    }
    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id — modifier une tâche
router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.update(req.params.id, { title, description, status });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id — supprimer une tâche
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.remove(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', task });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
