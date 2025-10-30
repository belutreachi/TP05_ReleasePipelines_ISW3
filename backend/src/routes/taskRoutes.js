const express = require('express');
const TaskService = require('../services/taskService');

const router = express.Router();
const taskService = new TaskService([
  {
    id: 'seed-task',
    title: 'Explorar la API',
    description: 'Revisar los endpoints disponibles y sus respuestas',
    userId: null,
    createdAt: new Date().toISOString(),
    completed: false
  }
]);

// GET /api/tasks - Listar todas las tareas (opcionalmente filtradas por userId)
router.get('/', (req, res) => {
  const userId = req.query.userId;
  res.json({ data: taskService.list(userId) });
});

// GET /api/tasks/:id - Obtener una tarea por ID
router.get('/:id', (req, res) => {
  try {
    const task = taskService.findById(req.params.id);
    res.json({ data: task });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST /api/tasks - Crear una nueva tarea
router.post('/', (req, res) => {
  try {
    const task = taskService.create(req.body || {});
    res.status(201).json({ data: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/tasks/:id/toggle - Alternar estado de completado
router.post('/:id/toggle', (req, res) => {
  try {
    const task = taskService.toggle(req.params.id);
    res.json({ data: task });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - Eliminar una tarea
router.delete('/:id', (req, res) => {
  try {
    const task = taskService.delete(req.params.id);
    res.json({ data: task });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
module.exports.taskService = taskService;
