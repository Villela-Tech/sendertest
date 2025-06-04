# WhaTicket SaaS - Sistema de Atendimento WhatsApp

## 📁 Estrutura do Projeto

```
├── backend/                  # Servidor Node.js
│   ├── src/
│   │   ├── @types/          # Definições de tipos TypeScript
│   │   ├── config/          # Configurações do sistema
│   │   ├── controllers/     # Controladores da aplicação
│   │   ├── database/        # Migrações e configurações do banco
│   │   ├── errors/         # Tratamento de erros customizados
│   │   ├── helpers/        # Funções auxiliares
│   │   ├── libs/           # Bibliotecas personalizadas
│   │   ├── middleware/     # Middlewares Express
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócios
│   │   └── utils/          # Utilitários gerais
│   └── package.json
│
├── frontend/                # Cliente React.js
│   ├── src/
│   │   ├── assets/         # Recursos estáticos
│   │   ├── components/     # Componentes React
│   │   ├── context/        # Contextos React
│   │   ├── errors/         # Tratamento de erros
│   │   ├── helpers/        # Funções auxiliares
│   │   ├── hooks/          # Hooks React customizados
│   │   ├── layout/         # Componentes de layout
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── routes/         # Configuração de rotas
│   │   ├── services/       # Serviços e APIs
│   │   └── utils/          # Utilitários
│   └── package.json
```

## 🔧 Componentes Principais

### Backend

#### 1. Estrutura de Dados
- **Modelos**:
  - User (Usuários)
  - Queue (Filas)
  - Ticket (Atendimentos)
  - Contact (Contatos)
  - Message (Mensagens)
  - Whatsapp (Conexões)
  - Queue (Filas de Atendimento)

#### 2. APIs e Endpoints
- **/auth**
  - POST /login
  - POST /refresh-token
  - POST /logout

- **/messages**
  - GET /messages/:ticketId
  - POST /messages/:ticketId
  - DELETE /messages/:messageId

- **/tickets**
  - GET /tickets
  - GET /tickets/:ticketId
  - POST /tickets
  - PUT /tickets/:ticketId
  - DELETE /tickets/:ticketId

- **/whatsapp**
  - GET /whatsapp
  - POST /whatsapp
  - PUT /whatsapp/:whatsappId
  - DELETE /whatsapp/:whatsappId
  - POST /whatsapp/:whatsappId/qrcode
  - POST /whatsapp/:whatsappId/restart

#### 3. Serviços
- **WhatsappService**: Gerenciamento de conexões WhatsApp
- **WbotServices**: Integração com WhatsApp Web
- **TicketService**: Gerenciamento de tickets
- **MessageService**: Processamento de mensagens
- **QueueService**: Gerenciamento de filas
- **CacheService**: Gerenciamento de cache

### Frontend

#### 1. Páginas Principais
- Login
- Dashboard
- Tickets (Lista e Detalhes)
- Contatos
- Filas
- Configurações
- Relatórios
- Kanban

#### 2. Componentes Principais
- TicketsList
- TicketInfo
- MessagesList
- ContactDrawer
- QueueSelect
- WhatsAppModal
- Dashboard
- QuickAnswers
- TagsContainer

#### 3. Contextos
- Auth
- WhatsApp
- Tickets
- Notifications

## ⚙️ Configurações Técnicas

### Backend

```env
NODE_ENV=development
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
PORT=8080

DB_DIALECT=postgres
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=whaticket

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

REDIS_URI=redis://localhost:6379
REDIS_OPT_LIMITER_MAX=1
REDIS_OPT_LIMITER_DURATION=3000

USER_LIMIT=3
CONNECTIONS_LIMIT=1
```

### Frontend

```env
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_HOURS_CLOSE_TICKETS_AUTO=24
REACT_APP_PAGE_LIMIT=20
```

## 🔄 Fluxo de Dados

1. **Recebimento de Mensagem**
   ```
   WhatsApp → Webhook → Backend → Redis Queue → Frontend (Socket.io)
   ```

2. **Envio de Mensagem**
   ```
   Frontend → Backend API → WhatsApp Service → WhatsApp
   ```

3. **Gestão de Tickets**
   ```
   Mensagem → Ticket Service → Queue Service → Socket.io → Frontend
   ```

## 🛠️ Recursos Técnicos

### Backend
- Node.js 20.x
- TypeScript
- Express
- Sequelize ORM
- Socket.IO
- Bull (Redis Queue)
- @whiskeysockets/baileys
- JWT Authentication
- Yup Validation
- Multer (Upload)
- Winston (Logs)

### Frontend
- React 17+
- Material-UI
- Socket.IO Client
- Axios
- React Context API
- React Hooks
- Formik
- Yup Validation
- date-fns
- React-toastify

## 📦 Integrações

### 1. DialogFlow
- Configuração via API
- Processamento de intenções
- Respostas automáticas

### 2. N8N
- Webhooks personalizados
- Automação de fluxos
- Integração com APIs externas

### 3. ChatGPT
- Processamento de linguagem natural
- Respostas automáticas
- Análise de sentimento

### 4. TypeBot
- Fluxos de conversação
- Coleta de dados
- Automação de respostas

## 🔒 Segurança

### 1. Autenticação
- JWT Token
- Refresh Token
- Bcrypt para senhas
- Rate Limiting

### 2. Permissões
- ACL (Access Control List)
- Roles (admin, user)
- Queue permissions

### 3. Proteção
- Helmet
- CORS
- Rate Limit
- SQL Injection Protection
- XSS Protection

## 📊 Monitoramento

- Winston Logs
- Sentry Integration
- Performance Metrics
- Queue Monitoring
- Connection Status

## 🚀 Escalabilidade

- Redis Cache
- Queue Processing
- Load Balancing Ready
- Horizontal Scaling
- Database Indexing

---

💡 **Nota**: Esta documentação é um guia técnico detalhado. Para informações de uso, consulte o manual do usuário. 