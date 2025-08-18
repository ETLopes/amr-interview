'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Home, Mail, Lock, User, AlertCircle, Loader2, Wifi, WifiOff } from 'lucide-react';

export function LoginForm() {
  const { login, register, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(apiService.isOffline());

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(loginData.email, loginData.password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerData.nome || !registerData.email || !registerData.senha) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (registerData.senha !== registerData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (registerData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    try {
      await register(registerData.email, registerData.nome, registerData.senha);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(message);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    apiService.setOfflineMode(true);
    setIsOffline(true);
    
    try {
      await login('demo@amora.com', 'demo123');
    } catch (err) {
      // Demo login should not fail
    }
  };

  const toggleOfflineMode = () => {
    const newOfflineMode = !isOffline;
    apiService.setOfflineMode(newOfflineMode);
    setIsOffline(newOfflineMode);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="p-3 bg-primary rounded-lg">
              <Home className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center">
                <h1 className="text-2xl font-bold">aMORA</h1>
                <Badge variant={isOffline ? "secondary" : "outline"} className="text-xs">
                  {isOffline ? (
                    <>
                      <WifiOff className="h-3 w-3 mr-1" />
                      Demo
                    </>
                  ) : (
                    <>
                      <Wifi className="h-3 w-3 mr-1" />
                      Online
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Simulador Imobiliário</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Simule a compra do seu imóvel dos sonhos
          </p>
        </div>

        {/* Auth Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle>Fazer Login</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar suas simulações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Crie sua conta para começar a simular a compra de imóveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={registerData.nome}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, nome: e.target.value }))}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={registerData.senha}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, senha: e.target.value }))}
                        className="pl-10"
                        disabled={isLoading}
                        minLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={registerData.confirmarSenha}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Mode Switch and Demo Login */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleOfflineMode}
              className="text-xs"
            >
              {isOffline ? (
                <>
                  <Wifi className="h-3 w-3 mr-2" />
                  Tentar Conexão
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-2" />
                  Modo Demo
                </>
              )}
            </Button>
          </div>

          {isOffline && (
            <div className="text-center">
              <Button
                variant="secondary"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full max-w-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Home className="mr-2 h-4 w-4" />
                    Entrar no Demo
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            Simule diferentes cenários de compra e descubra o melhor plano para você
          </p>
          
          {isOffline && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-blue-800 text-xs">
                <strong>Modo Demo:</strong> Todos os dados são salvos localmente no seu navegador.
                Para usar com dados reais, configure a URL da API no backend.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}