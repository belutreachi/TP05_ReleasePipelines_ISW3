const request = require('supertest');
const app = require('../../src/app');

describe('API de usuarios', () => {
  describe('GET /api/users', () => {
    it('devuelve la lista de usuarios', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toEqual(
        expect.objectContaining({ id: 'seed-user', name: 'Usuario Demo' })
      );
    });
  });

  describe('GET /api/users/:id', () => {
    it('devuelve un usuario específico', async () => {
      const response = await request(app).get('/api/users/seed-user');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          id: 'seed-user',
          name: 'Usuario Demo',
          email: 'demo@example.com'
        })
      );
    });

    it('devuelve 404 si el usuario no existe', async () => {
      const response = await request(app).get('/api/users/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('POST /api/users', () => {
    it('crea un nuevo usuario', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Nuevo Usuario', email: 'nuevo@example.com', password: 'pass123' });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          name: 'Nuevo Usuario',
          email: 'nuevo@example.com'
        })
      );
      expect(response.body.data.id).toBeDefined();
    });

    it('devuelve 400 si falta el nombre', async () => {
      const response = await request(app).post('/api/users').send({ email: 'test@example.com', password: 'pass123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El nombre y email son obligatorios');
    });

    it('devuelve 400 si falta el email', async () => {
      const response = await request(app).post('/api/users').send({ name: 'Test User', password: 'pass123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El nombre y email son obligatorios');
    });

    it('devuelve 400 si falta la contraseña', async () => {
      const response = await request(app).post('/api/users').send({ name: 'Test User', email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('La contraseña es obligatoria');
    });

    it('devuelve 400 si el email no es válido', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Test User', email: 'invalid-email', password: 'pass123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El formato del email no es válido');
    });

    it('devuelve 400 si el email ya está registrado', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'User 1', email: 'duplicate@example.com', password: 'pass123' });

      const response = await request(app)
        .post('/api/users')
        .send({ name: 'User 2', email: 'duplicate@example.com', password: 'pass456' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El email ya está registrado');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('actualiza un usuario existente', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ name: 'Original Name', email: 'original@example.com', password: 'pass123' });

      const userId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: 'Updated Name' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.name).toBe('Updated Name');
      expect(updateResponse.body.data.email).toBe('original@example.com');
    });

    it('devuelve 404 si el usuario no existe', async () => {
      const response = await request(app)
        .put('/api/users/non-existent-id')
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('elimina un usuario existente', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({ name: 'To Delete', email: 'delete@example.com', password: 'pass123' });

      const userId = createResponse.body.data.id;

      const deleteResponse = await request(app).delete(`/api/users/${userId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.data.id).toBe(userId);

      const getResponse = await request(app).get(`/api/users/${userId}`);
      expect(getResponse.status).toBe(404);
    });

    it('devuelve 404 si el usuario no existe', async () => {
      const response = await request(app).delete('/api/users/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });
});
