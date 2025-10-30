const request = require('supertest');
const app = require('../../src/app');

describe('API de tareas', () => {
  let userSessionId;
  let adminSessionId;

  beforeAll(async () => {
    // Login as regular user
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@example.com', password: 'demo123' });
    userSessionId = userLogin.body.data.sessionId;

    // Login as admin
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    adminSessionId = adminLogin.body.data.sessionId;
  });

  it('responde con estado ok en health', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('requiere autenticación para ver tareas', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(401);
  });

  it('devuelve la lista de tareas del usuario autenticado', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('x-session-id', userSessionId);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('admin puede ver todas las tareas', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('x-session-id', adminSessionId);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('crea y alterna una tarea', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .set('x-session-id', userSessionId)
      .send({ title: 'Escribir documentación' });

    expect(createResponse.status).toBe(201);

    const taskId = createResponse.body.data.id;
    const toggleResponse = await request(app)
      .post(`/api/tasks/${taskId}/toggle`)
      .set('x-session-id', userSessionId);

    expect(toggleResponse.status).toBe(200);
    expect(toggleResponse.body.data.completed).toBe(true);
  });

  it('crea una tarea y la asigna al usuario autenticado', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('x-session-id', userSessionId)
      .send({ title: 'Tarea automática' });

    expect(response.status).toBe(201);
    expect(response.body.data.userId).toBeDefined();
  });

  it('obtiene una tarea específica por ID', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .set('x-session-id', userSessionId)
      .send({ title: 'Tarea específica' });

    const taskId = createResponse.body.data.id;
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('x-session-id', userSessionId);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(taskId);
  });

  it('usuario no puede ver tareas de otros usuarios', async () => {
    // Create a second user
    const newUserResponse = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Other User', email: 'other@test.com', password: 'pass123' });
    
    const otherSessionId = newUserResponse.body.data.sessionId;

    // Other user creates a task
    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('x-session-id', otherSessionId)
      .send({ title: 'Private task' });

    const taskId = taskResponse.body.data.id;

    // Original user tries to view it
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('x-session-id', userSessionId);

    expect(response.status).toBe(403);
  });

  it('admin puede ver tareas de cualquier usuario', async () => {
    // User creates a task
    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('x-session-id', userSessionId)
      .send({ title: 'User task' });

    const taskId = taskResponse.body.data.id;

    // Admin can view it
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('x-session-id', adminSessionId);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(taskId);
  });

  it('elimina una tarea', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .set('x-session-id', userSessionId)
      .send({ title: 'Tarea a eliminar' });

    const taskId = createResponse.body.data.id;
    const deleteResponse = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('x-session-id', userSessionId);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data.id).toBe(taskId);

    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('x-session-id', userSessionId);
    expect(getResponse.status).toBe(404);
  });
});
