export default function TaskList({ tasks, onToggle, onDelete, isAdmin }) {
  if (!tasks.length) {
    return <p>No hay tareas. ¡Crea la primera!</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? 'completed' : ''}>
          <div>
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            {task.dueDate && (
              <small className="task-due-date">
                Fecha límite: {formatDate(task.dueDate)}
              </small>
            )}
            {isAdmin && task.creatorName && (
              <small className="task-owner">Creado por: {task.creatorName}</small>
            )}
            {task.completed && task.completedAt && (
              <small>Completada el {new Date(task.completedAt).toLocaleString()}</small>
            )}
          </div>
          <div className="task-actions">
            <button type="button" onClick={() => onToggle(task.id)}>
              {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            </button>
            <button type="button" onClick={() => onDelete(task.id)} className="delete-button">
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
