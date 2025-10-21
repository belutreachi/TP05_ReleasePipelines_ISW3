import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        data: [
          {
            id: 'test-id',
            title: 'Tarea de prueba',
            description: 'Descripción de prueba',
            completed: false
          }
        ]
      })
  })
));

describe('App', () => {
  it('muestra el título de la aplicación', async () => {
    render(<App />);

    expect(await screen.findByText('Gestor de tareas')).toBeInTheDocument();
    expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
  });
});
