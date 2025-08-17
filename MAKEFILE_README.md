# aMORA Real Estate Simulator - Makefile Guide

This Makefile provides convenient commands for developing, testing, and managing the aMORA Real Estate Simulator project.

## 🚀 Quick Start

### **1. View All Available Commands**
```bash
make help
```

### **2. Start Development Environment**
```bash
make dev-setup
```
This will build, start, and migrate the database in one command.

### **3. Start Services**
```bash
make up
```

### **4. Stop Services**
```bash
make down
```

## 🧪 Testing Commands

### **Run All Tests (Recommended)**
```bash
make test
```
This runs both simple tests and FastAPI tests successfully! 🎉

### **Run All Test Suites**
```bash
make test-all
```
Runs both simple tests and FastAPI tests (all working now).

### **Run Backend Tests**
```bash
make test-backend
```
Runs all backend tests successfully.

### **Run Simple Backend Tests**
```bash
make test-simple
```
Runs the simple test suite that covers:
- Module imports
- Calculation formulas
- Schema validation
- Email validation

### **Run FastAPI TestClient Tests**
```bash
make test-main
```
✅ **Now working!** Runs FastAPI HTTP endpoint tests.

### **Test API Endpoints**
```bash
make test-api
```
Tests actual API endpoints using curl (integration testing).

### **Testing Strategy**

The project now has a comprehensive testing approach:

1. **Simple Tests (`test_simple.py`)** ✅ **WORKING**
   - Reliable and always work
   - Test core functionality
   - No external dependencies
   - Fast execution

2. **FastAPI Tests (`test_main.py`)** ✅ **WORKING**
   - Use FastAPI TestClient
   - Test HTTP endpoints
   - All compatibility issues resolved
   - Comprehensive coverage

**For daily development, use `make test` to run all tests!**

## 🔧 Development Commands

### **Build Containers**
```bash
make build
```

### **Restart Services**
```bash
make restart
```

### **View Logs**
```bash
make logs              # All services
make logs-backend      # Backend only
make logs-db           # Database only
```

### **Code Quality**
```bash
make format            # Format code with black
make lint              # Run linting checks
```

## 🗄️ Database Commands

### **Run Migrations**
```bash
make migrate
```

### **Create New Migration**
```bash
make migrate-create message="Description of changes"
```

### **Rollback Migration**
```bash
make migrate-rollback
```

### **Reset Database (WARNING: Deletes all data)**
```bash
make reset-db
```

## 🐳 Container Access

### **Backend Shell**
```bash
make shell-backend
```

### **Database Shell**
```bash
make shell-db
```

### **pgAdmin Shell**
```bash
make shell-pgadmin
```

## 📊 Monitoring & Status

### **Service Status**
```bash
make status
```

### **Health Check**
```bash
make health
```

### **Environment Information**
```bash
make info
```

### **Resource Monitoring**
```bash
make monitor
```

## 🗂️ Backup & Restore

### **Create Database Backup**
```bash
make backup-db
```
Backups are saved to the `backups/` directory.

### **Restore Database**
```bash
make restore-db file=backups/backup_YYYYMMDD_HHMMSS.sql
```

## 🧹 Maintenance Commands

### **Clean Up Docker Resources**
```bash
make clean
```

### **Install Dependencies**
```bash
make install-deps
```

### **Open API Documentation**
```bash
make api-docs
```

## 🔄 Development Workflows

### **Complete Development Setup**
```bash
make dev-setup
```
- Builds containers
- Starts services
- Runs migrations
- Shows endpoint information

### **Development Mode**
```bash
make dev
```
- Starts services
- Provides development tips

### **Clean Restart**
```bash
make dev-restart
```
- Stops services
- Cleans up resources
- Starts fresh
- Runs migrations

## 📋 Common Use Cases

### **Daily Development Workflow**
```bash
# Start your day
make up

# Run tests
make test-backend

# Check logs if needed
make logs-backend

# Format code
make format

# Stop at end of day
make down
```

### **Code Changes Workflow**
```bash
# After making code changes
make format
make lint
make test-backend
make restart
```

### **Database Schema Changes**
```bash
# After modifying models
make migrate-create message="Add new field to user table"
make migrate
```

### **Troubleshooting**
```bash
# Check service status
make status

# View logs
make logs

# Check API health
make health

# Restart if needed
make restart
```

## 🚨 Important Notes

### **Database Reset Warning**
The `make reset-db` command will **delete all data** in the database. Use with caution!

### **Production Commands**
Production commands are prefixed with `prod-`:
- `make prod-build`
- `make prod-up`
- `make prod-down`

### **Dependencies**
Some commands require specific tools:
- `jq` for JSON formatting in health checks
- `open` (macOS) or `xdg-open` (Linux) for opening API docs

## 🆘 Getting Help

### **View All Commands**
```bash
make help
```

### **Check Environment**
```bash
make info
```

### **Service Status**
```bash
make status
```

## 🔧 Customization

You can customize the Makefile by:
1. Adding new commands
2. Modifying existing commands
3. Adding environment-specific variables
4. Creating new workflows

## 📚 Related Documentation

- [Backend README](backend/README.md) - Backend-specific documentation
- [Main README](README.md) - Project overview and setup
- [Docker Compose](docker-compose.yml) - Service configuration

---

**Happy coding with aMORA! 🏠✨**
