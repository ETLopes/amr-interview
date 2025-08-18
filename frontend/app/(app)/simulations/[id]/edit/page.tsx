'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { SimulationForm } from '../../../../components/SimulationForm';

export default function EditSimulationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading, simulations } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  const simulation = useMemo(() => {
    const id = Number(params?.id);
    return simulations.find((s) => s.id === id) || null;
  }, [params, simulations]);

  if (isLoading || !user) return null;

  return (
    <SimulationForm
      simulation={simulation}
      onSuccess={() => router.push('/simulations')}
      onCancel={() => router.back()}
    />
  );
}


