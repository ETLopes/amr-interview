'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AppContent } from '../components/AppContent';
import { Toaster } from '../components/ui/sonner';

export default function HomePage() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}