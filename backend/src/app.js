const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

module.exports = app;
