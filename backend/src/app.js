const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Share userService with other routes
const { userService } = require('./routes/userRoutes');
app.set('userService', userService);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const path = require('path');

// 👉 Ruta raíz donde está el frontend compilado en Azure
const rootPath = path.resolve(__dirname, '../..');

// 👉 Servir archivos estáticos (JS/CSS/imagenes del build del front)
app.use(express.static(rootPath));

// 👉 Ruta principal -> devolver index.html del front
app.get('/', (req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

// 👉 Manejar rutas del frontend (SPA o navegación directa)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

// 👉 Si ninguna ruta coincide y no entra en /api → devolver 404 API
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});
