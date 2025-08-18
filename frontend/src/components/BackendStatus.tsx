'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { testBackendConnection } from '@/lib/test-integration';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export function BackendStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await testBackendConnection();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando conexão...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          Status do Backend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge
          variant={isConnected ? "default" : "destructive"}
          className="w-full justify-center"
        >
          {isConnected ? "Conectado" : "Desconectado"}
        </Badge>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {isConnected
            ? "API funcionando normalmente"
            : "Erro na conexão com o backend"
          }
        </p>
      </CardContent>
    </Card>
  );
}
