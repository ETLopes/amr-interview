from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from .. import models, schemas
from ..crud.simulations import SimulationRepository


class SimulationService:

    @staticmethod
    def calculate_simulation_values(
        property_value: float, down_payment_percentage: float, contract_years: int
    ):
        down_payment_amount = property_value * (down_payment_percentage / 100)
        financing_amount = property_value - down_payment_amount
        total_to_save = property_value * 0.15
        monthly_savings = total_to_save / (contract_years * 12)

        return {
            "down_payment_amount": round(down_payment_amount, 2),
            "financing_amount": round(financing_amount, 2),
            "total_to_save": round(total_to_save, 2),
            "monthly_savings": round(monthly_savings, 2),
        }

    @staticmethod
    def create_simulation(db: Session, simulation_data: schemas.SimulationCreate, user_id: int):
        calculated_values = SimulationService.calculate_simulation_values(
            simulation_data.property_value,
            simulation_data.down_payment_percentage,
            simulation_data.contract_years,
        )
        return SimulationRepository.create(db, user_id, simulation_data, calculated_values)

    @staticmethod
    def get_user_simulations(db: Session, user_id: int, skip: int = 0, limit: int = 100):
        return SimulationRepository.list_by_user(db, user_id, skip, limit)

    @staticmethod
    def get_simulation(db: Session, simulation_id: int, user_id: int):
        return SimulationRepository.get_for_user(db, simulation_id, user_id)

    @staticmethod
    def update_simulation(
        db: Session, simulation_id: int, simulation_data: schemas.SimulationUpdate, user_id: int
    ):
        db_simulation = SimulationService.get_simulation(db, simulation_id, user_id)
        update_data = simulation_data.dict(exclude_unset=True)

        if any(
            key in update_data
            for key in ["property_value", "down_payment_percentage", "contract_years"]
        ):
            property_value = update_data.get("property_value", db_simulation.property_value)
            down_payment_percentage = update_data.get(
                "down_payment_percentage", db_simulation.down_payment_percentage
            )
            contract_years = update_data.get("contract_years", db_simulation.contract_years)

            calculated_values = SimulationService.calculate_simulation_values(
                property_value, down_payment_percentage, contract_years
            )
            update_data.update(calculated_values)

        return SimulationRepository.update(db, db_simulation, update_data)

    @staticmethod
    def delete_simulation(db: Session, simulation_id: int, user_id: int):
        db_simulation = SimulationService.get_simulation(db, simulation_id, user_id)
        return SimulationRepository.delete(db, db_simulation)

    @staticmethod
    def get_simulation_statistics(db: Session, user_id: int):
        simulations = db.query(models.Simulation).filter(models.Simulation.user_id == user_id).all()
        if not simulations:
            return {
                "total_simulations": 0,
                "total_property_value": 0,
                "average_down_payment_percentage": 0,
                "average_contract_years": 0,
            }

        total_property_value = sum(s.property_value for s in simulations)
        avg_down_payment = sum(s.down_payment_percentage for s in simulations) / len(simulations)
        avg_contract_years = sum(s.contract_years for s in simulations) / len(simulations)

        return {
            "total_simulations": len(simulations),
            "total_property_value": round(total_property_value, 2),
            "average_down_payment_percentage": round(avg_down_payment, 2),
            "average_contract_years": round(avg_contract_years, 2),
        }


