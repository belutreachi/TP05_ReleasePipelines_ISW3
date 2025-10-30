# TP05 Release Pipelines IS3

Repositorio base para practicar el armado de una solución completa con frontend, backend y recursos de base de datos.

## Estructura del proyecto

```
TP05_ReleasePipelines_IS3/
├── frontend/   # Aplicación React + Vite con Vitest y ESLint
├── backend/    # API Express con Jest, Supertest y ESLint
└── database/   # Recursos de PostgreSQL (schema, seeds y docker-compose)
```

Cada subcarpeta cuenta con su propio `README.md` describiendo los scripts disponibles y consideraciones específicas.

## 🚀 Inicio Rápido

### Opción 1: Usando Docker Compose (Recomendado)

La forma más rápida de ejecutar toda la aplicación:

```bash
./start.sh
```

O manualmente:

```bash
# Copiar archivo de configuración (si no existe)
cp .env.example .env

# Levantar todos los servicios
docker compose up --build
```

Esto iniciará:
- **Base de datos PostgreSQL** en `localhost:5432`
- **Backend API** en `http://localhost:4000`
- **Frontend** en `http://localhost:5173`

Para detener todos los servicios:

```bash
docker compose down
```

### Opción 2: Desarrollo Local

Si prefieres ejecutar cada componente por separado:

1. **Instalar dependencias** en `frontend/` y `backend/`:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Iniciar la base de datos** (desde el directorio raíz):
   ```bash
   cd database
   cp .env.example .env
   docker compose up -d
   ```

3. **Ejecutar el backend** en una terminal:
   ```bash
   cd backend
   npm run dev
   ```

4. **Ejecutar el frontend** en otra terminal:
   ```bash
   cd frontend
   npm run dev
   ```

5. **Abrir** `http://localhost:5173` para interactuar con la aplicación.

## Funcionalidades

### API Backend

#### Usuarios
- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener un usuario específico
- `POST /api/users` - Crear un nuevo usuario (requiere `name` y `email`)
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

#### Tareas
- `GET /api/tasks` - Listar tareas (opcionalmente filtrar con `?userId=xxx`)
- `GET /api/tasks/:id` - Obtener una tarea específica
- `POST /api/tasks` - Crear una tarea (`title` requerido, `description` y `userId` opcionales)
- `POST /api/tasks/:id/toggle` - Alternar estado de completado
- `DELETE /api/tasks/:id` - Eliminar una tarea

#### Health Check
- `GET /api/health` - Verificar el estado de la API

## Próximos pasos sugeridos

- Configurar pipelines de CI/CD en Azure DevOps que ejecuten las pruebas unitarias e integrales de ambos proyectos.
- Incorporar análisis estático (ESLint) y reportes de cobertura (Jest y Vitest).
- Construir imágenes de contenedor para frontend y backend, y publicarlas en un registro de contenedores.
- Desplegar la solución en un entorno de nube utilizando los manifiestos y recursos provistos.

## Requisitos previos

- Node.js 18+
- npm 9+
- Docker (para la base de datos y los contenedores)
- Docker Compose v2.0+ (viene incluido con Docker Desktop)

## Pruebas

### Backend
```bash
cd backend
npm test                 # Ejecutar todas las pruebas
npm run test:watch       # Modo watch
npm run test:coverage    # Reporte de cobertura
npm run lint            # Análisis estático
```

### Frontend
```bash
cd frontend
npm test                # Ejecutar pruebas
npm run test:watch      # Modo watch
npm run lint           # Análisis estático
```

## Variables de Entorno

Consulte `.env.example` en la raíz del proyecto para las variables de configuración disponibles:

- `POSTGRES_DB` - Nombre de la base de datos
- `POSTGRES_USER` - Usuario de PostgreSQL
- `POSTGRES_PASSWORD` - Contraseña de PostgreSQL
- `BACKEND_PORT` - Puerto del backend (default: 4000)
- `FRONTEND_PORT` - Puerto del frontend (default: 5173)
- `NODE_ENV` - Entorno de ejecución (development/production)
