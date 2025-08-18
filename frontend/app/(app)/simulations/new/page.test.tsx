import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import NewSimulationPage from './page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1 }, isLoading: false }),
}));

jest.mock('@/components/SimulationForm', () => ({
  SimulationForm: ({ onSuccess, onCancel }: any) => (
    <div>
      <button onClick={onSuccess}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe('New simulation route', () => {
  it('renders SimulationForm and navigates on actions', () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<NewSimulationPage />);

    screen.getByText('Submit').click();
    expect(push).toHaveBeenCalledWith('/simulations');
  });
});


