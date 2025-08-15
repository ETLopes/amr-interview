# aMORA Real Estate Simulator - Backend

This is the FastAPI backend for the aMORA Real Estate Simulator, providing a robust API for mortgage calculations and simulation management.

## Features

- **User Authentication**: JWT-based authentication system with secure password hashing
- **Simulation Management**: Full CRUD operations for real estate simulations
- **Mortgage Calculations**: Automatic calculation of down payment, financing amount, and savings requirements
- **Database Integration**: PostgreSQL with SQLAlchemy ORM and Alembic migrations
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Testing**: Comprehensive test suite for all endpoints
- **Docker Support**: Containerized deployment with Docker Compose

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Authentication**: JWT with Passlib
- **Testing**: Pytest with FastAPI TestClient
- **Containerization**: Docker & Docker Compose

## Project Structure

```
backend/
├── alembic/                 # Database migrations
│   ├── env.py              # Migration environment
│   ├── script.py.mako      # Migration template
│   └── versions/           # Migration files
├── models.py               # SQLAlchemy models
├── schemas.py              # Pydantic schemas
├── auth.py                 # Authentication logic
├── crud.py                 # User CRUD operations
├── simulation_service.py   # Business logic for simulations
├── database.py             # Database configuration
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── test_main.py           # Test suite
└── README.md              # This file
```

## API Endpoints

### Public Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /register` - User registration
- `POST /token` - User login
- `POST /calculate` - Calculate simulation values (no auth required)

### Protected Endpoints (require JWT token)
- `GET /users/me` - Get current user info
- `POST /simulations` - Create new simulation
- `GET /simulations` - List user simulations
- `GET /simulations/{id}` - Get specific simulation
- `PUT /simulations/{id}` - Update simulation
- `DELETE /simulations/{id}` - Delete simulation
- `GET /simulations/statistics` - Get user statistics

## Installation & Setup

### Prerequisites
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (if running locally)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amora/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the application**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Deployment

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `hashed_password`: Bcrypt hashed password
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Simulations Table
- `id`: Primary key
- `user_id`: Foreign key to users table
- `property_value`: Property purchase price
- `down_payment_percentage`: Down payment percentage
- `contract_years`: Mortgage term in years
- `down_payment_amount`: Calculated down payment amount
- `financing_amount`: Amount to be financed
- `total_to_save`: 15% of property value for additional costs
- `monthly_savings`: Monthly savings requirement
- `property_address`: Optional property address
- `property_type`: Optional property type
- `notes`: Optional user notes
- `created_at`: Simulation creation timestamp
- `updated_at`: Last update timestamp

## Calculation Formulas

The simulator uses the following formulas as specified in the requirements:

- **Down Payment Amount**: `property_value × (down_payment_percentage ÷ 100)`
- **Financing Amount**: `property_value - down_payment_amount`
- **Total to Save**: `property_value × 0.15` (15% for additional costs)
- **Monthly Savings**: `total_to_save ÷ (contract_years × 12)`

## Testing

Run the test suite:

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest test_main.py -v

# Run with coverage
pytest test_main.py --cov=. --cov-report=html
```

## API Documentation

Once the application is running, you can access:

- **Interactive API docs**: http://localhost:8000/docs
- **ReDoc documentation**: http://localhost:8000/redoc
- **OpenAPI schema**: http://localhost:8000/openapi.json

## Security Features

- **Password Hashing**: Bcrypt with salt
- **JWT Tokens**: Secure authentication with configurable expiration
- **Input Validation**: Pydantic schemas with comprehensive validation
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **CORS Configuration**: Configurable cross-origin resource sharing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/amora_db` |
| `SECRET_KEY` | JWT signing key | `your-secret-key-here-change-in-production` |
| `API_HOST` | API host binding | `0.0.0.0` |
| `API_PORT` | API port | `8000` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000,http://localhost:3001` |

## Development Guidelines

- **Code Style**: Follow PEP 8 standards
- **Type Hints**: Use type hints throughout the codebase
- **Documentation**: Document all functions and classes
- **Testing**: Write tests for new features
- **Migrations**: Use Alembic for database schema changes

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Migration Errors**
   - Run `alembic current` to check current migration
   - Use `alembic downgrade` to rollback if needed

3. **Port Already in Use**
   - Change port in `.env` or `docker-compose.yml`
   - Kill existing process using the port

### Logs

Check application logs:
```bash
# Docker
docker-compose logs backend

# Local
tail -f logs/app.log
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is part of the aMORA Real Estate Simulator assessment.
