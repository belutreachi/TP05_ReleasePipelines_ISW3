import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../src/App.jsx';

global.fetch = vi.fn();

describe('App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('muestra el formulario de login cuando no hay sesión', async () => {
    render(<App />);

    expect(await screen.findByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('muestra la aplicación cuando hay una sesión válida', async () => {
    localStorage.setItem('sessionId', 'test-session');

    // Mock session validation
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          user: { id: '1', name: 'Test User', email: 'test@test.com', isAdmin: false }
        }
      })
    });

    // Mock tasks fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 'test-id',
            title: 'Tarea de prueba',
            description: 'Descripción de prueba',
            completed: false
          }
        ]
      })
    });

    render(<App />);

    // Wait for the application to load
    await waitFor(() => {
      expect(screen.getByText('TicTask')).toBeInTheDocument();
    });

    expect(screen.getByText('Bienvenido, Test User')).toBeInTheDocument();
    expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
  });

  it('muestra badge de admin para usuarios administradores', async () => {
    localStorage.setItem('sessionId', 'admin-session');

    // Mock session validation with admin user
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          user: { id: '2', name: 'Admin User', email: 'admin@test.com', isAdmin: true }
        }
      })
    });

    // Mock tasks fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: []
      })
    });

    render(<App />);

    // Wait for admin badge to appear
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    expect(screen.getByText('Bienvenido, Admin User')).toBeInTheDocument();
  });
});
