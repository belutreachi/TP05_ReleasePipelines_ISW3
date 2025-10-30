const express = require('express');
const UserService = require('../services/userService');

const router = express.Router();
const userService = new UserService([
  {
    id: 'seed-user',
    name: 'Usuario Demo',
    email: 'demo@example.com',
    password: 'demo123',
    isAdmin: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-user',
    name: 'Administrador',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    createdAt: new Date().toISOString()
  }
]);

// GET /api/users - Listar todos los usuarios
router.get('/', (req, res) => {
  res.json({ data: userService.list() });
});

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', (req, res) => {
  try {
    const user = userService.findById(req.params.id);
    res.json({ data: user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST /api/users - Crear un nuevo usuario
router.post('/', (req, res) => {
  try {
    const user = userService.create(req.body || {});
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', (req, res) => {
  try {
    const user = userService.update(req.params.id, req.body || {});
    res.json({ data: user });
  } catch (error) {
    const status = error.message === 'Usuario no encontrado' ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', (req, res) => {
  try {
    const user = userService.delete(req.params.id);
    res.json({ data: user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
module.exports.userService = userService;
