const { randomUUID } = require('node:crypto');

class TaskService {
  constructor(initialTasks = []) {
    this.tasks = initialTasks;
  }

  list(userId = null) {
    if (userId) {
      return this.tasks.filter((task) => task.userId === userId);
    }
    return this.tasks;
  }

  findById(taskId) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }
    return task;
  }

  create({ title, description, userId }) {
    if (!title) {
      throw new Error('El título es obligatorio');
    }

    const newTask = {
      id: randomUUID(),
      title,
      description: description || '',
      userId: userId || null,
      createdAt: new Date().toISOString(),
      completed: false
    };

    this.tasks.push(newTask);
    return newTask;
  }

  toggle(taskId) {
    const task = this.findById(taskId);

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    return task;
  }

  delete(taskId) {
    const index = this.tasks.findIndex((item) => item.id === taskId);
    if (index === -1) {
      throw new Error('Tarea no encontrada');
    }

    const deletedTask = this.tasks[index];
    this.tasks.splice(index, 1);
    return deletedTask;
  }

  deleteByUserId(userId) {
    this.tasks = this.tasks.filter((task) => task.userId !== userId);
  }
}

module.exports = TaskService;
