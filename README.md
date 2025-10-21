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

## Próximos pasos sugeridos

- Configurar pipelines de CI/CD en Azure DevOps que ejecuten las pruebas unitarias e integrales de ambos proyectos.
- Incorporar análisis estático (ESLint) y reportes de cobertura (Jest y Vitest).
- Construir imágenes de contenedor para frontend y backend, y publicarlas en un registro de contenedores.
- Desplegar la solución en un entorno de nube utilizando los manifiestos y recursos provistos.

## Requisitos previos

- Node.js 18+
- npm 9+
- Docker (para la base de datos y los futuros contenedores)

## Cómo empezar

1. Instale dependencias en `frontend/` y `backend/` con `npm install`.
2. Inicie la base de datos con Docker Compose dentro de `database/`.
3. Ejecute `npm run dev` en `backend/` y `frontend/` en terminales separadas.
4. Abra `http://localhost:5173` para interactuar con la aplicación.
