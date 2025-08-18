'use client';

import React from 'react';
import { Home, WifiOff, Wifi } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiService } from '../../services/api';
import { Badge } from '../../components/ui/badge';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isOffline = typeof window !== 'undefined' ? getApiService().isOffline() : false;
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-100/50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-xl text-primary">aMORA</h1>
                  <Badge variant={isOffline ? 'secondary' : 'outline'} className="text-xs">
                    {isOffline ? (
                      <>
                        <WifiOff className="h-3 w-3 mr-1" /> Demo
                      </>
                    ) : (
                      <>
                        <Wifi className="h-3 w-3 mr-1" /> Online
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{user?.nome || user?.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-destructive"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}


