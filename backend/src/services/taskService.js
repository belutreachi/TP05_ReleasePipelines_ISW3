const { randomUUID } = require('node:crypto');

class TaskService {
  constructor(initialTasks = []) {
    this.tasks = initialTasks;
  }

  list() {
    return this.tasks;
  }

  create({ title, description }) {
    if (!title) {
      throw new Error('El título es obligatorio');
    }

    const newTask = {
      id: randomUUID(),
      title,
      description: description || '',
      createdAt: new Date().toISOString(),
      completed: false
    };

    this.tasks.push(newTask);
    return newTask;
  }

  toggle(taskId) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    return task;
  }
}

module.exports = TaskService;
