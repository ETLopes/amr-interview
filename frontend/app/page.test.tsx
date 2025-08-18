import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HomePage from './page';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Root route /', () => {
  it('redirects to /login when unauthenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, isLoading: false });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push, replace: push });

    render(<HomePage />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects to /dashboard when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1 }, isLoading: false });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push, replace: push });

    render(<HomePage />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });
});


