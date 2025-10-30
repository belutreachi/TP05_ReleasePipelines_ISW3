const UserService = require('../../src/services/userService');

describe('UserService', () => {
  describe('create', () => {
    it('crea un usuario con nombre y email', () => {
      const service = new UserService();
      const user = service.create({ name: 'Juan Pérez', email: 'juan@example.com', password: 'pass123' });

      expect(user).toEqual(
        expect.objectContaining({
          name: 'Juan Pérez',
          email: 'juan@example.com'
        })
      );
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(service.list()).toHaveLength(1);
    });

    it('lanza error si el nombre no está presente', () => {
      const service = new UserService();

      expect(() => service.create({ email: 'test@example.com', password: 'pass123' })).toThrow(
        'El nombre y email son obligatorios'
      );
    });

    it('lanza error si el email no está presente', () => {
      const service = new UserService();

      expect(() => service.create({ name: 'Test User', password: 'pass123' })).toThrow(
        'El nombre y email son obligatorios'
      );
    });

    it('lanza error si la contraseña no está presente', () => {
      const service = new UserService();

      expect(() => service.create({ name: 'Test User', email: 'test@example.com' })).toThrow(
        'La contraseña es obligatoria'
      );
    });

    it('lanza error si el email no tiene formato válido', () => {
      const service = new UserService();

      expect(() => service.create({ name: 'Test User', email: 'invalid-email', password: 'pass123' })).toThrow(
        'El formato del email no es válido'
      );
    });

    it('lanza error si el email ya está registrado', () => {
      const service = new UserService();
      service.create({ name: 'User 1', email: 'test@example.com', password: 'pass123' });

      expect(() => service.create({ name: 'User 2', email: 'test@example.com', password: 'pass456' })).toThrow(
        'El email ya está registrado'
      );
    });
  });

  describe('list', () => {
    it('devuelve lista vacía cuando no hay usuarios', () => {
      const service = new UserService();

      expect(service.list()).toEqual([]);
    });

    it('devuelve todos los usuarios', () => {
      const service = new UserService();
      service.create({ name: 'User 1', email: 'user1@example.com', password: 'pass123' });
      service.create({ name: 'User 2', email: 'user2@example.com', password: 'pass456' });

      expect(service.list()).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('encuentra un usuario por ID', () => {
      const service = new UserService();
      const user = service.create({ name: 'Test User', email: 'test@example.com', password: 'pass123' });

      const found = service.findById(user.id);

      expect(found).toEqual(user);
    });

    it('lanza error si el usuario no existe', () => {
      const service = new UserService();

      expect(() => service.findById('non-existent-id')).toThrow('Usuario no encontrado');
    });
  });

  describe('findByEmail', () => {
    it('encuentra un usuario por email', () => {
      const service = new UserService();
      const user = service.create({ name: 'Test User', email: 'test@example.com', password: 'pass123' });

      const found = service.findByEmail('test@example.com');

      expect(found).toEqual(user);
    });

    it('devuelve undefined si el email no existe', () => {
      const service = new UserService();

      expect(service.findByEmail('nonexistent@example.com')).toBeUndefined();
    });
  });

  describe('update', () => {
    it('actualiza el nombre de un usuario', () => {
      const service = new UserService();
      const user = service.create({ name: 'Old Name', email: 'test@example.com', password: 'pass123' });

      const updated = service.update(user.id, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.email).toBe('test@example.com');
    });

    it('actualiza el email de un usuario', () => {
      const service = new UserService();
      const user = service.create({ name: 'Test User', email: 'old@example.com', password: 'pass123' });

      const updated = service.update(user.id, { email: 'new@example.com' });

      expect(updated.email).toBe('new@example.com');
    });

    it('lanza error si el nuevo email ya está en uso', () => {
      const service = new UserService();
      const user1 = service.create({ name: 'User 1', email: 'user1@example.com', password: 'pass123' });
      service.create({ name: 'User 2', email: 'user2@example.com', password: 'pass456' });

      expect(() => service.update(user1.id, { email: 'user2@example.com' })).toThrow(
        'El email ya está registrado'
      );
    });

    it('lanza error si el usuario no existe', () => {
      const service = new UserService();

      expect(() => service.update('non-existent-id', { name: 'New Name' })).toThrow(
        'Usuario no encontrado'
      );
    });
  });

  describe('delete', () => {
    it('elimina un usuario por ID', () => {
      const service = new UserService();
      const user = service.create({ name: 'Test User', email: 'test@example.com', password: 'pass123' });

      const deleted = service.delete(user.id);

      expect(deleted).toEqual(user);
      expect(service.list()).toHaveLength(0);
    });

    it('lanza error si el usuario no existe', () => {
      const service = new UserService();

      expect(() => service.delete('non-existent-id')).toThrow('Usuario no encontrado');
    });
  });

  describe('authenticate', () => {
    it('autentica un usuario con credenciales correctas', () => {
      const service = new UserService();
      service.create({ name: 'Test User', email: 'test@example.com', password: 'pass123' });

      const user = service.authenticate('test@example.com', 'pass123');

      expect(user).toEqual(
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com'
        })
      );
      expect(user.password).toBeUndefined();
    });

    it('lanza error si el email no existe', () => {
      const service = new UserService();

      expect(() => service.authenticate('nonexistent@example.com', 'pass123')).toThrow(
        'Credenciales inválidas'
      );
    });

    it('lanza error si la contraseña es incorrecta', () => {
      const service = new UserService();
      service.create({ name: 'Test User', email: 'test@example.com', password: 'pass123' });

      expect(() => service.authenticate('test@example.com', 'wrongpass')).toThrow(
        'Credenciales inválidas'
      );
    });
  });
});
