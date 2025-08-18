import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { useAuth, Simulation } from '@/contexts/AuthContext';
import { Calculator, DollarSign, Calendar, PiggyBank, TrendingUp } from 'lucide-react';

interface SimulationFormProps {
  simulation?: Simulation;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SimulationForm({ simulation, onSuccess, onCancel }: SimulationFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    valorImovel: '',
    percentualEntrada: '',
    anosContrato: '',
  });

  const [calculations, setCalculations] = useState({
    valorEntrada: 0,
    valorFinanciar: 0,
    totalGuardar: 0,
    valorMensalPoupanca: 0,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const { addSimulation, updateSimulation } = useAuth();

  useEffect(() => {
    if (simulation) {
      setFormData({
        nome: simulation.nome,
        valorImovel: simulation.valorImovel.toString(),
        percentualEntrada: simulation.percentualEntrada.toString(),
        anosContrato: simulation.anosContrato.toString(),
      });
    }
  }, [simulation]);

  useEffect(() => {
    calculateValues();
  }, [formData]);

  const calculateValues = () => {
    const valorImovel = parseFloat(formData.valorImovel) || 0;
    const percentualEntrada = parseFloat(formData.percentualEntrada) || 0;
    const anosContrato = parseFloat(formData.anosContrato) || 0;

    const valorEntrada = valorImovel * (percentualEntrada / 100);
    const valorFinanciar = valorImovel - valorEntrada;
    const totalGuardar = valorImovel * 0.15;
    const valorMensalPoupanca = anosContrato > 0 ? totalGuardar / (anosContrato * 12) : 0;

    setCalculations({
      valorEntrada,
      valorFinanciar,
      totalGuardar,
      valorMensalPoupanca,
    });
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.nome.trim()) {
      errors.push('Nome da simulação é obrigatório');
    }

    const valorImovel = parseFloat(formData.valorImovel);
    if (!valorImovel || valorImovel <= 0) {
      errors.push('Valor do imóvel deve ser maior que zero');
    }

    const percentualEntrada = parseFloat(formData.percentualEntrada);
    if (!percentualEntrada || percentualEntrada < 0 || percentualEntrada > 100) {
      errors.push('Percentual de entrada deve estar entre 0% e 100%');
    }

    const anosContrato = parseFloat(formData.anosContrato);
    if (!anosContrato || anosContrato <= 0 || anosContrato > 35) {
      errors.push('Anos de contrato deve estar entre 1 e 35 anos');
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    const simulationData = {
      nome: formData.nome.trim(),
      valorImovel: parseFloat(formData.valorImovel),
      percentualEntrada: parseFloat(formData.percentualEntrada),
      anosContrato: parseFloat(formData.anosContrato),
      ...calculations,
    };

    if (simulation) {
      updateSimulation(simulation.id, simulationData);
    } else {
      addSimulation(simulationData);
    }

    onSuccess?.();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {simulation ? 'Editar Simulação' : 'Nova Simulação'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Simulação</Label>
              <Input
                id="nome"
                placeholder="Ex: Casa dos Sonhos, Apartamento Centro"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorImovel">Valor do Imóvel (R$)</Label>
                <Input
                  id="valorImovel"
                  type="number"
                  placeholder="500000"
                  value={formData.valorImovel}
                  onChange={(e) => setFormData({ ...formData, valorImovel: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentualEntrada">Entrada (%)</Label>
                <Input
                  id="percentualEntrada"
                  type="number"
                  placeholder="20"
                  min="0"
                  max="100"
                  value={formData.percentualEntrada}
                  onChange={(e) => setFormData({ ...formData, percentualEntrada: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anosContrato">Anos de Contrato</Label>
                <Input
                  id="anosContrato"
                  type="number"
                  placeholder="25"
                  min="1"
                  max="35"
                  value={formData.anosContrato}
                  onChange={(e) => setFormData({ ...formData, anosContrato: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {simulation ? 'Atualizar' : 'Criar'} Simulação
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Calculations Display */}
      {(calculations.valorEntrada > 0 || calculations.valorFinanciar > 0) && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resultados da Simulação
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Valor da Entrada</span>
                </div>
                <p className="text-xl font-bold text-blue-700">
                  {formatCurrency(calculations.valorEntrada)}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <Calculator className="h-4 w-4" />
                  <span className="text-sm font-medium">Valor a Financiar</span>
                </div>
                <p className="text-xl font-bold text-green-700">
                  {formatCurrency(calculations.valorFinanciar)}
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-yellow-600">
                  <PiggyBank className="h-4 w-4" />
                  <span className="text-sm font-medium">Total a Guardar</span>
                </div>
                <p className="text-xl font-bold text-yellow-700">
                  {formatCurrency(calculations.totalGuardar)}
                </p>
                <Badge variant="secondary" className="text-xs">
                  15% do valor do imóvel
                </Badge>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-purple-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Poupança Mensal</span>
                </div>
                <p className="text-xl font-bold text-purple-700">
                  {formatCurrency(calculations.valorMensalPoupanca)}
                </p>
                <Badge variant="secondary" className="text-xs">
                  Para custos adicionais
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}