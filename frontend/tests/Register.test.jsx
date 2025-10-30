import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Register from '../src/components/Register.jsx';

global.fetch = vi.fn();

describe('Register', () => {
  it('renderiza el formulario de registro', () => {
    render(<Register onRegister={vi.fn()} onSwitchToLogin={vi.fn()} />);

    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('permite cambiar entre registro y login', () => {
    const handleSwitch = vi.fn();
    render(<Register onRegister={vi.fn()} onSwitchToLogin={handleSwitch} />);

    fireEvent.click(screen.getByText('Inicia sesión aquí'));
    expect(handleSwitch).toHaveBeenCalled();
  });

  it('maneja el registro exitosamente', async () => {
    const handleRegister = vi.fn();
    const mockResponse = {
      data: {
        sessionId: 'new-session',
        user: { id: '1', name: 'New User', email: 'new@test.com' }
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<Register onRegister={handleRegister} onSwitchToLogin={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: 'New User' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@test.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalledWith('new-session', mockResponse.data.user);
    });
  });

  it('muestra error cuando el email ya está registrado', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'El email ya está registrado' })
    });

    render(<Register onRegister={vi.fn()} onSwitchToLogin={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'existing@test.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText('El email ya está registrado')).toBeInTheDocument();
  });
});
