'use client';

import React, { useEffect, useState } from 'react';
import { environment, getApiUrl } from '@/config/environment';
import { apiFetch } from '@/lib/api';

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    try {
      console.log('🔧 Environment:', environment);
      console.log('🌐 API Base URL:', environment.api.baseUrl);
      console.log('🔗 Full URL for /health:', getApiUrl('/health'));

      const response = await apiFetch('/health');
      console.log('✅ Response:', response);
      setTestResults({ success: true, data: response });
    } catch (error) {
      console.error('❌ Error:', error);
      setTestResults({ success: false, error: error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Current Configuration:</h2>
          <p>API Base URL: <code className="bg-white px-2 py-1 rounded">{environment.api.baseUrl}</code></p>
          <p>Environment: <code className="bg-white px-2 py-1 rounded">{environment.app.environment}</code></p>
        </div>

        <button
          onClick={runTest}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </button>

        {testResults && (
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold">Test Results:</h2>
            <pre className="bg-white p-2 rounded text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
