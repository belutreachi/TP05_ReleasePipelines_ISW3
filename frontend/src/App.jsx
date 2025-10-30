import { useEffect, useState } from 'react';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

const API_URL = '/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check if there's a stored session
    async function fetchTasksInternal(sid) {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'x-session-id': sid
          }
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de tareas');
        }
        const body = await response.json();
        setTasks(body.data);
      } catch (err) {
        setError(err.message);
      }
    }

    async function validateSession(sid) {
      try {
        const response = await fetch('/api/auth/session', {
          headers: {
            'x-session-id': sid
          }
        });

        if (response.ok) {
          const body = await response.json();
          setSessionId(sid);
          setUser(body.data.user);
          // Fetch tasks immediately after session validation
          await fetchTasksInternal(sid);
        } else {
          localStorage.removeItem('sessionId');
        }
      } catch (err) {
        localStorage.removeItem('sessionId');
      } finally {
        setLoading(false);
      }
    }

    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      validateSession(storedSessionId);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchTasks(sid = sessionId) {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'x-session-id': sid
        }
      });
      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de tareas');
      }
      const body = await response.json();
      setTasks(body.data);
    } catch (err) {
      setError(err.message);
    }
  }

  const handleLogin = (sid, userData) => {
    localStorage.setItem('sessionId', sid);
    setSessionId(sid);
    setUser(userData);
    fetchTasks(sid);
  };

  const handleRegister = (sid, userData) => {
    localStorage.setItem('sessionId', sid);
    setSessionId(sid);
    setUser(userData);
    fetchTasks(sid);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'x-session-id': sessionId
        }
      });
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('sessionId');
      setSessionId(null);
      setUser(null);
      setTasks([]);
    }
  };

  const handleCreateTask = async (payload) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
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
      const response = await fetch(`${API_URL}/${taskId}/toggle`, { 
        method: 'POST',
        headers: {
          'x-session-id': sessionId
        }
      });
      if (!response.ok) {
        throw new Error('No se pudo actualizar la tarea');
      }

      const body = await response.json();
      setTasks((prev) => prev.map((task) => (task.id === taskId ? body.data : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, { 
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId
        }
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'No se pudo eliminar la tarea');
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!sessionId) {
    return showRegister ? (
      <Register 
        onRegister={handleRegister} 
        onSwitchToLogin={() => setShowRegister(false)} 
      />
    ) : (
      <Login 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setShowRegister(true)} 
      />
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>TicTask</h1>
        <div className="user-info">
          <span>Bienvenido, {user?.name}</span>
          {user?.isAdmin && <span className="admin-badge">Admin</span>}
          <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </button>
        </div>
        <p>Ejemplo para prácticas de CI/CD, pruebas y despliegue en la nube.</p>
      </header>

      <main>
        <TaskForm onCreate={handleCreateTask} />
        {error && <p role="alert">{error}</p>}
        <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} isAdmin={user?.isAdmin} />
      </main>
    </div>
  );
}
