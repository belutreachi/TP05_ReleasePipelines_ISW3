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

  authenticate(email, password) {
    const user = this.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // In production, use bcrypt.compare()
    if (user.password !== password) {
      throw new Error('Credenciales inválidas');
    }

    // Return user without password
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  create({ name, email, password, isAdmin = false }) {
    if (!name || !email) {
      throw new Error('El nombre y email son obligatorios');
    }

    if (!password) {
      throw new Error('La contraseña es obligatoria');
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
      password, // In production, this should be hashed
      isAdmin,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    return newUser;
  }

  update(userId, { name, email, password, isAdmin }) {
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
    if (password) user.password = password; // In production, this should be hashed
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

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
