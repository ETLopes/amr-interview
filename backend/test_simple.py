#!/usr/bin/env python3
"""
Simple tests for aMORA Real Estate Simulator
These tests can be run without TestClient compatibility issues
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def test_imports():
    """Test that all modules can be imported"""
    try:
        # Test imports without storing them
        import main  # noqa: F401
        import models  # noqa: F401
        import schemas  # noqa: F401
        import auth  # noqa: F401
        import database  # noqa: F401

        print("✅ All modules imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False


def test_calculation_formulas():
    """Test the calculation formulas"""
    try:
        from simulation_service import SimulationService

        # Test calculation with known values
        result = SimulationService.calculate_simulation_values(
            property_value=500000, down_payment_percentage=20, contract_years=30
        )

        # Verify calculations
        expected_down_payment = 500000 * 0.20  # 100000
        expected_financing = 500000 - expected_down_payment  # 400000
        expected_total_save = 500000 * 0.15  # 75000
        expected_monthly_savings = expected_total_save / (30 * 12)  # 208.33

        assert abs(result["down_payment_amount"] - expected_down_payment) < 0.01
        assert abs(result["financing_amount"] - expected_financing) < 0.01
        assert abs(result["total_to_save"] - expected_total_save) < 0.01
        assert abs(result["monthly_savings"] - expected_monthly_savings) < 0.01

        print("✅ Calculation formulas working correctly")
        return True

    except Exception as e:
        print(f"❌ Calculation test failed: {e}")
        return False


def test_schema_validation():
    """Test Pydantic schema validation"""
    try:
        from schemas import UserCreate, SimulationCreate

        # Test valid user creation
        user_data = {"email": "test@example.com", "password": "password123"}
        user = UserCreate(**user_data)
        assert user.email == "test@example.com"
        assert user.password == "password123"
        assert user.name is None

        # Test user with name
        user_with_name = UserCreate(
            email="john@example.com", password="password123", name="John Doe"
        )
        assert user_with_name.name == "John Doe"

        # Test valid simulation creation
        sim_data = {
            "property_value": 500000,
            "down_payment_percentage": 20,
            "contract_years": 30,
        }
        simulation = SimulationCreate(**sim_data)
        assert simulation.property_value == 500000

        print("✅ Schema validation working correctly")
        return True

    except Exception as e:
        print(f"❌ Schema validation test failed: {e}")
        return False


def test_email_validation():
    """Test email validation"""
    try:
        from schemas import UserCreate

        # Test valid email
        try:
            UserCreate(email="valid@email.com", password="password123")
            print("✅ Valid email accepted")
        except Exception as e:
            print(f"❌ Valid email rejected: {e}")
            return False

        # Test invalid email
        try:
            UserCreate(email="invalid-email", password="password123")
            print("❌ Invalid email accepted (should have been rejected)")
            return False
        except Exception:
            print("✅ Invalid email correctly rejected")

        return True

    except Exception as e:
        print(f"❌ Email validation test failed: {e}")
        return False


def run_all_tests():
    """Run all tests and report results"""
    print("🧪 Running aMORA Real Estate Simulator Tests")
    print("=" * 50)

    tests = [
        test_imports,
        test_calculation_formulas,
        test_schema_validation,
        test_email_validation,
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        try:
            if test():
                passed += 1
            print()
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
            print()

    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1


if __name__ == "__main__":
    sys.exit(run_all_tests())
