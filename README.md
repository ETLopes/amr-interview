# Simulador Imobiliário aMORA

## TL;DR

Pré-requisitos: Docker, Docker Compose, Make e Git.

Subir o projeto em 2 passos:
```bash
git clone git@github.com:ETLopes/amr-interview.git
cd amora && make up
```

Primeira vez? Rode as migrações:
```bash
make migrate
```

URLs úteis:
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- Frontend: http://localhost:3000
- pgAdmin: http://localhost:5050

Comandos rápidos:
- Status: `make status`
- Logs backend: `make logs-backend`
- Healthcheck API: `make health`
- Testes backend: `make test-backend`
- Parar serviços: `make down`
- Limpar tudo (volumes): `make clean`

Ambiente: usando Docker/Make não precisa criar `.env` (defaults funcionam). Fora do Docker: copie `backend/env.example` para `backend/.env` e ajuste `SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS`.


## 🏗️ Visão Geral do Projeto

O Simulador Imobiliário aMORA é uma ferramenta estratégica projetada para ajudar usuários a entender as implicações financeiras da compra de um imóvel. Ele fornece cálculos detalhados de entrada, valor a financiar e necessidades de poupança, auxiliando decisões informadas sobre investimentos imobiliários.

## 🚀 Recursos

### Funcionalidade Principal
- **Cálculos de Financiamento**: Cálculo automático de todos os aspectos financeiros
- **Gestão de Usuários**: Autenticação segura e perfis de usuário
- **Histórico de Simulações**: Acompanhe e gerencie simulações anteriores
- **Atualizações em Tempo Real**: Cálculos instantâneos com atualização dinâmica do formulário
- **Design Responsivo**: Abordagem mobile-first para todos os dispositivos

## 🛠️ Pilha de Tecnologia

### Backend
- **Framework**: FastAPI (Python)
- **Banco de Dados**: PostgreSQL com SQLAlchemy ORM
- **Autenticação**: JWT com hash de senha seguro
- **Migrações**: Alembic para gerenciamento de esquema
- **Testes**: Pytest com cobertura abrangente

### Frontend
- **Framework**: React/Next.js
- **Gerenciamento de Estado**: Hooks e Context API
- **Componentes de UI**: Radix UI e Tailwind CSS

### Infraestrutura
- **Containerização**: Docker & Docker Compose
- **Banco de Dados**: PostgreSQL 15 com armazenamento persistente
- **Desenvolvimento**: Hot reload e ferramentas de desenvolvimento
- **Pronto para Produção**: Arquitetura escalável

## 📊 Análise de Negócios e Decisões Estratégicas

### Decisões de Arquitetura Técnica

#### 1. Seleção do Backend FastAPI
**Decisão**: Escolhido FastAPI em vez de Node.js para o backend
**Justificativa**:
- Apesar de ter mais experiência com Node.js, achei importante tentar implement usando FastAPI já que é a stack da empresa

#### 2. Banco de Dados PostgreSQL
**Decisão**: Selecionado PostgreSQL como banco primário
**Justificativa**:
- Conformidade ACID para cálculos financeiros
- Ótimo desempenho para consultas complexas
- Comunidade forte e suporte corporativo

#### 3. Autenticação JWT
**Decisão**: Implementada autenticação baseada em JWT
**Justificativa**:
- Autenticação stateless para melhor escalabilidade
- Sessões seguras baseadas em token
- Integração simples com frameworks frontend
- Padrão de mercado para aplicações web modernas


## 🚀 Início Rápido

### Pré-requisitos
- Docker & Docker Compose
- Git

### 1. Clonar o Repositório
```bash
git clone git@github.com:ETLopes/amr-interview.git
cd amora
```

### 2. Iniciar Todos os Serviços
```bash
make up
```

### 3. Acessar a Aplicação
- **API Backend**: http://localhost:8000
- **Documentação da API**: http://localhost:8000/docs
- **Admin do Banco**: http://localhost:5050 (pgAdmin)
- **Frontend**: http://localhost:3000

### 4. Verificar Instalação
```bash
# Verificar status dos serviços
make status

# Ver logs do backend
make logs-backend

# Testar health da API
make health
```

## 📁 Estrutura do Projeto

```
amora/
├── backend/                          # Backend FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/               # Rotas da API (auth, users, simulations)
│   │   ├── core/                     # Segurança, configurações
│   │   ├── crud/                     # Repositórios de dados (UserRepository, etc.)
│   │   ├── services/                 # Regras de negócio (SimulationService, etc.)
│   │   ├── db.py                     # Engine, sessão, Base e get_db
│   │   ├── models.py                 # Modelos SQLAlchemy
│   │   ├── schemas.py                # Schemas Pydantic
│   │   └── main.py                   # Instância FastAPI e inclusão de rotas
│   ├── alembic/                      # Migrações de banco de dados
│   ├── main.py                       # Entrada fina para uvicorn (reexporta app)
│   └── requirements.txt
├── frontend/                          # Frontend Next.js (App Router)
│   ├── app/                           # Páginas/rotas
│   ├── components/                    # Componentes reutilizáveis
│   └── services/                      # Facade e serviços de API
├── Dockerfile                         # Docker multi-stage (frontend + backend)
├── docker-compose.yml                 # Orquestração dev
├── docker-compose.prod.yml            # Orquestração prod
├── Makefile                           # Comandos de desenvolvimento
└── README.md                          # Este arquivo
```

## 🔧 Desenvolvimento

