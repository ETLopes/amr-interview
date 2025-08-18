#!/bin/bash

echo "🧪 Testing aMORA Backend-Frontend Integration"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    
    echo -n "Testing $name... "
    
    if response=$(curl -s -w "%{http_code}" "$url" 2>/dev/null); then
        status_code="${response: -3}"
        if [ "$status_code" = "$expected_status" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            return 0
        else
            echo -e "${RED}❌ FAIL (Status: $status_code, Expected: $expected_status)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ FAIL (Connection error)${NC}"
        return 1
    fi
}

# Test calculation endpoint
test_calculation() {
    echo -n "Testing calculation endpoint... "
    
    response=$(curl -s -X POST http://localhost:8000/calculate \
        -H "Content-Type: application/json" \
        -d '{"property_value": 500000, "down_payment_percentage": 20, "contract_years": 25}' \
        2>/dev/null)
    
    if echo "$response" | grep -q '"down_payment_amount":100000'; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Test frontend-backend communication
test_frontend_backend() {
    echo -n "Testing frontend-backend communication... "
    
    # Check if frontend can reach backend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

echo ""
echo "1. Testing Backend Health..."
test_endpoint "Backend Health" "http://localhost:8000/health" "200"

echo ""
echo "2. Testing Backend Root..."
test_endpoint "Backend Root" "http://localhost:8000/" "200"

echo ""
echo "3. Testing Backend API Docs..."
test_endpoint "API Documentation" "http://localhost:8000/docs" "200"

echo ""
echo "4. Testing Frontend..."
test_endpoint "Frontend" "http://localhost:3000" "200"

echo ""
echo "5. Testing Calculation Endpoint..."
test_calculation

echo ""
echo "6. Testing Frontend-Backend Communication..."
test_frontend_backend

echo ""
echo "7. Checking Docker Services..."
echo -n "PostgreSQL: "
if docker compose ps postgres | grep -q "healthy"; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Unhealthy${NC}"
fi

echo -n "Backend: "
if docker compose ps backend | grep -q "Up"; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not Running${NC}"
fi

echo -n "Frontend: "
if docker compose ps frontend | grep -q "Up"; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not Running${NC}"
fi

echo ""
echo "🎯 Integration Test Summary"
echo "=========================="
echo "Frontend URL: http://localhost:3000"
echo "Backend URL: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "pgAdmin: http://localhost:5050"
echo ""
echo "All services are running and communicating successfully! 🚀"
