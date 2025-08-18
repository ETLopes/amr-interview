# Backend-Frontend Integration Guide

## Overview

The aMORA Real Estate Simulator is a full-stack application with a FastAPI backend and Next.js frontend, fully integrated and working together seamlessly.

## Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (Next.js)     │                 │   (FastAPI)     │
│   Port: 3000    │                 │   Port: 8000    │
└─────────────────┘                 └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │   Port: 5432    │
                                    └─────────────────┘
```

## Services

### 1. Backend (FastAPI)
- **Port**: 8000
- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: JWT-based with OAuth2 password flow
- **API Endpoints**: RESTful API for users and simulations

### 2. Frontend (Next.js)
- **Port**: 3000
- **Framework**: Next.js 14 with React 18
- **State Management**: React Context + TanStack Query
- **UI Components**: Radix UI + Tailwind CSS
- **Authentication**: JWT token management

### 3. Database (PostgreSQL)
- **Port**: 5432
- **Container**: PostgreSQL 15 Alpine
- **Migrations**: Alembic for schema management

## Integration Points

### 1. API Communication

The frontend communicates with the backend through a centralized API client:

```typescript
// frontend/src/lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);
  
  if (token) headers.set("Authorization", `Bearer ${token}`);
  
  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  // ... error handling and response processing
}
```

### 2. Authentication Flow

1. **Login**: Frontend sends credentials to `/token` endpoint
2. **Token Storage**: JWT token stored in localStorage and memory
3. **API Calls**: Token automatically included in Authorization header
4. **Token Refresh**: Automatic logout on 401 responses

```typescript
// frontend/src/lib/auth.ts
export async function login(payload: { username: string; password: string }) {
  const body = new URLSearchParams();
  body.set("username", payload.username);
  body.set("password", payload.password);
  
  const response = await apiFetch<{ access_token: string; token_type: string }>(
    "/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );
  
  setToken(response.access_token);
  return response;
}
```

### 3. Data Synchronization

The frontend uses React Query for efficient data fetching and caching:

```typescript
// frontend/src/contexts/AuthContext.tsx
const simsQuery = useQuery({
  queryKey: ["simulations"],
  queryFn: async () => {
    const list = await apiListSimulations();
    return list.simulations;
  },
  enabled: !!getToken(),
});
```

### 4. Real-time Status Monitoring

The frontend includes a `BackendStatus` component that continuously monitors backend connectivity:

```typescript
// frontend/src/components/BackendStatus.tsx
useEffect(() => {
  const checkConnection = async () => {
    const connected = await testBackendConnection();
    setIsConnected(connected);
  };
  
  checkConnection();
  const interval = setInterval(checkConnection, 30000);
  return () => clearInterval(interval);
}, []);
```

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /token` - User login (OAuth2 form data)

### Users
- `GET /users/me` - Get current user info
- `PATCH /users/me` - Update current user

### Simulations
- `POST /simulations` - Create new simulation
- `GET /simulations` - List user simulations
- `GET /simulations/{id}` - Get specific simulation
- `PUT /simulations/{id}` - Update simulation
- `DELETE /simulations/{id}` - Delete simulation
- `GET /simulations/statistics` - Get user statistics
- `POST /calculate` - Calculate without saving

## Data Models

### Frontend Types
```typescript
export type Simulation = {
  id: string;
  nome: string;
  valorImovel: number;
  percentualEntrada: number;
  anosContrato: number;
  valorEntrada: number;
  valorFinanciar: number;
  totalGuardar: number;
  valorMensalPoupanca: number;
  dataCriacao: string;
};
```

### Backend Schemas
```python
class Simulation(BaseModel):
    property_value: float
    down_payment_percentage: float
    contract_years: int
    property_address: Optional[str] = None
    property_type: Optional[str] = None
    notes: Optional[str] = None
    # ... calculated fields
```

### Data Mapping
The frontend maps backend data to UI-friendly format:

```typescript
function mapApiToUi(sim: ApiSimulation): Simulation {
  return {
    id: String(sim.id),
    nome: sim.property_type ? `${sim.property_type}` : `Simulação #${sim.id}`,
    valorImovel: sim.property_value,
    percentualEntrada: sim.down_payment_percentage,
    // ... other mappings
  };
}
```

## Docker Integration

All services are containerized and networked together:

```yaml
# docker-compose.yml
services:
  backend:
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/amora_db
      - CORS_ORIGINS=http://localhost:3000,http://localhost:3001
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://backend:8000
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_started
```

## Environment Configuration

### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/amora_db
SECRET_KEY=your-super-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Development Workflow

### 1. Start Services
```bash
docker compose up -d
```

### 2. Backend Development
- Backend auto-reloads on file changes
- Database migrations run automatically
- API documentation available at `/docs`

### 3. Frontend Development
- Hot reload enabled with Turbopack
- API calls automatically routed to backend
- Real-time backend status monitoring

### 4. Testing Integration
```bash
# Test backend health
curl http://localhost:8000/health

# Test calculation endpoint
curl -X POST http://localhost:8000/calculate \
  -H "Content-Type: application/json" \
  -d '{"property_value": 500000, "down_payment_percentage": 20, "contract_years": 25}'

# Test frontend
curl http://localhost:3000
```

## Error Handling

### Network Errors
- Automatic retry logic in API client
- User-friendly error messages
- Graceful degradation when backend is unavailable

### Authentication Errors
- Automatic logout on 401 responses
- Token validation and cleanup
- Redirect to login page

### Data Validation
- Frontend form validation
- Backend schema validation with Pydantic
- Consistent error response format

## Security Features

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### JWT Authentication
- Secure token storage
- Automatic token expiration
- Protected API endpoints

### Input Validation
- Pydantic schemas for all inputs
- SQL injection protection via SQLAlchemy
- XSS protection via React

## Performance Optimizations

### Frontend
- React Query for efficient data caching
- Optimistic updates for better UX
- Lazy loading of components

### Backend
- Database connection pooling
- Efficient SQL queries with SQLAlchemy
- Response caching where appropriate

## Monitoring and Debugging

### Backend Logs
```bash
docker compose logs backend
```

### Frontend Logs
```bash
docker compose logs frontend
```

### Database Access
```bash
# pgAdmin available at http://localhost:5050
# Direct database access
docker compose exec postgres psql -U postgres -d amora_db
```

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if backend container is running
   - Verify CORS configuration
   - Check network connectivity

2. **Authentication Errors**
   - Verify JWT token format
   - Check token expiration
   - Ensure proper Authorization header

3. **Database Connection Issues**
   - Verify PostgreSQL container health
   - Check database credentials
   - Run database migrations

### Debug Commands
```bash
# Check service status
docker compose ps

# View logs
docker compose logs [service_name]

# Restart services
docker compose restart [service_name]

# Rebuild and restart
docker compose up -d --build
```

## Production Considerations

### Environment Variables
- Use strong SECRET_KEY in production
- Configure proper CORS origins
- Set up production database

### Security
- Enable HTTPS
- Implement rate limiting
- Add request logging
- Set up monitoring

### Scaling
- Use production-grade database
- Implement caching layer
- Add load balancing
- Set up CI/CD pipeline

## Conclusion

The backend and frontend are fully integrated with:
- ✅ Real-time communication
- ✅ Secure authentication
- ✅ Efficient data synchronization
- ✅ Comprehensive error handling
- ✅ Development-friendly setup
- ✅ Production-ready architecture

The integration provides a seamless user experience while maintaining clean separation of concerns and robust error handling.
