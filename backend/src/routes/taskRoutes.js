const express = require('express');
const TaskService = require('../services/taskService');
const requireAuth = require('../middleware/requireAuth');

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

// Protect all task routes
router.use(requireAuth);

// GET /api/tasks - Listar todas las tareas (filtradas por usuario o todas si es admin)
router.get('/', (req, res) => {
  const { isAdmin, userId } = req.session;
  
  // Admin can see all tasks, regular users only see their own
  let tasks = isAdmin ? taskService.list() : taskService.list(userId);
  
  // Enrich tasks with creator names for admin users
  if (isAdmin) {
    const userService = req.app.get('userService');
    tasks = tasks.map(task => {
      if (task.userId) {
        try {
          const user = userService.findById(task.userId);
          return { ...task, creatorName: user.name };
        } catch (error) {
          return task;
        }
      }
      return task;
    });
  }
  
  res.json({ data: tasks });
});

// GET /api/tasks/:id - Obtener una tarea por ID
router.get('/:id', (req, res) => {
  try {
    let task = taskService.findById(req.params.id);
    const { isAdmin, userId } = req.session;
    
    // Check authorization: user must own the task or be admin
    if (!isAdmin && task.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta tarea' });
    }
    
    // Enrich task with creator name for admin users
    if (isAdmin && task.userId) {
      const userService = req.app.get('userService');
      try {
        const user = userService.findById(task.userId);
        task = { ...task, creatorName: user.name };
      } catch (error) {
        // Ignore if user not found
      }
    }
    
    res.json({ data: task });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST /api/tasks - Crear una nueva tarea
router.post('/', (req, res) => {
  try {
    const { userId } = req.session;
    const taskData = { ...req.body, userId };
    
    const task = taskService.create(taskData);
    res.status(201).json({ data: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/tasks/:id/toggle - Alternar estado de completado
router.post('/:id/toggle', (req, res) => {
  try {
    const task = taskService.findById(req.params.id);
    const { isAdmin, userId } = req.session;
    
    // Check authorization: user must own the task or be admin
    if (!isAdmin && task.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta tarea' });
    }
    
    const updatedTask = taskService.toggle(req.params.id);
    res.json({ data: updatedTask });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - Eliminar una tarea
router.delete('/:id', (req, res) => {
  try {
    const task = taskService.findById(req.params.id);
    const { isAdmin, userId } = req.session;
    
    // Check authorization: user must own the task or be admin
    if (!isAdmin && task.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta tarea' });
    }
    
    const deletedTask = taskService.delete(req.params.id);
    res.json({ data: deletedTask });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
module.exports.taskService = taskService;
