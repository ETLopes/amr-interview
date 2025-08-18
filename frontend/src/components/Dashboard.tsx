import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { CreditScoreCard } from './CreditScoreCard';
import { PropertyImporter } from './PropertyImporter';
import {
  Home,
  DollarSign,
  TrendingUp,
  Calculator,
  PiggyBank,
  BarChart3,
  Plus,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';

interface DashboardProps {
  onCreateNew: () => void;
  onViewAll: () => void;
}

export function Dashboard({ onCreateNew, onViewAll }: DashboardProps) {
  const { user, simulations, betaFeaturesEnabled, toggleBetaFeatures } = useAuth();

  const stats = React.useMemo(() => {
    if (simulations.length === 0) {
      return {
        totalSimulations: 0,
        averagePropertyValue: 0,
        totalToSave: 0,
        averageDownPayment: 0,
        totalFinancing: 0,
        averageContractYears: 0,
      };
    }

    const totalPropertyValue = simulations.reduce((sum, sim) => sum + sim.valorImovel, 0);
    const totalToSave = simulations.reduce((sum, sim) => sum + sim.totalGuardar, 0);
    const totalDownPayment = simulations.reduce((sum, sim) => sum + sim.valorEntrada, 0);
    const totalFinancing = simulations.reduce((sum, sim) => sum + sim.valorFinanciar, 0);
    const totalContractYears = simulations.reduce((sum, sim) => sum + sim.anosContrato, 0);

    return {
      totalSimulations: simulations.length,
      averagePropertyValue: totalPropertyValue / simulations.length,
      totalToSave,
      averageDownPayment: totalDownPayment / simulations.length,
      totalFinancing,
      averageContractYears: totalContractYears / simulations.length,
    };
  }, [simulations]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const recentSimulations = simulations
    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header with Beta Toggle */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Bem-vindo, {user?.nome?.split(' ')[0] || 'Usuário'}!
          </h1>
          <p className="text-muted-foreground">
            Acompanhe suas simulações e planeje a compra do seu imóvel
          </p>
        </div>

        {/* Beta Features Toggle */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="beta-mode"
                checked={betaFeaturesEnabled}
                onCheckedChange={toggleBetaFeatures}
              />
              <Label htmlFor="beta-mode" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Recursos Beta</span>
                {betaFeaturesEnabled && (
                  <Badge variant="secondary" className="text-xs">
                    ATIVO
                  </Badge>
                )}
              </Label>
            </div>
            {betaFeaturesEnabled && (
              <p className="text-xs text-muted-foreground mt-2">
                Score de crédito e importador de anúncios ativados
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Beta Features Section */}
      {betaFeaturesEnabled && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Recursos Beta</h2>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
              Novidades
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Credit Score Card */}
            <div className="lg:col-span-2">
              <CreditScoreCard />
            </div>

            {/* Quick Beta Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  Ações Beta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PropertyImporter />

                <Button
                  variant="outline"
                  className="w-full h-16 flex-col gap-2 border-dashed"
                  disabled
                >
                  <Target className="h-5 w-5" />
                  Comparar Mercado
                  <Badge variant="secondary" className="text-xs">
                    EM BREVE
                  </Badge>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="secondary">{stats.totalSimulations}</Badge>
            </div>
            <div>
              <h3 className="font-semibold">Simulações</h3>
              <p className="text-sm text-muted-foreground">Total criadas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <Home className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Valor Médio</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{formatCurrency(stats.averagePropertyValue)}</h3>
              <p className="text-sm text-muted-foreground">Preço dos imóveis</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <PiggyBank className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Reserva</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{formatCurrency(stats.totalToSave)}</h3>
              <p className="text-sm text-muted-foreground">Total a guardar</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Média</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{stats.averageContractYears.toFixed(1)} anos</h3>
              <p className="text-sm text-muted-foreground">Prazo de financiamento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Simulations */}
      {recentSimulations.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Simulações Recentes
              </CardTitle>
              <Button variant="outline" size="sm" onClick={onViewAll}>
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSimulations.map((simulation) => (
              <div
                key={simulation.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{simulation.nome}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {formatCurrency(simulation.valorImovel)}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {simulation.percentualEntrada}% entrada
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-medium text-green-600">
                    {formatCurrency(simulation.valorEntrada)}
                  </p>
                  <p className="text-xs text-muted-foreground">Entrada</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={onCreateNew} className="h-16 flex-col gap-2">
              <Plus className="h-5 w-5" />
              Nova Simulação
            </Button>

            <Button variant="outline" onClick={onViewAll} className="h-16 flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              Ver Todas as Simulações
            </Button>

            {betaFeaturesEnabled && (
              <PropertyImporter />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {stats.totalSimulations === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <Calculator className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Comece a simular agora!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Crie sua primeira simulação de compra de imóvel e descubra quanto você
                precisa poupar e qual será o valor do seu financiamento.
                {betaFeaturesEnabled && ' Use os recursos beta para importar anúncios!'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button onClick={onCreateNew} size="lg" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Simulação
              </Button>
              {betaFeaturesEnabled && (
                <PropertyImporter />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}