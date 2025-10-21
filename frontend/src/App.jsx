import { useEffect, useState } from 'react';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';

const API_URL = '/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de tareas');
        }
        const body = await response.json();
        setTasks(body.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const handleCreateTask = async (payload) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Error al crear la tarea');
      }

      const body = await response.json();
      setTasks((prev) => [...prev, body.data]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}/toggle`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('No se pudo actualizar la tarea');
      }

      const body = await response.json();
      setTasks((prev) => prev.map((task) => (task.id === taskId ? body.data : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Gestor de tareas</h1>
        <p>Ejemplo para prácticas de CI/CD, pruebas y despliegue en la nube.</p>
      </header>

      <main>
        <TaskForm onCreate={handleCreateTask} />
        {error && <p role="alert">{error}</p>}
        {loading ? <p>Cargando...</p> : <TaskList tasks={tasks} onToggle={handleToggle} />}
      </main>
    </div>
  );
}
