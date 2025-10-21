# Backend

API en Express para gestionar tareas. Incluye ejemplos de pruebas unitarias e integrales con Jest y Supertest.

## Scripts principales

- `npm run dev`: inicia el servidor con nodemon.
- `npm test`: ejecuta las pruebas.
- `npm run test:coverage`: genera el reporte de cobertura.
- `npm run lint`: ejecuta ESLint.

## Variables de entorno

Cree un archivo `.env` (opcional) con las siguientes variables:

```env
PORT=4000
NODE_ENV=development
```

## Endpoints

- `GET /api/health` - Verifica el estado de la API.
- `GET /api/tasks` - Lista las tareas.
- `POST /api/tasks` - Crea una tarea (`title` requerido, `description` opcional).
- `POST /api/tasks/:id/toggle` - Alterna el estado de una tarea.
