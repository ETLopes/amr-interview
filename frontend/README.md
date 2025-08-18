# aMORA - Simulador Imobiliário

Sistema de simulação estratégica de compra de imóveis desenvolvido com Next.js, React e TypeScript.

## 🏠 Sobre o Projeto

O aMORA é um simulador completo que ajuda usuários a planejar a compra de imóveis, calculando:

- Valor de entrada necessário
- Valor a ser financiado
- Total a guardar (15% do valor do imóvel)
- Valor mensal de poupança
- Score de elegibilidade para crédito imobiliário
- Importação automática de anúncios de portais imobiliários

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Framework de estilização
- **Shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **Sonner** - Notificações toast

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18.0 ou superior
- npm, yarn ou pnpm

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd amora-real-estate-simulator
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Edite o arquivo `.env.local` com suas configurações:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://localhost:8000
```

### Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

**Modo Demo/Offline:**
Se a API não estiver disponível, o aplicativo automaticamente entrará em modo demo, permitindo testar todas as funcionalidades localmente com dados mock.

### Build para Produção

```bash
npm run build
npm run start
```

## 📁 Estrutura do Projeto

```
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes de interface (shadcn/ui)
│   ├── figma/            # Componentes específicos do Figma
│   ├── AppContent.tsx    # Conteúdo principal da aplicação
│   ├── Dashboard.tsx     # Dashboard com estatísticas
│   ├── LoginForm.tsx     # Formulário de login/registro
│   ├── MainApp.tsx       # Aplicação principal
│   ├── SimulationForm.tsx # Formulário de simulação
│   └── ...
├── contexts/             # Contextos React
│   └── AuthContext.tsx   # Contexto de autenticação
├── services/             # Serviços e APIs
│   └── api.ts           # Serviço de API
├── config/              # Configurações
│   └── api.ts          # Configuração da API
├── styles/             # Estilos globais
│   └── globals.css     # CSS global com Tailwind
└── ...
```

## 🔧 Funcionalidades

### ✅ Implementadas

- Sistema de autenticação (online/offline)
- CRUD completo de simulações
- Dashboard com estatísticas
- Cálculos automáticos de financiamento
- Score de elegibilidade para crédito
- Importador de anúncios (modo beta)
- Interface responsiva
- Modo demo/offline
- Sistema de notificações

### 🚧 Planejadas

- Backend com FastAPI
- Banco de dados PostgreSQL
- Autenticação JWT
- Sincronização com APIs de bancos
- Integração com portais imobiliários
- Relatórios em PDF
- Notificações push

## 🔌 API e Backend

O projeto inclui um sistema de fallback offline que permite usar todas as funcionalidades sem backend. Para produção, configure:

1. **FastAPI Backend**: API REST com PostgreSQL
2. **Variáveis de ambiente**: Configure `NEXT_PUBLIC_API_URL`
3. **Autenticação**: Sistema JWT com refresh tokens

## 🎨 Design System

O projeto utiliza um design system customizado baseado em:

- **Tailwind CSS v4** com tokens CSS customizados
- **Componentes Shadcn/ui** adaptados
- **Typography System** responsivo
- **Color Palette** com suporte a tema escuro
- **Spacing e Layout** consistentes

## 📱 Responsividade

A aplicação é totalmente responsiva com:

- Layout adaptativo para mobile/desktop
- Navegação otimizada para touch
- Componentes que se ajustam ao tamanho da tela
- Performance otimizada para dispositivos móveis

## 🔒 Segurança

- Headers de segurança configurados
- Validação de dados no frontend
- Sanitização de inputs
- Proteção contra XSS
- CSP (Content Security Policy) configurado

## 📊 Performance

- Server-side rendering (SSR) quando apropriado
- Client-side rendering para interatividade
- Lazy loading de componentes
- Otimização de imagens automática
- Minificação e compressão

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:

- 📧 Email: suporte@amora.com
- 📱 WhatsApp: (11) 9999-9999
- 🌐 Website: https://amora.com

---

Desenvolvido com ❤️ pela equipe aMORA