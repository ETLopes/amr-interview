import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth, Simulation } from '@/contexts/AuthContext';
import {
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  Home,
  TrendingUp,
  Plus,
  AlertCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface SimulationListProps {
  onCreateNew: () => void;
  onEdit: (simulation: Simulation) => void;
}

export function SimulationList({ onCreateNew, onEdit }: SimulationListProps) {
  const { simulations, deleteSimulation } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteSimulation(id);
    setDeletingId(null);
  };

  if (simulations.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-muted rounded-full">
              <Home className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Nenhuma simulação encontrada</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Comece criando sua primeira simulação de compra de imóvel para visualizar
              os cálculos e planejar seu investimento.
            </p>
          </div>
          <Button onClick={onCreateNew} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Simulação
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Suas Simulações</h2>
          <p className="text-muted-foreground">
            {simulations.length} simulação{simulations.length !== 1 ? 'ões' : ''} criada{simulations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Simulação
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {simulations.map((simulation) => (
          <Card key={simulation.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg line-clamp-1">{simulation.nome}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(simulation.dataCriacao)}
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {simulation.anosContrato} ano{simulation.anosContrato !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Main Values */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Home className="h-3 w-3" />
                    Valor do Imóvel
                  </div>
                  <p className="font-semibold text-primary">
                    {formatCurrency(simulation.valorImovel)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Entrada ({simulation.percentualEntrada}%)
                  </div>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(simulation.valorEntrada)}
                  </p>
                </div>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">A Financiar</div>
                  <p className="text-sm font-medium">
                    {formatCurrency(simulation.valorFinanciar)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Poupança Mensal</div>
                  <p className="text-sm font-medium text-blue-600">
                    {formatCurrency(simulation.valorMensalPoupanca)}
                  </p>
                </div>
              </div>

              {/* Total to Save Highlight */}
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Total a Guardar (15%)
                    </span>
                  </div>
                  <span className="font-bold text-yellow-700">
                    {formatCurrency(simulation.totalGuardar)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(simulation)}
                  className="flex-1"
                >
                  <Edit3 className="mr-2 h-3 w-3" />
                  Editar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={deletingId === simulation.id}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Excluir Simulação
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a simulação "{simulation.nome}"?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(simulation.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}