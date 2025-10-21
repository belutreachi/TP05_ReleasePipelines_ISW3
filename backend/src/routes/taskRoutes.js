const express = require('express');
const TaskService = require('../services/taskService');

const router = express.Router();
const taskService = new TaskService([
  {
    id: 'seed-task',
    title: 'Explorar la API',
    description: 'Revisar los endpoints disponibles y sus respuestas',
    createdAt: new Date().toISOString(),
    completed: false
  }
]);

router.get('/', (req, res) => {
  res.json({ data: taskService.list() });
});

router.post('/', (req, res) => {
  try {
    const task = taskService.create(req.body || {});
    res.status(201).json({ data: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/toggle', (req, res) => {
  try {
    const task = taskService.toggle(req.params.id);
    res.json({ data: task });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
