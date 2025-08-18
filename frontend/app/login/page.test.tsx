import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from './page';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Login route', () => {
  it('renders LoginForm when not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, isLoading: false });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push, replace: push });

    render(<LoginPage />);

    expect(screen.getByRole('button', { name: /entrar|login/i })).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('redirects to /dashboard when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1, email: 'test@example.com' }, isLoading: false });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push, replace: push });

    render(<LoginPage />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });
});


