-- Insertar usuarios de ejemplo
INSERT INTO users (id, name, email)
VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Juan Pérez', 'juan.perez@example.com'),
    ('550e8400-e29b-41d4-a716-446655440002', 'María García', 'maria.garcia@example.com'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Carlos López', 'carlos.lopez@example.com')
ON CONFLICT DO NOTHING;

-- Insertar tareas de ejemplo asociadas a usuarios
INSERT INTO tasks (title, description, completed, user_id)
VALUES
    ('Configurar CI/CD', 'Preparar pipeline en Azure DevOps', false, '550e8400-e29b-41d4-a716-446655440001'),
    ('Escribir pruebas unitarias', 'Cubrir servicios críticos', false, '550e8400-e29b-41d4-a716-446655440001'),
    ('Publicar contenedor', 'Subir imagen a registry', false, '550e8400-e29b-41d4-a716-446655440002'),
    ('Revisar documentación', 'Actualizar README con nuevas funcionalidades', false, '550e8400-e29b-41d4-a716-446655440002'),
    ('Configurar monitoreo', 'Implementar logs y métricas', false, '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT DO NOTHING;
