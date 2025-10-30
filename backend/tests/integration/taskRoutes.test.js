const request = require('supertest');
const app = require('../../src/app');

describe('API de tareas', () => {
  it('responde con estado ok en health', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('devuelve la lista inicial de tareas', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0]).toEqual(
      expect.objectContaining({ id: 'seed-task', title: 'Explorar la API' })
    );
  });

  it('crea y alterna una tarea', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Escribir documentación' });

    expect(createResponse.status).toBe(201);

    const taskId = createResponse.body.data.id;
    const toggleResponse = await request(app).post(`/api/tasks/${taskId}/toggle`);

    expect(toggleResponse.status).toBe(200);
    expect(toggleResponse.body.data.completed).toBe(true);
  });

  it('crea una tarea con userId', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Tarea con usuario', userId: 'user-123' });

    expect(response.status).toBe(201);
    expect(response.body.data.userId).toBe('user-123');
  });

  it('obtiene una tarea específica por ID', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Tarea específica' });

    const taskId = createResponse.body.data.id;
    const response = await request(app).get(`/api/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(taskId);
  });

  it('filtra tareas por userId', async () => {
    await request(app).post('/api/tasks').send({ title: 'Tarea 1', userId: 'user-1' });
    await request(app).post('/api/tasks').send({ title: 'Tarea 2', userId: 'user-2' });
    await request(app).post('/api/tasks').send({ title: 'Tarea 3', userId: 'user-1' });

    const response = await request(app).get('/api/tasks?userId=user-1');

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    expect(response.body.data.every((task) => task.userId === 'user-1')).toBe(true);
  });

  it('elimina una tarea', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Tarea a eliminar' });

    const taskId = createResponse.body.data.id;
    const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data.id).toBe(taskId);

    const getResponse = await request(app).get(`/api/tasks/${taskId}`);
    expect(getResponse.status).toBe(404);
  });
});
