import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import TaskForm from '../src/components/TaskForm.jsx';

describe('TaskForm', () => {
  it('invoca onCreate con los datos del formulario', () => {
    const handleCreate = vi.fn();
    render(<TaskForm onCreate={handleCreate} />);

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Nueva tarea' } });
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Descripción corta' }
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Agregar tarea' }));

    expect(handleCreate).toHaveBeenCalledWith({
      title: 'Nueva tarea',
      description: 'Descripción corta'
    });
  });
});
