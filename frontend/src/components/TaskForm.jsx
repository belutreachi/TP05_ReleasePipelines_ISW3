import { useState } from 'react';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    const taskData = { 
      title: title.trim(), 
      description: description.trim()
    };
    
    // Only include dueDate if it's set
    if (dueDate) {
      taskData.dueDate = new Date(dueDate).toISOString();
    }

    onCreate(taskData);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Título</label>
      <input
        id="title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Nueva tarea"
        required
      />

      <label htmlFor="description">Descripción</label>
      <textarea
        id="description"
        name="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Detalles opcionales"
      />

      <label htmlFor="dueDate">Fecha límite (opcional)</label>
      <input
        id="dueDate"
        name="dueDate"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <button type="submit">Agregar tarea</button>
    </form>
  );
}
