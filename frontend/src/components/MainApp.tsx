import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth, Simulation } from '@/contexts/AuthContext';
import { Dashboard } from './Dashboard';
import { SimulationForm } from './SimulationForm';
import { SimulationList } from './SimulationList';
import {
  Home,
  Calculator,
  List,
  LogOut,
  User,
  ArrowLeft,
  Settings
} from 'lucide-react';

type View = 'dashboard' | 'simulations' | 'new-simulation' | 'edit-simulation';

export function MainApp() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingSimulation, setEditingSimulation] = useState<Simulation | null>(null);
  const { user, logout, simulations } = useAuth();

  const handleCreateNew = () => {
    setEditingSimulation(null);
    setCurrentView('new-simulation');
  };

  const handleEdit = (simulation: Simulation) => {
    setEditingSimulation(simulation);
    setCurrentView('edit-simulation');
  };

  const handleFormSuccess = () => {
    setEditingSimulation(null);
    setCurrentView('simulations');
  };

  const handleFormCancel = () => {
    setEditingSimulation(null);
    setCurrentView('simulations');
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'simulations':
        return 'Suas Simulações';
      case 'new-simulation':
        return 'Nova Simulação';
      case 'edit-simulation':
        return 'Editar Simulação';
      default:
        return 'aMORA';
    }
  };

  const showBackButton = currentView !== 'dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-100/50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Home className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-primary">aMORA</h1>
                  <p className="text-xs text-muted-foreground">{getPageTitle()}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>

              <Button
                variant={currentView === 'simulations' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('simulations')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Simulações
                {simulations.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                    {simulations.length}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateNew}
                className="gap-2"
              >
                <Calculator className="h-4 w-4" />
                Nova Simulação
              </Button>
            </nav>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{user?.nome}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1 py-2 overflow-x-auto">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('dashboard')}
              className="gap-2 whitespace-nowrap"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant={currentView === 'simulations' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('simulations')}
              className="gap-2 whitespace-nowrap"
            >
              <List className="h-4 w-4" />
              Simulações
              {simulations.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                  {simulations.length}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateNew}
              className="gap-2 whitespace-nowrap"
            >
              <Calculator className="h-4 w-4" />
              Nova
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            onCreateNew={handleCreateNew}
            onViewAll={() => setCurrentView('simulations')}
          />
        )}

        {currentView === 'simulations' && (
          <SimulationList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
          />
        )}

        {(currentView === 'new-simulation' || currentView === 'edit-simulation') && (
          <SimulationForm
            simulation={editingSimulation}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary rounded">
                <Home className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-primary">aMORA</span>
              <Badge variant="outline" className="text-xs">
                v1.0.0
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              © 2024 aMORA. Simulador de Compra de Imóveis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}