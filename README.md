# aMORA Real Estate Simulator

A comprehensive full-stack application for simulating real estate purchases with mortgage calculations, built with modern technologies and best practices.

## 🏗️ Project Overview

The aMORA Real Estate Simulator is a strategic tool designed to help users understand the financial implications of purchasing real estate. It provides detailed calculations for down payments, financing amounts, and savings requirements, helping users make informed decisions about their real estate investments.

## 🚀 Features

### Core Functionality
- **Mortgage Calculations**: Automatic computation of all financial aspects
- **User Management**: Secure authentication and user profiles
- **Simulation History**: Track and manage all previous simulations
- **Real-time Updates**: Instant calculations with live form updates
- **Responsive Design**: Mobile-first approach for all devices

### Business Intelligence
- **User Analytics**: Track engagement and usage patterns
- **Simulation Statistics**: Aggregate data for business insights
- **Export Capabilities**: Download simulation reports
- **Performance Metrics**: Monitor system usage and user behavior

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with secure password hashing
- **Migrations**: Alembic for database schema management
- **Testing**: Pytest with comprehensive test coverage

### Frontend (Coming Soon)
- **Framework**: React/Next.js
- **Styling**: Modern CSS with responsive design
- **State Management**: React hooks and context
- **UI Components**: Custom component library

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15 with persistent storage
- **Development**: Hot reload and development tools
- **Production Ready**: Scalable architecture design

## 📊 Business Analysis & Strategic Decisions

### Technical Architecture Decisions

#### 1. FastAPI Backend Selection
**Decision**: Chose FastAPI over Node.js for the backend
**Rationale**: 
- Superior performance and automatic API documentation
- Native async/await support for better scalability
- Built-in data validation with Pydantic
- Excellent developer experience and rapid development
- Strong typing system reduces runtime errors

#### 2. PostgreSQL Database
**Decision**: Selected PostgreSQL as the primary database
**Rationale**:
- ACID compliance for financial calculations
- Advanced JSON support for flexible data storage
- Excellent performance for complex queries
- Strong community and enterprise support
- Built-in full-text search capabilities

#### 3. JWT Authentication
**Decision**: Implemented JWT-based authentication
**Rationale**:
- Stateless authentication for better scalability
- Secure token-based sessions
- Easy integration with frontend frameworks
- Industry standard for modern web applications

### Business Feature Recommendations

#### 1. Credit Eligibility Scoring
**Feature**: Implement an automated credit scoring system
**Business Value**:
- Increase user engagement by providing immediate feedback
- Reduce time-to-decision for mortgage applications
- Improve conversion rates from simulation to actual mortgage
- Generate qualified leads for mortgage brokers

**Implementation**: 
- Integrate with credit bureau APIs (Equifax, TransUnion)
- Use machine learning models for score prediction
- Provide personalized recommendations based on credit profile

#### 2. Real Estate Portal Integration
**Feature**: Connect with property listing platforms
**Business Value**:
- Compare simulations with actual market offerings
- Provide real-time property valuations
- Increase user retention through market insights
- Generate affiliate revenue from property referrals

**Implementation**:
- API integrations with Zillow, Realtor.com, Redfin
- Automated property data import
- Market trend analysis and reporting

#### 3. Advanced Analytics Dashboard
**Feature**: Comprehensive user analytics and reporting
**Business Value**:
- Understand user behavior and preferences
- Identify market trends and opportunities
- Optimize conversion funnels
- Provide insights for business strategy

**Implementation**:
- User engagement tracking (time on site, simulations created)
- Conversion funnel analysis
- A/B testing framework
- Custom reporting engine

#### 4. Export and Reporting System
**Feature**: PDF/Excel export of simulation reports
**Business Value**:
- Professional presentation for mortgage applications
- User retention through valuable document generation
- Potential premium feature for advanced users
- Integration with financial planning tools

**Implementation**:
- PDF generation with professional templates
- Excel export with formulas and charts
- Email delivery system
- Cloud storage integration

