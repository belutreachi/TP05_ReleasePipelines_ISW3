const request = require('supertest');
const app = require('../../src/app');

describe('API de autenticación', () => {
  describe('POST /api/auth/register', () => {
    it('registra un nuevo usuario y devuelve sesión', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Nuevo Usuario', email: 'nuevo@test.com', password: 'pass123' });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          name: 'Nuevo Usuario',
          email: 'nuevo@test.com'
        })
      );
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('devuelve 400 si faltan campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test' });

      expect(response.status).toBe(400);
    });

    it('devuelve 400 si el email ya existe', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'User 1', email: 'dup@test.com', password: 'pass123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User 2', email: 'dup@test.com', password: 'pass456' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El email ya está registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('autentica un usuario existente', async () => {
      // First register a user
      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'login@test.com', password: 'pass123' });

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@test.com', password: 'pass123' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          email: 'login@test.com'
        })
      );
    });

    it('autentica con usuario seed', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@example.com', password: 'demo123' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('sessionId');
    });

    it('devuelve 401 si la contraseña es incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('devuelve 401 si el usuario no existe', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'noexiste@test.com', password: 'pass123' });

      expect(response.status).toBe(401);
    });

    it('devuelve 400 si faltan campos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/session', () => {
    it('valida una sesión válida', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@example.com', password: 'demo123' });

      const sessionId = loginResponse.body.data.sessionId;

      const response = await request(app)
        .get('/api/auth/session')
        .set('x-session-id', sessionId);

      expect(response.status).toBe(200);
      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          email: 'demo@example.com'
        })
      );
    });

    it('devuelve 401 si la sesión no es válida', async () => {
      const response = await request(app)
        .get('/api/auth/session')
        .set('x-session-id', 'invalid-session-id');

      expect(response.status).toBe(401);
    });

    it('devuelve 401 si no hay sesión', async () => {
      const response = await request(app).get('/api/auth/session');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('cierra sesión correctamente', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@example.com', password: 'demo123' });

      const sessionId = loginResponse.body.data.sessionId;

      const response = await request(app)
        .post('/api/auth/logout')
        .set('x-session-id', sessionId);

      expect(response.status).toBe(200);

      // Verify session is invalidated
      const sessionCheck = await request(app)
        .get('/api/auth/session')
        .set('x-session-id', sessionId);

      expect(sessionCheck.status).toBe(401);
    });

    it('funciona incluso sin sesión válida', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
    });
  });
});
