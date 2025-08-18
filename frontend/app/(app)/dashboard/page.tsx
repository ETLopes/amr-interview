'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from '@/components/Dashboard';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return (
    <Dashboard
      onCreateNew={() => router.push('/simulations/new')}
      onViewAll={() => router.push('/simulations')}
    />
  );
}


