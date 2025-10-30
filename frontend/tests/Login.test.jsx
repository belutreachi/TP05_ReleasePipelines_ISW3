import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from '../src/components/Login.jsx';

global.fetch = vi.fn();

describe('Login', () => {
  it('renderiza el formulario de login', () => {
    render(<Login onLogin={vi.fn()} onSwitchToRegister={vi.fn()} />);

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('permite cambiar entre login y registro', () => {
    const handleSwitch = vi.fn();
    render(<Login onLogin={vi.fn()} onSwitchToRegister={handleSwitch} />);

    fireEvent.click(screen.getByText('Regístrate aquí'));
    expect(handleSwitch).toHaveBeenCalled();
  });

  it('maneja el envío del formulario exitosamente', async () => {
    const handleLogin = vi.fn();
    const mockResponse = {
      data: {
        sessionId: 'test-session',
        user: { id: '1', name: 'Test User', email: 'test@test.com' }
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<Login onLogin={handleLogin} onSwitchToRegister={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'password123' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('test-session', mockResponse.data.user);
    });
  });

  it('muestra error cuando las credenciales son inválidas', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Credenciales inválidas' })
    });

    render(<Login onLogin={vi.fn()} onSwitchToRegister={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@test.com' }
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'wrongpass' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});
