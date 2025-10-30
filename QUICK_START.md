# Guía de Inicio Rápido - TP05 Release Pipelines IS3

## 🚀 Inicio más rápido (Recomendado)

Ejecuta toda la aplicación con un solo comando:

```bash
./start.sh
```

Esto iniciará automáticamente:
- Base de datos PostgreSQL (puerto 5432)
- Backend API (puerto 4000)
- Frontend web (puerto 5173)

**Accede a la aplicación:** http://localhost:5173

## 📋 Comandos útiles

### Detener todos los servicios
```bash
docker compose down
```

### Ver logs de todos los servicios
```bash
docker compose logs -f
```

### Ver logs de un servicio específico
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Reiniciar un servicio
```bash
docker compose restart backend
```

### Reconstruir imágenes (después de cambios en código)
```bash
docker compose up --build
```

### Acceder a la base de datos
```bash
docker compose exec db psql -U ci_user -d ci_tasks
```

## 🧪 Ejecutar Pruebas

### Backend
```bash
cd backend
npm test                 # Todas las pruebas
npm run test:watch       # Modo watch
npm run test:coverage    # Con cobertura
npm run lint            # Linter
```

### Frontend
```bash
cd frontend
npm test                # Todas las pruebas
npm run test:watch      # Modo watch
npm run lint           # Linter
```

## 🔧 Desarrollo Local (sin Docker)

Si prefieres ejecutar los servicios sin Docker:

1. **Base de datos** (requiere Docker solo para la BD):
   ```bash
   cd database
   cp .env.example .env
   docker compose up -d
   ```

2. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📡 Endpoints de la API

### Health Check
- `GET /api/health` - Estado de la API

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario (requiere: name, email)
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Tareas
- `GET /api/tasks` - Listar tareas
- `GET /api/tasks?userId=xxx` - Tareas de un usuario
- `GET /api/tasks/:id` - Obtener tarea
- `POST /api/tasks` - Crear tarea (requiere: title; opcional: description, userId)
- `POST /api/tasks/:id/toggle` - Alternar completado
- `DELETE /api/tasks/:id` - Eliminar tarea

## 🗄️ Datos de Ejemplo

La base de datos viene con usuarios y tareas de ejemplo:

**Usuarios:**
- Juan Pérez (juan.perez@example.com)
- María García (maria.garcia@example.com)
- Carlos López (carlos.lopez@example.com)

**Tareas:** Cada usuario tiene tareas asignadas relacionadas con CI/CD.

## 🐛 Solución de Problemas

### Los contenedores no inician
```bash
docker compose down -v
docker compose up --build
```

### Puerto ya en uso
Edita `.env` y cambia los puertos:
```env
BACKEND_PORT=4001
FRONTEND_PORT=5174
```

### Problemas con la base de datos
```bash
# Eliminar volumen y recrear
docker compose down -v
docker compose up -d db
```

### Ver logs de errores
```bash
docker compose logs backend
docker compose logs frontend
```

## 📦 Variables de Entorno

Archivo `.env` (se crea automáticamente desde `.env.example`):

```env
# Database
POSTGRES_DB=ci_tasks
POSTGRES_USER=ci_user
POSTGRES_PASSWORD=ci_password

# Backend
BACKEND_PORT=4000
NODE_ENV=development

# Frontend
FRONTEND_PORT=5173
```

## 🎯 Próximos Pasos

1. Explorar la API con herramientas como Postman o curl
2. Modificar el código y ver los cambios en tiempo real
3. Agregar nuevas funcionalidades (ej: autenticación, más campos)
4. Configurar pipelines de CI/CD
5. Desplegar en la nube
