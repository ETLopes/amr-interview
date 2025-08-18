// Integration test utilities for testing backend connectivity
import { apiFetch } from './api';

export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await apiFetch('/health');
    return response.status === 'healthy';
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
}

export async function testCalculationEndpoint(): Promise<boolean> {
  try {
    const testData = {
      property_value: 500000,
      down_payment_percentage: 20,
      contract_years: 25
    };
    
    const response = await apiFetch('/calculate', {
      method: 'POST',
      body: JSON.stringify(testData)
    });
    
    return response.calculated_values && 
           response.calculated_values.down_payment_amount === 100000;
  } catch (error) {
    console.error('Calculation endpoint test failed:', error);
    return false;
  }
}

export async function runIntegrationTests(): Promise<{
  backendConnection: boolean;
  calculationEndpoint: boolean;
  overall: boolean;
}> {
  const backendConnection = await testBackendConnection();
  const calculationEndpoint = await testCalculationEndpoint();
  
  return {
    backendConnection,
    calculationEndpoint,
    overall: backendConnection && calculationEndpoint
  };
}
