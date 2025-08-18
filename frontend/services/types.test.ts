import {
  mapApiUserToUser,
  mapUserCreateToApi,
  mapApiSimulationToSimulation,
  mapSimulationCreateToApi,
  ApiUser,
  ApiSimulation,
  SimulationCreate,
} from '@/services/types';

describe('types mappers', () => {
  it('maps ApiUser to User', () => {
    const api: ApiUser = {
      id: 1,
      email: 'a@b.com',
      name: 'Ana',
      created_at: '2020-01-01',
      updated_at: '2020-01-02',
    };
    expect(mapApiUserToUser(api)).toEqual({
      id: 1,
      email: 'a@b.com',
      nome: 'Ana',
      dataCriacao: '2020-01-01',
      dataAtualizacao: '2020-01-02',
    });
  });

  it('maps UserCreate to ApiUserCreate', () => {
    expect(mapUserCreateToApi({ email: 'a@b.com', nome: 'Ana', senha: 'x' })).toEqual({
      email: 'a@b.com',
      name: 'Ana',
      password: 'x',
    });
  });

  it('maps ApiSimulation to Simulation', () => {
    const api: ApiSimulation = {
      id: 7,
      user_id: 1,
      property_value: 500000,
      down_payment_percentage: 20,
      contract_years: 30,
      property_address: 'Rua X',
      property_type: 'house',
      notes: 'ok',
      down_payment_amount: 100000,
      financing_amount: 400000,
      total_to_save: 75000,
      monthly_savings: 200,
      created_at: '2024-01-01',
      updated_at: '2024-01-02',
    };
    const mapped = mapApiSimulationToSimulation(api);
    expect(mapped.id).toBe(7);
    expect(mapped.valorImovel).toBe(500000);
    expect(mapped.valorEntrada).toBe(100000);
    expect(mapped.valorMensalPoupanca).toBe(200);
  });

  it('maps SimulationCreate to ApiSimulationCreate', () => {
    const sim: SimulationCreate = {
      nome: 'Casa',
      valorImovel: 500000,
      percentualEntrada: 20,
      anosContrato: 30,
      endereco: 'Rua X',
      tipoImovel: 'house',
      observacoes: 'ok',
    };
    expect(mapSimulationCreateToApi(sim)).toEqual({
      property_value: 500000,
      down_payment_percentage: 20,
      contract_years: 30,
      property_address: 'Rua X',
      property_type: 'house',
      notes: 'ok',
    });
  });
});


