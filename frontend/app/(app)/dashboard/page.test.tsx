import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from './page';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/Dashboard', () => ({
  Dashboard: ({ onCreateNew, onViewAll }: any) => (
    <div>
      <button onClick={onCreateNew}>Create</button>
      <button onClick={onViewAll}>View</button>
    </div>
  ),
}));

describe('Dashboard route', () => {
  it('redirects to /login when unauthenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, isLoading: false });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<DashboardPage />);

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('renders Dashboard when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1 }, isLoading: false });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<DashboardPage />);

    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });
});


