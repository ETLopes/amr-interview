'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from '../components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}


