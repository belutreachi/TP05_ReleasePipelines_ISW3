# Ejemplos de Uso de la API

Esta guía muestra ejemplos prácticos de cómo usar la API de usuarios y tareas.

## 🔧 Requisitos

Asegúrate de que la aplicación esté ejecutándose:
```bash
./start.sh
```

## 📡 Ejemplos con cURL

### Health Check

```bash
curl http://localhost:4000/api/health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2024-10-30T15:00:00.000Z"
}
```

## 👥 Usuarios

### Listar todos los usuarios

```bash
curl http://localhost:4000/api/users
```

### Obtener un usuario específico

```bash
curl http://localhost:4000/api/users/550e8400-e29b-41d4-a716-446655440001
```

### Crear un nuevo usuario

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Martínez",
    "email": "ana.martinez@example.com"
  }'
```

Respuesta:
```json
{
  "data": {
    "id": "uuid-generado",
    "name": "Ana Martínez",
    "email": "ana.martinez@example.com",
    "createdAt": "2024-10-30T15:00:00.000Z"
  }
}
```

### Actualizar un usuario

```bash
curl -X PUT http://localhost:4000/api/users/uuid-del-usuario \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Martínez López"
  }'
```

### Eliminar un usuario

```bash
curl -X DELETE http://localhost:4000/api/users/uuid-del-usuario
```

## 📝 Tareas

### Listar todas las tareas

```bash
curl http://localhost:4000/api/tasks
```

### Listar tareas de un usuario específico

```bash
curl "http://localhost:4000/api/tasks?userId=550e8400-e29b-41d4-a716-446655440001"
```

### Obtener una tarea específica

```bash
curl http://localhost:4000/api/tasks/uuid-de-la-tarea
```

### Crear una tarea sin usuario

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudiar Docker",
    "description": "Aprender sobre contenedores y orquestación"
  }'
```

### Crear una tarea asignada a un usuario

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Revisar PR",
    "description": "Revisar el pull request #123",
    "userId": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

### Marcar tarea como completada (toggle)

```bash
curl -X POST http://localhost:4000/api/tasks/uuid-de-la-tarea/toggle
```

### Eliminar una tarea

```bash
curl -X DELETE http://localhost:4000/api/tasks/uuid-de-la-tarea
```

## 📊 Ejemplos con JavaScript (fetch)

### Crear usuario y asignarle una tarea

```javascript
// Crear usuario
const userResponse = await fetch('http://localhost:4000/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Pedro González',
    email: 'pedro.gonzalez@example.com'
  })
});

const { data: user } = await userResponse.json();
console.log('Usuario creado:', user);

// Crear tarea asignada al usuario
const taskResponse = await fetch('http://localhost:4000/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Completar documentación',
    description: 'Documentar los nuevos endpoints',
    userId: user.id
  })
});

const { data: task } = await taskResponse.json();
console.log('Tarea creada:', task);
```

### Obtener todas las tareas de un usuario

```javascript
const userId = '550e8400-e29b-41d4-a716-446655440001';
const response = await fetch(`http://localhost:4000/api/tasks?userId=${userId}`);
const { data: tasks } = await response.json();

console.log('Tareas del usuario:', tasks);
```

### Actualizar y completar una tarea

```javascript
const taskId = 'uuid-de-la-tarea';

// Marcar como completada
await fetch(`http://localhost:4000/api/tasks/${taskId}/toggle`, {
  method: 'POST'
});

console.log('Tarea marcada como completada');
```

## 🧪 Casos de Prueba

### Validaciones

```bash
# Error: Email inválido
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "invalid-email"}'

# Error: Email duplicado
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "juan.perez@example.com"}'

# Error: Título de tarea faltante
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Sin título"}'
```

## 🔗 Flujo Completo de Ejemplo

```bash
# 1. Verificar que la API está funcionando
curl http://localhost:4000/api/health

# 2. Crear un nuevo usuario
USER_RESPONSE=$(curl -s -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Laura Sánchez", "email": "laura.sanchez@example.com"}')

USER_ID=$(echo $USER_RESPONSE | jq -r '.data.id')
echo "Usuario creado con ID: $USER_ID"

# 3. Crear tareas para el usuario
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Implementar feature\", \"userId\": \"$USER_ID\"}"

curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Escribir tests\", \"userId\": \"$USER_ID\"}"

# 4. Ver todas las tareas del usuario
curl "http://localhost:4000/api/tasks?userId=$USER_ID"

# 5. Obtener información del usuario
curl "http://localhost:4000/api/users/$USER_ID"
```

## 🌐 Usando Postman

1. Importa la colección desde el archivo `postman_collection.json` (si está disponible)
2. O crea manualmente las peticiones usando los ejemplos de cURL anteriores
3. Establece la variable de entorno `baseUrl` como `http://localhost:4000`

## 💡 Tips

- Usa `jq` para formatear JSON en la terminal: `curl ... | jq`
- Guarda IDs en variables de shell para facilitar pruebas encadenadas
- Revisa los logs con `docker compose logs -f backend` para debugging
- Usa Postman o Thunder Client (VS Code) para pruebas interactivas
