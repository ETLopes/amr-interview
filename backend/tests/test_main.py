from fastapi.testclient import TestClient
from main import app
import pytest
from unittest.mock import patch, MagicMock

client = TestClient(app)


def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to aMORA Real Estate Simulator API"}


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "aMORA API"}


def test_calculate_simulation():
    """Test calculation endpoint without authentication"""
    response = client.post(
        "/calculate",
        json={
            "property_value": 500000,
            "down_payment_percentage": 20,
            "contract_years": 30,
        },
    )
    assert response.status_code == 200

    data = response.json()
    assert "input" in data
    assert "calculated_values" in data

    # Verify calculations
    calculated = data["calculated_values"]
    assert calculated["down_payment_amount"] == 100000.0  # 20% of 500000
    assert calculated["financing_amount"] == 400000.0  # 500000 - 100000
    assert calculated["total_to_save"] == 75000.0  # 15% of 500000
    assert calculated["monthly_savings"] == 208.33  # 75000 / (30 * 12)


def test_calculate_invalid_inputs():
    """Test calculation endpoint with invalid inputs"""
    # Invalid property value
    response = client.post(
        "/calculate",
        json={
            "property_value": -100,
            "down_payment_percentage": 20,
            "contract_years": 30,
        },
    )
    assert response.status_code == 422

    # Invalid down payment percentage
    response = client.post(
        "/calculate",
        json={
            "property_value": 500000,
            "down_payment_percentage": 150,
            "contract_years": 30,
        },
    )
    assert response.status_code == 422

    # Invalid contract years
    response = client.post(
        "/calculate",
        json={
            "property_value": 500000,
            "down_payment_percentage": 20,
            "contract_years": 50,
        },
    )
    assert response.status_code == 422


@patch("main.UserRepository.create_user")
def test_register_user(mock_create_user):
    """Test user registration"""
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.email = "unique_test@example.com"
    mock_user.name = None
    mock_user.created_at = "2024-01-01T00:00:00"
    mock_user.updated_at = None
    mock_create_user.return_value = mock_user

    response = client.post(
        "/register",
        json={"email": "unique_test@example.com", "password": "password123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "unique_test@example.com"
    assert data["name"] is None


@patch("main.UserRepository.create_user")
def test_register_user_with_name(mock_create_user):
    """Test user registration with name"""
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.email = "unique_test_with_name@example.com"
    mock_user.name = "John Doe"
    mock_user.created_at = "2024-01-01T00:00:00"
    mock_user.updated_at = None
    mock_create_user.return_value = mock_user

    response = client.post(
        "/register",
        json={
            "email": "unique_test_with_name@example.com",
            "name": "John Doe",
            "password": "password123",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "unique_test_with_name@example.com"
    assert data["name"] == "John Doe"


def test_register_invalid_data():
    """Test user registration with invalid data"""
    # Missing required fields
    response = client.post("/register", json={"email": "test@example.com"})
    assert response.status_code == 422

    # Invalid email format
    response = client.post(
        "/register", json={"email": "invalid-email", "password": "password123"}
    )
    assert response.status_code == 422

    # Password too short
    response = client.post(
        "/register", json={"email": "test@example.com", "password": "123"}
    )
    assert response.status_code == 422


def test_protected_endpoints_require_auth():
    """Test that protected endpoints require authentication"""
    # Try to access protected endpoints without token
    response = client.get("/users/me")
    assert response.status_code == 401

    response = client.post(
        "/simulations",
        json={
            "property_value": 500000,
            "down_payment_percentage": 20,
            "contract_years": 30,
        },
    )
    assert response.status_code == 401

    response = client.get("/simulations")
    assert response.status_code == 401


if __name__ == "__main__":
    pytest.main([__file__])
