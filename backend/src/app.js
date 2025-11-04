const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

/** 1) Ruta mínima de diagnóstico (responde siempre) */
app.get('/api/ping', (_req, res) => {
  res.status(200).json({ ok: true, at: new Date().toISOString() });
});

/** 2) recién ahora importo y monto rutas que podrían depender de DB/servicios */
const taskRoutes = require('./routes/taskRoutes');
const userRoutes  = require('./routes/userRoutes');
const authRoutes  = require('./routes/authRoutes');

// Share userService with other routes
const { userService } = require('./routes/userRoutes');
app.set('userService', userService);

// Health (puede quedarse)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas API
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ---- Servir el frontend (build) desde la raíz del deploy ----
const rootPath = path.resolve(__dirname, '../..');
app.use(express.static(rootPath));

app.get('/', (_req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

// Fallback para rutas del front (SPA)
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

// 404 final (si no coincidió nada anterior)
app.use((_req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

module.exports = app;
