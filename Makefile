# aMORA Real Estate Simulator - Makefile
# Provides convenient commands for development, testing, and deployment

.PHONY: help build up down restart logs clean test test-backend test-frontend lint format migrate migrate-create migrate-rollback shell-backend shell-db shell-pgadmin install-deps install-backend-deps install-frontend-deps

# Default target
help:
	@echo "aMORA Real Estate Simulator - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  build          - Build all Docker containers"
	@echo "  up             - Start all services in background"
	@echo "  down           - Stop and remove all services"
	@echo "  restart        - Restart all services"
	@echo "  logs           - Show logs from all services"
	@echo "  logs-backend   - Show backend logs"
	@echo "  logs-db        - Show database logs"
	@echo "  clean          - Remove all containers, networks, and volumes"
	@echo ""
	@echo "Testing:"
	@echo "  test           - Run all tests (simple + FastAPI tests)"
	@echo "  test-all       - Run all test suites"
	@echo "  test-backend   - Run all backend tests"
	@echo "  test-simple    - Run simple backend tests"
	@echo "  test-main      - Run FastAPI TestClient tests"
	@echo "  test-frontend  - Run frontend tests (when available)"
	@echo "  test-api       - Test API endpoints with curl"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint           - Run linting checks"
	@echo "  format         - Format code with black"
	@echo ""
	@echo "Database:"
	@echo "  migrate        - Run database migrations"
	@echo "  migrate-create - Create new migration"
	@echo "  migrate-rollback - Rollback last migration"
	@echo ""
	@echo "Shell Access:"
	@echo "  shell-backend  - Access backend container shell"
	@echo "  shell-db       - Access database shell"
	@echo "  shell-pgadmin  - Access pgAdmin container shell"
	@echo ""
	@echo "Dependencies:"
	@echo "  install-deps   - Install all dependencies"
	@echo "  install-backend-deps - Install backend dependencies"
	@echo "  install-frontend-deps - Install frontend dependencies (when available)"
	@echo ""
	@echo "Utilities:"
	@echo "  status         - Show service status"
	@echo "  health         - Check API health"
	@echo "  api-docs       - Open API documentation in browser"

# Development Commands
build:
	@echo "Building Docker containers..."
	docker compose build

up:
	@echo "Starting services..."
	docker compose up -d

down:
	@echo "Stopping services..."
	docker compose down

restart:
	@echo "Restarting services..."
	docker compose restart

logs:
	@echo "Showing logs from all services..."
	docker compose logs -f

logs-backend:
	@echo "Showing backend logs..."
	docker compose logs -f backend

logs-db:
	@echo "Showing database logs..."
	docker compose logs -f postgres

clean:
	@echo "Cleaning up Docker resources..."
	docker compose down -v --remove-orphans
	docker system prune -f

# Testing Commands
test: test-all
	@echo "All tests completed successfully! 🎉"

test-all: test-simple test-main
	@echo "All test suites completed successfully! 🎉"

test-backend: test-simple test-main
	@echo "All backend tests completed successfully! 🎉"

test-simple:
	@echo "Running simple backend tests..."
	docker compose exec backend python test_simple.py

test-main:
	@echo "Running FastAPI TestClient tests..."
	docker compose exec backend python -m pytest test_main.py -v

test-frontend:
	@echo "Frontend tests not yet implemented"
	@echo "Will be available when frontend is created"

# Code Quality Commands
lint:
	@echo "Running linting checks..."
	docker compose exec backend python -m flake8 . --max-line-length=88 --extend-ignore=E203,W503

format:
	@echo "Formatting code with black..."
	docker compose exec backend python -m black . --line-length=88

# Database Commands
migrate:
	@echo "Running database migrations..."
	docker compose exec backend alembic upgrade head

migrate-create:
	@if [ -z "$(message)" ]; then \
		echo "Usage: make migrate-create message=\"Description of changes\""; \
		exit 1; \
	fi
	@echo "Creating new migration: $(message)"
	docker compose exec backend alembic revision --autogenerate -m "$(message)"

migrate-rollback:
	@echo "Rolling back last migration..."
	docker compose exec backend alembic downgrade -1

# Shell Access Commands
shell-backend:
	@echo "Accessing backend container shell..."
	docker compose exec backend sh

