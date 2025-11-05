const path = require('node:path');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const { userService } = require('./routes/userRoutes');
app.set('userService', userService);

// ========= API =========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// 404 SOLO para API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// ========= FRONTEND =========
const publicDir = path.join(__dirname, '..'); 

app.use(express.static(publicDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicDir, 'index.html'));
});

module.exports = app;
