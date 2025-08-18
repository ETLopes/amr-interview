'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { SimulationList } from '../../components/SimulationList';

export default function SimulationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return (
    <SimulationList
      onCreateNew={() => router.push('/simulations/new')}
      onEdit={(sim) => router.push(`/simulations/${sim.id}/edit`)}
    />
  );
}


