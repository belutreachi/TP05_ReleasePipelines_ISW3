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
});
