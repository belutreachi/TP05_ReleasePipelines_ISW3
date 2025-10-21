# Base de datos

Recursos para inicializar una base de datos PostgreSQL sencilla que acompañe al backend.

## Uso rápido

1. Copie `.env.example` en `.env` y ajuste las credenciales si es necesario.
2. Levante la base de datos con Docker Compose:

```bash
docker compose up -d
```

3. Ejecute las migraciones básicas:

```bash
docker compose exec db psql -U ci_user -d ci_tasks -f /docker-entrypoint-initdb.d/schema.sql
```

## Archivos incluidos

- `schema.sql`: crea una tabla `tasks` equivalente al servicio en memoria.
- `seed.sql`: inserta datos de ejemplo.
- `docker-compose.yml`: definición de un contenedor PostgreSQL listo para usar en entornos locales o pipelines.
- `.env.example`: valores iniciales de las variables usadas por Docker Compose.
