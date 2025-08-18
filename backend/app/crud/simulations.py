from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from .. import models, schemas


class SimulationRepository:

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        data: schemas.SimulationCreate,
        calculated: dict | None = None,
    ) -> models.Simulation:
        calculated = calculated or {}
        db_simulation = models.Simulation(
            user_id=user_id,
            property_value=data.property_value,
            down_payment_percentage=data.down_payment_percentage,
            contract_years=data.contract_years,
            property_address=data.property_address,
            property_type=data.property_type,
            notes=data.notes,
            **calculated,
        )
        db.add(db_simulation)
        db.commit()
        db.refresh(db_simulation)
        return db_simulation

    @staticmethod
    def list_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
        sims = (
            db.query(models.Simulation)
            .filter(models.Simulation.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        total = db.query(models.Simulation).filter(models.Simulation.user_id == user_id).count()
        return sims, total

    @staticmethod
    def get_for_user(db: Session, simulation_id: int, user_id: int) -> models.Simulation:
        sim = (
            db.query(models.Simulation)
            .filter(models.Simulation.id == simulation_id, models.Simulation.user_id == user_id)
            .first()
        )
        if not sim:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Simulation not found")
        return sim

    @staticmethod
    def update(db: Session, sim: models.Simulation, updates: dict) -> models.Simulation:
        for field, value in updates.items():
            setattr(sim, field, value)
        db.commit()
        db.refresh(sim)
        return sim

    @staticmethod
    def delete(db: Session, sim: models.Simulation):
        db.delete(sim)
        db.commit()
        return {"message": "Simulation deleted successfully"}


