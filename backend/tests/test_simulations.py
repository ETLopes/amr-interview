import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app import models, schemas
from app.services.simulations import SimulationService
from fastapi import HTTPException


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


def create_user(db):
    user = models.User(email="simuser@example.com", name=None, hashed_password="hash")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_calculate_values():
    result = SimulationService.calculate_simulation_values(500000, 20, 30)
    assert result["down_payment_amount"] == 100000.0
    assert result["financing_amount"] == 400000.0
    assert result["total_to_save"] == 75000.0
    assert result["monthly_savings"] == 208.33


def test_create_and_get_simulation(db_session):
    user = create_user(db_session)
    sim_in = schemas.SimulationCreate(
        property_value=500000,
        down_payment_percentage=20,
        contract_years=30,
        property_address="Av. Teste",
        property_type="Apartamento",
        notes="Teste",
    )

    sim = SimulationService.create_simulation(db_session, sim_in, user.id)
    assert sim.id is not None
    assert sim.user_id == user.id
    # Check calculated fields persisted
    assert sim.down_payment_amount == 100000.0

    fetched = SimulationService.get_simulation(db_session, sim.id, user.id)
    assert fetched.id == sim.id


def test_get_user_simulations_and_stats(db_session):
    user = create_user(db_session)
    for i in range(3):
        SimulationService.create_simulation(
            db_session,
            schemas.SimulationCreate(property_value=100000 * (i + 1), down_payment_percentage=10, contract_years=10),
            user.id,
        )

    sims, total = SimulationService.get_user_simulations(db_session, user.id)
    assert total == 3
    assert len(sims) == 3

    stats = SimulationService.get_simulation_statistics(db_session, user.id)
    assert stats["total_simulations"] == 3


def test_update_and_delete_simulation(db_session):
    user = create_user(db_session)
    sim = SimulationService.create_simulation(
        db_session,
        schemas.SimulationCreate(property_value=200000, down_payment_percentage=10, contract_years=20),
        user.id,
    )

    updated = SimulationService.update_simulation(
        db_session, sim.id, schemas.SimulationUpdate(property_value=300000), user.id
    )
    assert updated.property_value == 300000
    assert updated.down_payment_amount == 30000.0

    result = SimulationService.delete_simulation(db_session, sim.id, user.id)
    assert result["message"].lower().startswith("simulation deleted")

    with pytest.raises(HTTPException):
        SimulationService.get_simulation(db_session, sim.id, user.id)


