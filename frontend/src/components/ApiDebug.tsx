'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { environment, getApiUrl } from '@/config/environment';
import { apiFetch } from '@/lib/api';

export function ApiDebug() {
  const [testResults, setTestResults] = useState<{
    config: boolean;
    health: boolean;
    register: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const results = {
      config: false,
      health: false,
      register: false,
    };

    try {
      // Test 1: Configuration
      console.log('🔧 Environment config:', environment);
      console.log('🌐 API Base URL:', environment.api.baseUrl);
      results.config = true;

      // Test 2: Health endpoint
      try {
        const healthResponse = await apiFetch('/health');
        console.log('🏥 Health response:', healthResponse);
        results.health = true;
      } catch (error) {
        console.error('❌ Health check failed:', error);
      }

      // Test 3: Register endpoint (with test data)
      try {
        const testEmail = `test${Date.now()}@example.com`;
        const registerResponse = await apiFetch('/register', {
          method: 'POST',
          body: JSON.stringify({
            email: testEmail,
            password: 'testpass123',
            name: 'Test User'
          })
        });
        console.log('✅ Register response:', registerResponse);
        results.register = true;
      } catch (error) {
        console.error('❌ Register test failed:', error);
      }

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      setIsLoading(false);
      setTestResults(results);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 API Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Current API Configuration:
          </p>
          <div className="p-2 bg-muted rounded text-xs font-mono">
            {environment.api.baseUrl}
          </div>
        </div>

        <Button
          onClick={runTests}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Running Tests...' : 'Run API Tests'}
        </Button>

        {testResults && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Test Results:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={testResults.config ? "default" : "destructive"}>
                  {testResults.config ? "✅" : "❌"}
                </Badge>
                <span className="text-sm">Configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={testResults.health ? "default" : "destructive"}>
                  {testResults.health ? "✅" : "❌"}
                </Badge>
                <span className="text-sm">Health Check</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={testResults.register ? "default" : "destructive"}>
                  {testResults.register ? "✅" : "❌"}
                </Badge>
                <span className="text-sm">Register Endpoint</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Check browser console for detailed logs
        </div>
      </CardContent>
    </Card>
  );
}
