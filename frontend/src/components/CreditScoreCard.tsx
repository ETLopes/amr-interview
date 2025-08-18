import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Star,
  AlertTriangle,
  CheckCircle2,
  Info,
  Target
} from 'lucide-react';

export function CreditScoreCard() {
  const { calculateCreditScore } = useAuth();
  const creditScore = calculateCreditScore();

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'excelente': return 'text-green-600 bg-green-50 border-green-200';
      case 'alto': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'médio': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baixo': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreIcon = (level: string) => {
    switch (level) {
      case 'excelente': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'alto': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'médio': return <Star className="h-5 w-5 text-yellow-600" />;
      case 'baixo': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getScoreDescription = (level: string) => {
    switch (level) {
      case 'excelente': return 'Perfil ideal para crédito imobiliário';
      case 'alto': return 'Bom perfil com alta probabilidade de aprovação';
      case 'médio': return 'Perfil adequado com algumas melhorias possíveis';
      case 'baixo': return 'Perfil inicial, continue planejando';
      default: return 'Faça simulações para avaliar seu perfil';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <span>Score de Elegibilidade</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            BETA
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center space-y-6">
          <div className="relative inline-flex items-end justify-center gap-1">
            <div className="text-4xl font-bold text-primary">
              {creditScore.score}
            </div>
            <div className="text-lg text-muted-foreground mb-1">/100</div>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getScoreColor(creditScore.level)}`}>
            {getScoreIcon(creditScore.level)}
            <span className="font-medium capitalize">{creditScore.level}</span>
          </div>

          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {getScoreDescription(creditScore.level)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pontuação atual</span>
            <span className="font-medium">{creditScore.score}%</span>
          </div>
          <Progress value={creditScore.score} className="h-2" />
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Fatores de Avaliação</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Valor Entrada</span>
                <span className="font-medium">{creditScore.factors.averageDownPayment}/25</span>
              </div>
              <Progress value={(creditScore.factors.averageDownPayment / 25) * 100} className="h-1" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Estabilidade</span>
                <span className="font-medium">{creditScore.factors.contractStability}/25</span>
              </div>
              <Progress value={(creditScore.factors.contractStability / 25) * 100} className="h-1" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Simulações</span>
                <span className="font-medium">{creditScore.factors.simulationCount}/25</span>
              </div>
              <Progress value={(creditScore.factors.simulationCount / 25) * 100} className="h-1" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Planejamento</span>
                <span className="font-medium">{creditScore.factors.planningConsistency}/25</span>
              </div>
              <Progress value={(creditScore.factors.planningConsistency / 25) * 100} className="h-1" />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3 pt-3 border-t">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recomendações
          </h4>
          <ul className="space-y-2">
            {creditScore.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}