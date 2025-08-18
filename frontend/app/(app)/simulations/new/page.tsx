'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { SimulationForm } from '../../../components/SimulationForm';

export default function NewSimulationPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return (
    <SimulationForm
      onSuccess={() => router.push('/simulations')}
      onCancel={() => router.back()}
    />
  );
}


