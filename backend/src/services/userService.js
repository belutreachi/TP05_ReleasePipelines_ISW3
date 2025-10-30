const { randomUUID } = require('node:crypto');

class UserService {
  constructor(initialUsers = []) {
    this.users = initialUsers;
  }

  list() {
    return this.users;
  }

  findById(userId) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  findByEmail(email) {
    return this.users.find((u) => u.email === email);
  }

  create({ name, email }) {
    if (!name || !email) {
      throw new Error('El nombre y email son obligatorios');
    }

    // Validar formato de email básico (ReDoS-safe)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('El formato del email no es válido');
    }

    // Verificar si el email ya existe
    if (this.findByEmail(email)) {
      throw new Error('El email ya está registrado');
    }

    const newUser = {
      id: randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    return newUser;
  }

  update(userId, { name, email }) {
    const user = this.findById(userId);

    if (email && email !== user.email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new Error('El formato del email no es válido');
      }

      const existingUser = this.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('El email ya está registrado');
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;

    return user;
  }

  delete(userId) {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    const deletedUser = this.users[index];
    this.users.splice(index, 1);
    return deletedUser;
  }
}

module.exports = UserService;
