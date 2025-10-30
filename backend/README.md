# Backend

API en Express para gestionar tareas y usuarios. Incluye ejemplos de pruebas unitarias e integrales con Jest y Supertest.

## Scripts principales

- `npm run dev`: inicia el servidor con nodemon.
- `npm test`: ejecuta las pruebas.
- `npm run test:coverage`: genera el reporte de cobertura.
- `npm run lint`: ejecuta ESLint.
- `npm start`: inicia el servidor en modo producción.

## Variables de entorno

Cree un archivo `.env` (opcional) con las siguientes variables:

```env
PORT=4000
NODE_ENV=development
```

## Endpoints

### Health Check
- `GET /api/health` - Verifica el estado de la API.

### Usuarios
- `GET /api/users` - Lista todos los usuarios.
- `GET /api/users/:id` - Obtiene un usuario específico.
- `POST /api/users` - Crea un usuario (`name` y `email` requeridos).
- `PUT /api/users/:id` - Actualiza un usuario.
- `DELETE /api/users/:id` - Elimina un usuario.

### Tareas
- `GET /api/tasks` - Lista las tareas (opcional: `?userId=xxx` para filtrar).
- `GET /api/tasks/:id` - Obtiene una tarea específica.
- `POST /api/tasks` - Crea una tarea (`title` requerido, `description` y `userId` opcionales).
- `POST /api/tasks/:id/toggle` - Alterna el estado de una tarea.
- `DELETE /api/tasks/:id` - Elimina una tarea.

## Estructura

```
backend/
├── src/
│   ├── config/         # Configuración
│   ├── routes/         # Rutas de la API
│   ├── services/       # Lógica de negocio
│   ├── app.js          # Aplicación Express
│   └── server.js       # Servidor HTTP
└── tests/
    ├── unit/           # Pruebas unitarias
    └── integration/    # Pruebas de integración
```
