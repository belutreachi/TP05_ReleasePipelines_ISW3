const TaskService = require('../../src/services/taskService');

describe('TaskService', () => {
  it('crea una tarea con título y descripcion opcional', () => {
    const service = new TaskService();
    const task = service.create({ title: 'Aprender pruebas', description: 'Repasar Jest' });

    expect(task).toEqual(
      expect.objectContaining({
        title: 'Aprender pruebas',
        description: 'Repasar Jest',
        completed: false,
        userId: null
      })
    );
    expect(service.list()).toHaveLength(1);
  });

  it('crea una tarea con userId cuando se proporciona', () => {
    const service = new TaskService();
    const task = service.create({
      title: 'Tarea de usuario',
      description: 'Tarea asignada',
      userId: 'user-123'
    });

    expect(task).toEqual(
      expect.objectContaining({
        title: 'Tarea de usuario',
        description: 'Tarea asignada',
        userId: 'user-123',
        completed: false
      })
    );
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

  it('lista tareas filtradas por userId', () => {
    const service = new TaskService();
    service.create({ title: 'Tarea 1', userId: 'user-1' });
    service.create({ title: 'Tarea 2', userId: 'user-2' });
    service.create({ title: 'Tarea 3', userId: 'user-1' });

    const userTasks = service.list('user-1');

    expect(userTasks).toHaveLength(2);
    expect(userTasks.every((task) => task.userId === 'user-1')).toBe(true);
  });

  it('lista todas las tareas cuando no se proporciona userId', () => {
    const service = new TaskService();
    service.create({ title: 'Tarea 1', userId: 'user-1' });
    service.create({ title: 'Tarea 2', userId: 'user-2' });

    const allTasks = service.list();

    expect(allTasks).toHaveLength(2);
  });

  it('elimina una tarea por ID', () => {
    const service = new TaskService();
    const task = service.create({ title: 'Tarea a eliminar' });

    const deleted = service.delete(task.id);

    expect(deleted.id).toBe(task.id);
    expect(service.list()).toHaveLength(0);
  });

  it('lanza error al eliminar tarea inexistente', () => {
    const service = new TaskService();

    expect(() => service.delete('non-existent-id')).toThrow('Tarea no encontrada');
  });

  it('elimina todas las tareas de un usuario', () => {
    const service = new TaskService();
    service.create({ title: 'Tarea 1', userId: 'user-1' });
    service.create({ title: 'Tarea 2', userId: 'user-2' });
    service.create({ title: 'Tarea 3', userId: 'user-1' });

    service.deleteByUserId('user-1');

    const remainingTasks = service.list();
    expect(remainingTasks).toHaveLength(1);
    expect(remainingTasks[0].userId).toBe('user-2');
  });
});
