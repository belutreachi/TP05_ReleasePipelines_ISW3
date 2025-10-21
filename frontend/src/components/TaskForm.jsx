import { useState } from 'react';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    onCreate({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
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

      <button type="submit">Agregar tarea</button>
    </form>
  );
}
