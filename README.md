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

### Autenticación y Autorización

La aplicación ahora requiere autenticación para acceder al gestor de tareas:

**Usuarios de prueba (solo desarrollo):**
- Usuario regular: `demo@example.com` / `demo123`
- Administrador: `admin@example.com` / `admin123`

**⚠️ IMPORTANTE:** Estas credenciales son solo para desarrollo. En producción, cambia estas credenciales o elimina estos usuarios.

**Características:**
- Los usuarios deben iniciar sesión o registrarse antes de acceder a las tareas
- Los usuarios regulares solo pueden ver y gestionar sus propias tareas
- Los administradores pueden ver todas las tareas de todos los usuarios
- Función de cerrar sesión disponible

### API Backend

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión (requiere `email` y `password`)
- `POST /api/auth/register` - Registrar nuevo usuario (requiere `name`, `email` y `password`)
- `POST /api/auth/logout` - Cerrar sesión (requiere header `x-session-id`)
- `GET /api/auth/session` - Validar sesión actual (requiere header `x-session-id`)

#### Usuarios
- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener un usuario específico
- `POST /api/users` - Crear un nuevo usuario (requiere `name`, `email` y `password`)
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

#### Tareas (requieren autenticación)
- `GET /api/tasks` - Listar tareas del usuario autenticado (admin ve todas)
- `GET /api/tasks/:id` - Obtener una tarea específica
- `POST /api/tasks` - Crear una tarea (`title` requerido, `description` opcional)
- `POST /api/tasks/:id/toggle` - Alternar estado de completado
- `DELETE /api/tasks/:id` - Eliminar una tarea

**Nota:** Todas las rutas de tareas requieren el header `x-session-id` con un ID de sesión válido.

**⚠️ Consideraciones de Seguridad:**
- Las contraseñas se almacenan en texto plano (solo para demostración)
- En producción, usa bcrypt o argon2 para hashear contraseñas
- Las sesiones se almacenan en memoria (se reinician al reiniciar el servidor)
- Para producción, considera usar JWT tokens o sesiones persistentes
- **SIEMPRE usa HTTPS en producción** para proteger las credenciales en tránsito
- Implementa protección CSRF para endpoints de modificación de datos
- **Implementa rate limiting** en rutas de autenticación para prevenir ataques de fuerza bruta (ej: express-rate-limit)

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
