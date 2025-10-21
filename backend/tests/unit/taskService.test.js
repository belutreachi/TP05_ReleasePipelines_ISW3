const TaskService = require('../../src/services/taskService');

describe('TaskService', () => {
  it('crea una tarea con título y descripcion opcional', () => {
    const service = new TaskService();
    const task = service.create({ title: 'Aprender pruebas', description: 'Repasar Jest' });

    expect(task).toEqual(
      expect.objectContaining({
        title: 'Aprender pruebas',
        description: 'Repasar Jest',
        completed: false
      })
    );
    expect(service.list()).toHaveLength(1);
  });

  it('lanza error si el título no está presente', () => {
    const service = new TaskService();

    expect(() => service.create({ description: 'sin título' })).toThrow('El título es obligatorio');
  });

  it('permite alternar el estado de completado', () => {
    const service = new TaskService();
    const task = service.create({ title: 'Probar toggle' });

    const toggled = service.toggle(task.id);

    expect(toggled.completed).toBe(true);
    expect(toggled.completedAt).toBeDefined();
  });
});
