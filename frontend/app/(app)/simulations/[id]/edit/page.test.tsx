import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import EditSimulationPage from './page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn().mockReturnValue({ id: '1' }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1 },
    isLoading: false,
    simulations: [{ id: 1, name: 'Sim 1' }],
  }),
}));

jest.mock('@/components/SimulationForm', () => ({
  SimulationForm: ({ onSuccess }: any) => (
    <button onClick={onSuccess}>Save</button>
  ),
}));

jest.mock('@/services/api', () => ({
  getApiService: () => ({
    getSimulation: jest.fn().mockResolvedValue({ id: 1, name: 'Sim 1' }),
  }),
}));

describe('Edit simulation route', () => {
  it('fetches and renders SimulationForm', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push, replace: push });

    render(<EditSimulationPage params={{ id: '1' }} /> as any);

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });
});


