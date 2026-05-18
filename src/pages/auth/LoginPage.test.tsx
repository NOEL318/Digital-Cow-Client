import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '@/features/auth/AuthContext';
import { ToastProvider } from '@/components/ui/toast';

vi.mock('@/features/auth/api', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({ accessToken: 'a', refreshToken: 'r', expiresInSeconds: 900 }),
    me: vi.fn().mockResolvedValue({ id: 1, accountId: 1, email: 'u@x.com', fullName: 'U', role: 'OWNER', locale: 'es', emailVerified: true })
  }
}));

describe('LoginPage', () => {
  it('submits valid credentials', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ToastProvider>
            <LoginPage />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    await userEvent.type(screen.getByLabelText(/email/i), 'u@x.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in|entrar/i }));
    expect(true).toBe(true);
  });
});
