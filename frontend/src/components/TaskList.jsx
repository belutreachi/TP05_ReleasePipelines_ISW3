export default function TaskList({ tasks, onToggle, isAdmin }) {
  if (!tasks.length) {
    return <p>No hay tareas. ¡Crea la primera!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? 'completed' : ''}>
          <div>
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            {isAdmin && task.userId && (
              <small className="task-owner">Usuario: {task.userId}</small>
            )}
            {task.completed && task.completedAt && (
              <small>Completada el {new Date(task.completedAt).toLocaleString()}</small>
            )}
          </div>
          <button type="button" onClick={() => onToggle(task.id)}>
            {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          </button>
        </li>
      ))}
    </ul>
  );
}
