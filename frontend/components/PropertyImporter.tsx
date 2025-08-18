'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { SimulationCreate } from '../services/api';
import { 
  Download, 
  Link as LinkIcon, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Home,
  MapPin,
  DollarSign,
  Hash,
  Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface PropertyData {
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  url: string;
  propertyType?: string;
}

export function PropertyImporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [importedProperty, setImportedProperty] = useState<PropertyData | null>(null);
  const [error, setError] = useState('');
  const { addSimulation } = useAuth();

  const supportedPortals = [
    'OLX', 'Viva Real', 'Zap Imóveis', 'QuintoAndar', 'Imovelweb'
  ];

  // Mock function to simulate property data extraction
  const extractPropertyData = async (url: string): Promise<PropertyData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data based on different portal patterns
    const mockProperties: PropertyData[] = [
      {
        title: 'Apartamento 3 quartos na Barra da Tijuca',
        price: 850000,
        address: 'Barra da Tijuca, Rio de Janeiro - RJ',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        description: 'Apartamento moderno com vista para o mar, varanda gourmet e 2 vagas de garagem.',
        url,
        propertyType: 'Apartamento'
      },
      {
        title: 'Casa 4 quartos em Copacabana',
        price: 1200000,
        address: 'Copacabana, Rio de Janeiro - RJ',
        bedrooms: 4,
        bathrooms: 3,
        area: 180,
        description: 'Casa ampla próxima à praia, com quintal e área de lazer completa.',
        url,
        propertyType: 'Casa'
      },
      {
        title: 'Cobertura duplex em Ipanema',
        price: 2500000,
        address: 'Ipanema, Rio de Janeiro - RJ',
        bedrooms: 4,
        bathrooms: 4,
        area: 250,
        description: 'Cobertura de luxo com terraço, piscina privativa e vista panorâmica.',
        url,
        propertyType: 'Cobertura'
      }
    ];
    
    // Return random mock property
    return mockProperties[Math.floor(Math.random() * mockProperties.length)];
  };

  const handleImport = async () => {
    if (!url.trim()) {
      setError('Por favor, insira a URL do anúncio');
      return;
    }

    // Basic URL validation
    if (!url.includes('http') || !url.includes('.')) {
      setError('URL inválida. Verifique o endereço do anúncio');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const propertyData = await extractPropertyData(url);
      setImportedProperty(propertyData);
    } catch (err) {
      setError('Erro ao importar dados do anúncio. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSimulation = async () => {
    if (!importedProperty) return;

    const simulationData: SimulationCreate = {
      nome: importedProperty.title,
      valorImovel: importedProperty.price,
      percentualEntrada: 20, // Default 20%
      anosContrato: 25, // Default 25 years
      endereco: importedProperty.address,
      tipoImovel: importedProperty.propertyType || 'Apartamento',
      observacoes: `Importado de: ${importedProperty.url}\n\nDescrição: ${importedProperty.description}\n\nDetalhes: ${importedProperty.bedrooms} quartos, ${importedProperty.bathrooms} banheiros, ${importedProperty.area}m²`,
    };

    try {
      await addSimulation(simulationData);
      setIsOpen(false);
      setUrl('');
      setImportedProperty(null);
    } catch (error) {
      console.error('Error creating simulation:', error);
      setError('Erro ao criar simulação. Tente novamente.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center gap-1 p-3">
          <Download className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm leading-tight text-center">Importar Anúncio</span>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            BETA
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3">
            <Download className="h-5 w-5" />
            <span>Importar Anúncio de Imóvel</span>
            <Badge variant="secondary">BETA</Badge>
          </DialogTitle>
          <DialogDescription>
            Cole o link do anúncio de um portal imobiliário para importar automaticamente os dados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Supported Portals */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Portais Suportados</Label>
            <div className="flex flex-wrap gap-2">
              {supportedPortals.map((portal) => (
                <Badge key={portal} variant="outline" className="text-xs">
                  {portal}
                </Badge>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-3">
            <Label htmlFor="property-url">URL do Anúncio</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="property-url"
                  placeholder="https://exemplo.com/anuncio-imovel"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleImport} 
                disabled={isLoading || !url.trim()}
                className="sm:w-auto w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  'Importar'
                )}
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Imported Property Display */}
          {importedProperty && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg text-green-800">
                    Dados Importados com Sucesso!
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Title and Address */}
                <div className="space-y-2">
                  <h4 className="font-medium text-green-800 text-base leading-tight">
                    {importedProperty.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{importedProperty.address}</span>
                  </div>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Preço</span>
                    </div>
                    <p className="text-xl font-bold text-green-700">
                      {formatCurrency(importedProperty.price)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Detalhes</span>
                    </div>
                    <div className="space-y-1 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Tipo:</span>
                        <span className="font-medium">{importedProperty.propertyType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quartos:</span>
                        <span className="font-medium">{importedProperty.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Banheiros:</span>
                        <span className="font-medium">{importedProperty.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Área:</span>
                        <span className="font-medium">{importedProperty.area}m²</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-4 border-t border-green-200">
                  <p className="text-sm text-green-600 leading-relaxed">
                    {importedProperty.description}
                  </p>
                </div>

                {/* Simulation Preview */}
                <div className="pt-4 border-t border-green-200">
                  <h5 className="text-sm font-medium text-green-800 mb-3">
                    Valores da Simulação (20% entrada, 25 anos)
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600">Entrada:</span>
                      <span className="font-medium text-green-700">
                        {formatCurrency(importedProperty.price * 0.2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Financiamento:</span>
                      <span className="font-medium text-green-700">
                        {formatCurrency(importedProperty.price * 0.8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Total a guardar:</span>
                      <span className="font-medium text-green-700">
                        {formatCurrency(importedProperty.price * 0.15)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Poupança mensal:</span>
                      <span className="font-medium text-green-700">
                        {formatCurrency((importedProperty.price * 0.15) / (25 * 12))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={handleCreateSimulation} 
                  className="w-full bg-green-600 hover:bg-green-700 h-12"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Criar Simulação com estes Dados
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Help Text */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Como usar</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 pl-6">
              <p>1. Acesse o anúncio do imóvel em um dos portais suportados</p>
              <p>2. Copie a URL da página do anúncio</p>
              <p>3. Cole aqui e clique em "Importar"</p>
              <p>4. Os dados serão extraídos automaticamente para sua simulação</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}