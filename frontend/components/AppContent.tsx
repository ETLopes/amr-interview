'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { MainApp } from './MainApp';
import { setGlobalApiConfig } from '../config/api';

export function AppContent() {
  const { user, isLoading } = useAuth();

  // Configure API URL if available in environment
  // This will run once when the app loads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // You can set the API URL here if needed
      // setGlobalApiConfig({ baseURL: 'https://your-api.example.com' });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <MainApp /> : <LoginForm />;
}