import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SimulationsPage from './page';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/SimulationList', () => ({
  SimulationList: ({ onCreateNew, onEdit }: any) => (
    <div>
      <button onClick={onCreateNew}>New</button>
      <button onClick={() => onEdit({ id: 123 })}>Edit</button>
    </div>
  ),
}));

describe('Simulations route', () => {
  it('redirects to /login when unauthenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, isLoading: false });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<SimulationsPage />);

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('renders SimulationList when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1 }, isLoading: false });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<SimulationsPage />);

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});


