const express = require('express');
const { randomUUID } = require('node:crypto');

const router = express.Router();

// Simple in-memory session storage
const sessions = new Map();

// POST /api/auth/login - Authenticate user
// TODO: Add rate limiting in production to prevent brute force attacks
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    // Get userService from the app context (set during app initialization)
    const userService = req.app.get('userService');
    const user = userService.authenticate(email, password);

    // Create session
    const sessionId = randomUUID();
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: new Date().toISOString()
    });

    res.json({
      data: {
        sessionId,
        user
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// POST /api/auth/register - Register new user
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    const userService = req.app.get('userService');
    const user = userService.create({ name, email, password, isAdmin: false });

    // Create session for the new user
    const sessionId = randomUUID();
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin || false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      data: {
        sessionId,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
  }

  res.json({ data: { message: 'Sesión cerrada exitosamente' } });
});

// GET /api/auth/session - Validate session
router.get('/session', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Sesión no válida' });
  }

  const session = sessions.get(sessionId);
  const userService = req.app.get('userService');
  
  try {
    const user = userService.findById(session.userId);
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ data: { user: userWithoutPassword } });
  } catch (error) {
    sessions.delete(sessionId);
    res.status(401).json({ error: 'Sesión no válida' });
  }
});

module.exports = router;
module.exports.sessions = sessions;
