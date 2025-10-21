INSERT INTO tasks (title, description, completed)
VALUES
    ('Configurar CI/CD', 'Preparar pipeline en Azure DevOps', false),
    ('Escribir pruebas unitarias', 'Cubrir servicios críticos', false),
    ('Publicar contenedor', 'Subir imagen a registry', false)
ON CONFLICT DO NOTHING;
