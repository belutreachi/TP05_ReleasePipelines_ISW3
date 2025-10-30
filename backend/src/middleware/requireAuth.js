const { sessions } = require('../routes/authRoutes');

function requireAuth(req, res, next) {
  const sessionId = req.headers['x-session-id'];

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'No autorizado. Por favor inicia sesión.' });
  }

  const session = sessions.get(sessionId);
  req.session = session;
  next();
}

module.exports = requireAuth;