### Success Metrics & KPIs

#### 1. User Engagement Metrics
- **Time on Site**: Target: 5+ minutes per session
- **Simulations per User**: Target: 3+ simulations per user
- **Return User Rate**: Target: 40% monthly return rate
- **Feature Adoption**: Target: 70% of users try advanced features

#### 2. Business Conversion Metrics
- **Simulation to Application Rate**: Target: 15% conversion
- **Lead Generation**: Target: 100+ qualified leads per month
- **User Retention**: Target: 60% 30-day retention
- **Revenue per User**: Target: $50+ average revenue per user

#### 3. Technical Performance Metrics
- **API Response Time**: Target: <200ms average response time
- **System Uptime**: Target: 99.9% availability
- **Error Rate**: Target: <0.1% error rate
- **User Satisfaction**: Target: 4.5+ star rating

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd amora
```

### 2. Start All Services
```bash
docker-compose up -d
```

### 3. Access the Application
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database Admin**: http://localhost:5050 (pgAdmin)
- **Frontend**: Coming Soon

### 4. Verify Installation
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend

# Test API health
curl http://localhost:8000/health
```

## 📁 Project Structure

```
amora/
├── backend/                 # FastAPI backend
│   ├── alembic/            # Database migrations
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── auth.py             # Authentication logic
│   ├── main.py             # FastAPI application
│   └── README.md           # Backend documentation
├── frontend/               # React frontend (coming soon)
├── docker-compose.yml      # Service orchestration
├── GUIDELINES.md           # Project requirements
└── README.md               # This file
```

## 🔧 Development

### Backend Development
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload
```

### Running Tests
```bash
cd backend
pytest test_main.py -v
```

### Database Management
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d amora_db

# Run migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "Description"
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /register` - User registration
- `POST /token` - User login
- `POST /calculate` - Calculate simulation values

### Protected Endpoints
- `GET /users/me` - Current user info
- `POST /simulations` - Create simulation
- `GET /simulations` - List user simulations
- `GET /simulations/{id}` - Get specific simulation
- `PUT /simulations/{id}` - Update simulation
- `DELETE /simulations/{id}` - Delete simulation
- `GET /simulations/statistics` - User statistics

## 📊 Calculation Formulas

The simulator implements the exact formulas specified in the requirements:

- **Down Payment**: `property_value × (down_payment_percentage ÷ 100)`
- **Financing Amount**: `property_value - down_payment_amount`
- **Total to Save**: `property_value × 0.15` (15% for additional costs)
- **Monthly Savings**: `total_to_save ÷ (contract_years × 12)`

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with salt
- **JWT Authentication**: Secure token-based sessions
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: ORM-based queries
- **CORS Configuration**: Secure cross-origin requests

## 📈 Scalability Considerations

### Database Scaling
- **Read Replicas**: Implement PostgreSQL read replicas for heavy read loads
- **Connection Pooling**: Use PgBouncer for connection management
- **Sharding**: Horizontal partitioning for large datasets

### Application Scaling
- **Load Balancing**: Nginx reverse proxy with multiple backend instances
- **Caching**: Redis for session storage and API response caching
- **Microservices**: Break down into domain-specific services

### Infrastructure Scaling
- **Container Orchestration**: Kubernetes for production deployment
- **Auto-scaling**: Cloud-based auto-scaling groups
- **CDN**: Content delivery network for static assets

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Individual function and class testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing

### Testing Tools
- **Pytest**: Python testing framework
- **FastAPI TestClient**: HTTP client for testing
- **Coverage.py**: Code coverage analysis
- **Locust**: Load testing framework

## 🚀 Deployment

### Development Environment
```bash
docker-compose up -d
```

### Production Environment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key
- `CORS_ORIGINS`: Allowed CORS origins
- `LOG_LEVEL`: Application logging level

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is part of the aMORA Real Estate Simulator assessment.

## 📞 Support

For questions or support, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ for aMORA Real Estate Simulator**