### Desenvolvimento do Backend
```bash
# Subir os serviços (backend, db, frontend)
make up

# Executar migrações
make migrate

# Acompanhar logs do backend
make logs-backend

# Acessar shell do container backend
make shell-backend
```

### Executando Testes
```bash
# Todos os testes de backend (unitários)
make test-backend

# Apenas unit tests de CRUD
make backend-crud-tests

# Apenas unit tests de simulação
make backend-sim-tests
```

### Gerenciamento do Banco de Dados
```bash
# Acessar o PostgreSQL
make shell-db

# Executar migrações
make migrate

# Criar nova migração
make migrate-create message="Descrição das mudanças"

# Reverter última migração
make migrate-rollback
```

## 🌐 Endpoints da API

### Endpoints Públicos
- `GET /` - Mensagem de boas-vindas
- `GET /health` - Verificação de saúde
- `POST /register` - Registro de usuário
- `POST /token` - Login do usuário
- `POST /calculate` - Cálculo de simulação

### Endpoints Protegidos
- `GET /users/me` - Informações do usuário atual
- `POST /simulations` - Criar simulação
- `GET /simulations` - Listar simulações do usuário
- `GET /simulations/{id}` - Detalhar simulação
- `PUT /simulations/{id}` - Atualizar simulação
- `DELETE /simulations/{id}` - Excluir simulação
- `GET /simulations/statistics` - Estatísticas do usuário

## 📊 Fórmulas de Cálculo

O simulador implementa as fórmulas especificadas nos requisitos:

- **Entrada**: `property_value × (down_payment_percentage ÷ 100)`
- **Valor a Financiar**: `property_value - down_payment_amount`
- **Total a Guardar**: `property_value × 0.15` (15% para custos adicionais)
- **Poupança Mensal**: `total_to_save ÷ (contract_years × 12)`

## 🔒 Recursos de Segurança

- **Segurança de Senhas**: Hash com Bcrypt e salt
- **Autenticação JWT**: Sessões seguras baseadas em token
- **Validação de Entrada**: Validação abrangente de dados
- **Proteção contra SQL Injection**: Consultas via ORM
- **Configuração de CORS**: Requisições cross-origin seguras

## 🚀 Implantação

### Ambiente de Desenvolvimento
```bash
make up
```

### Ambiente de Produção
```bash
# Construir imagens de produção
make prod-build

# Subir com configuração de produção
make prod-up

# Parar serviços de produção
make prod-down
```

### Variáveis de Ambiente
- `DATABASE_URL`: String de conexão do PostgreSQL
- `SECRET_KEY`: Chave de assinatura JWT
- `CORS_ORIGINS`: Origens permitidas no CORS
- `LOG_LEVEL`: Nível de log da aplicação


### Recomendações de Funcionalidades de Negócio

#### 1. Pontuação de Elegibilidade de Crédito
**Recurso**: Implementar um sistema automatizado de score de crédito
**Valor de Negócio**:
- Aumenta o engajamento com feedback imediato
- Reduz o tempo de decisão em solicitações de financiamento
- Melhora a conversão de simulação para financiamento real
- Gera leads qualificados para correspondentes/bancos

Com um score sendo dado automaticamente para o usuário ele pode já saber se é elegível para o financiamento antes mesmo de solicitar, aumentando a confiança no processo.

**Implementação**:
- Integração com bureaus de crédito (Serasa, SPC Brasil, Quod)
- Recomendações personalizadas baseadas no perfil

#### 2. Integração com Portais Imobiliários
**Recurso**: Conectar com plataformas de anúncios de imóveis
**Valor de Negócio**:
- Comparar simulações com ofertas reais do mercado
- Valorações de imóvel em tempo real
- Aumenta retenção por insights de mercado
- Gera receita por afiliados
- Possibilita recomendações de imóveis com base na simulação (Usuários buscando apartamentos com janelas amplas, por exemplo)
- Aumenta a relevância do simulador para usuários que buscam imóveis


**Implementação**:
- Integrações com APIs (VivaReal, OLX, Zap Imóveis, QuintoAndar)
- Importação automática de dados de imóveis
- Análise e relatórios de tendências de mercado

#### 3. Painel de Analytics Avançado
**Recurso**: Analytics e relatórios abrangentes
**Valor de Negócio**:
- Entender comportamento e preferências dos usuários
- Identificar tendências e oportunidades
- Otimizar funis de conversão
- Fornecer insights para estratégia
- Fornecer indicações de imóveis com base no perfil do usuário

**Implementação**:
- Acompanhamento de engajamento (tempo no site, simulações criadas)
- Análise de funil de conversão
- Framework de testes A/B
- Mecanismo de relatórios customizados

### Métricas de Sucesso e KPIs

#### 1. Métricas de Engajamento
- **Tempo no Site**: Meta: 5+ minutos por sessão
- **Simulações por Usuário**: Meta: 3+ por usuário
- **Taxa de Retorno**: Meta: X% mensal
- **Adoção de Recursos**: Meta: 50% usam recursos avançados

#### 2. Métricas de Conversão
- **Simulação → Solicitação**: Meta: 5% de conversão
- **Geração de Leads**: Meta: 100+ leads qualificados/mês
- **Retenção**: Meta: 60% em 30 dias
- **Receita por Usuário**: Meta: US$ 50+ por usuário

#### 3. Métricas de Desempenho Técnico
- **Tempo de Resposta da API**: Meta: <200 ms em média
- **Disponibilidade**: Meta: 99,9%
- **Taxa de Erros**: Meta: <0,1%
- **Satisfação do Usuário**: Meta: 4,5+ estrelas


**Construído com ❤️ para o Simulador Imobiliário aMORA**

