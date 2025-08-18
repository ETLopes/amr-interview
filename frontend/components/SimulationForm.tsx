'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { Simulation, SimulationCreate } from '../services/api';
import {
  Home,
  DollarSign,
  Percent,
  Calendar,
  Calculator,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface SimulationFormProps {
  simulation?: Simulation | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SimulationForm({ simulation: editingSimulation, onSuccess, onCancel }: SimulationFormProps) {
  const { addSimulation, updateSimulation } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<SimulationCreate>({
    nome: '',
    valorImovel: 0,
    percentualEntrada: 20,
    anosContrato: 25,
    endereco: '',
    tipoImovel: '',
    observacoes: '',
  });

  const [calculatedValues, setCalculatedValues] = useState({
    valorEntrada: 0,
    valorFinanciar: 0,
    totalGuardar: 0,
    valorMensalPoupanca: 0,
  });

  // Property types for selection
  const propertyTypes = [
    'Apartamento',
    'Casa',
    'Cobertura',
    'Loft',
    'Studio',
    'Kitnet',
    'Sobrado',
    'Chácara',
    'Sítio',
    'Terreno',
    'Ponto Comercial',
    'Sala Comercial',
    'Galpão',
    'Outro'
  ];

  // Initialize form data if editing
  useEffect(() => {
    if (editingSimulation) {
      setFormData({
        nome: editingSimulation.nome,
        valorImovel: editingSimulation.valorImovel,
        percentualEntrada: editingSimulation.percentualEntrada,
        anosContrato: editingSimulation.anosContrato,
        endereco: editingSimulation.endereco || '',
        tipoImovel: editingSimulation.tipoImovel || '',
        observacoes: editingSimulation.observacoes || '',
      });
    }
  }, [editingSimulation]);

  // Calculate values whenever relevant form data changes
  useEffect(() => {
    if (formData.valorImovel > 0) {
      const valorEntrada = (formData.valorImovel * formData.percentualEntrada) / 100;
      const valorFinanciar = formData.valorImovel - valorEntrada;
      const totalGuardar = formData.valorImovel * 0.15; // 15% do valor total
      const mesesContrato = formData.anosContrato * 12;
      const valorMensalPoupanca = mesesContrato > 0 ? totalGuardar / mesesContrato : 0;

      setCalculatedValues({
        valorEntrada,
        valorFinanciar,
        totalGuardar,
        valorMensalPoupanca,
      });
    }
  }, [formData.valorImovel, formData.percentualEntrada, formData.anosContrato]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleInputChange = (field: keyof SimulationCreate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      setError('Nome da simulação é obrigatório');
      return false;
    }

    if (formData.valorImovel <= 0) {
      setError('Valor do imóvel deve ser maior que zero');
      return false;
    }

    if (formData.percentualEntrada < 0 || formData.percentualEntrada > 100) {
      setError('Percentual de entrada deve estar entre 0% e 100%');
      return false;
    }

    if (formData.anosContrato < 1 || formData.anosContrato > 30) {
      setError('Anos de contrato deve estar entre 1 e 30 anos');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingSimulation) {
        await updateSimulation(editingSimulation.id, formData);
      } else {
        await addSimulation(formData);
      }
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar simulação';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {editingSimulation ? 'Editar Simulação' : 'Nova Simulação'}
          </h1>
          <p className="text-muted-foreground">
            {editingSimulation
              ? 'Atualize os dados da sua simulação'
              : 'Simule a compra do seu imóvel dos sonhos'
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Dados da Simulação
              </CardTitle>
              <CardDescription>
                Preencha as informações para calcular sua simulação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Informações Básicas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome da Simulação</Label>
                      <Input
                        id="nome"
                        placeholder="Ex: Apartamento Copacabana"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipoImovel">Tipo de Imóvel</Label>
                      <Select
                        value={formData.tipoImovel}
                        onValueChange={(value) => handleInputChange('tipoImovel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="endereco"
                        placeholder="Ex: Rua das Flores, 123 - Copacabana, RJ"
                        value={formData.endereco}
                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valores Financeiros
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorImovel">Valor do Imóvel (R$)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="valorImovel"
                          type="number"
                          min="0"
                          step="1000"
                          placeholder="500000"
                          value={formData.valorImovel || ''}
                          onChange={(e) => handleInputChange('valorImovel', Number(e.target.value))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="percentualEntrada">Percentual de Entrada (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="percentualEntrada"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          placeholder="20"
                          value={formData.percentualEntrada}
                          onChange={(e) => handleInputChange('percentualEntrada', Number(e.target.value))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anosContrato">Anos de Financiamento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="anosContrato"
                        type="number"
                        min="1"
                        max="30"
                        step="1"
                        placeholder="25"
                        value={formData.anosContrato}
                        onChange={(e) => handleInputChange('anosContrato', Number(e.target.value))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Observações
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações Adicionais</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Notas sobre a simulação, características do imóvel, etc."
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Salvando...'
                  ) : editingSimulation ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Atualizar Simulação
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Criar Simulação
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>
                Valores calculados automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Valor de Entrada</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(calculatedValues.valorEntrada)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Valor a Financiar</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(calculatedValues.valorFinanciar)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total a Guardar (15%)</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(calculatedValues.totalGuardar)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Poupança Mensal</span>
                  <span className="font-medium text-purple-600">
                    {formatCurrency(calculatedValues.valorMensalPoupanca)}
                  </span>
                </div>
              </div>

              {formData.valorImovel > 0 && (
                <div className="pt-4 border-t space-y-2">
                  <p className="text-xs text-muted-foreground">
                    * Valores calculados com base nas informações fornecidas
                  </p>
                  <p className="text-xs text-muted-foreground">
                    * Total a guardar = 15% do valor do imóvel
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Entrada mínima recomendada: 20%</p>
                <p>• Prazos longos reduzem parcelas, mas aumentam juros</p>
                <p>• Reserve 15% para custos extras (documentação, reforma, etc.)</p>
                <p>• Considere sua capacidade de pagamento mensal</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}