shell-db:
	@echo "Accessing database shell..."
	docker compose exec postgres psql -U postgres -d amora_db

shell-pgadmin:
	@echo "Accessing pgAdmin container shell..."
	docker compose exec pgadmin sh

# Dependency Installation Commands
install-deps: install-backend-deps
	@echo "All dependencies installed!"

install-backend-deps:
	@echo "Installing backend dependencies..."
	docker compose exec backend pip install -r requirements.txt

install-frontend-deps:
	@echo "Frontend dependencies not yet implemented"
	@echo "Will be available when frontend is created"

# Utility Commands
status:
	@echo "Service status:"
	docker compose ps

health:
	@echo "Checking API health..."
	@curl -s http://localhost:8000/health | jq . || curl -s http://localhost:8000/health

api-docs:
	@echo "Opening API documentation..."
	@if command -v open >/dev/null 2>&1; then \
		open http://localhost:8000/docs; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open http://localhost:8000/docs; \
	else \
		echo "Please open http://localhost:8000/docs in your browser"; \
	fi

# Quick Development Setup
dev-setup: build up migrate
	@echo "Development environment setup complete!"
	@echo "Services are running at:"
	@echo "  - Backend API: http://localhost:8000"
	@echo "  - API Docs: http://localhost:8000/docs"
	@echo "  - Database: localhost:5432"
	@echo "  - pgAdmin: http://localhost:5050"

# Production-like Commands
prod-build:
	@echo "Building production images..."
	docker compose -f docker-compose.prod.yml build

prod-up:
	@echo "Starting production services..."
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	@echo "Stopping production services..."
	docker compose -f docker-compose.prod.yml down

# Monitoring Commands
monitor:
	@echo "Monitoring service resources..."
	docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

# Backup and Restore Commands
backup-db:
	@echo "Creating database backup..."
	@mkdir -p backups
	docker compose exec postgres pg_dump -U postgres amora_db > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db:
	@if [ -z "$(file)" ]; then \
		echo "Usage: make restore-db file=backups/backup_YYYYMMDD_HHMMSS.sql"; \
		exit 1; \
	fi
	@echo "Restoring database from $(file)..."
	docker compose exec -T postgres psql -U postgres -d amora_db < $(file)

# Development Helpers
reset-db:
	@echo "Resetting database (WARNING: This will delete all data!)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v; \
		docker compose up -d postgres; \
		sleep 10; \
		docker compose up -d backend; \
		echo "Database reset complete!"; \
	else \
		echo "Database reset cancelled."; \
	fi

# Quick Test Commands
test-api:
	@echo "Testing API endpoints..."
	@echo "Health check:"
	@curl -s http://localhost:8000/health | jq . || curl -s http://localhost:8000/health
	@echo ""
	@echo "Root endpoint:"
	@curl -s http://localhost:8000/ | jq . || curl -s http://localhost:8000/
	@echo ""
	@echo "Calculation test:"
	@curl -s -X POST "http://localhost:8000/calculate" \
		-H "Content-Type: application/json" \
		-d '{"property_value": 500000, "down_payment_percentage": 20, "contract_years": 30}' | jq . || \
	curl -s -X POST "http://localhost:8000/calculate" \
		-H "Content-Type: application/json" \
		-d '{"property_value": 500000, "down_payment_percentage": 20, "contract_years": 30}'

# Development Workflow
dev: up
	@echo "Development environment started!"
	@echo "Use 'make logs-backend' to monitor backend logs"
	@echo "Use 'make test-backend' to run tests"
	@echo "Use 'make shell-backend' to access backend shell"

# Clean Development Restart
dev-restart: down clean up migrate
	@echo "Development environment restarted with clean state!"

# Show current environment info
info:
	@echo "aMORA Real Estate Simulator - Environment Information"
	@echo "=================================================="
	@echo "Project Directory: $(PWD)"
	@echo "Docker Compose Version: $(shell docker compose version --short)"
	@echo "Docker Version: $(shell docker version --format '{{.Server.Version}}')"
	@echo ""
	@echo "Service Status:"
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "Available Endpoints:"
	@echo "  - Backend API: http://localhost:8000"
	@echo "  - API Documentation: http://localhost:8000/docs"
	@echo "  - Database: localhost:5432"
	@echo "  - pgAdmin: http://localhost:5050"
