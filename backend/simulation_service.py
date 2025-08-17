from sqlalchemy.orm import Session
import models
import schemas
from fastapi import HTTPException, status


class SimulationService:

    @staticmethod
    def calculate_simulation_values(
        property_value: float, down_payment_percentage: float, contract_years: int
    ):
        """
        Calculate all simulation values based on the formulas specified in GUIDELINES.md
        """
        # Value of the down payment
        down_payment_amount = property_value * (down_payment_percentage / 100)

        # Value to finance
        financing_amount = property_value - down_payment_amount

        # Total to save (15% of property value for additional costs)
        total_to_save = property_value * 0.15

        # Monthly savings amount (to reach total_to_save over contract years)
        monthly_savings = total_to_save / (contract_years * 12)

        return {
            "down_payment_amount": round(down_payment_amount, 2),
            "financing_amount": round(financing_amount, 2),
            "total_to_save": round(total_to_save, 2),
            "monthly_savings": round(monthly_savings, 2),
        }

    @staticmethod
    def create_simulation(
        db: Session, simulation_data: schemas.SimulationCreate, user_id: int
    ):
        """
        Create a new simulation with calculated values
        """
        # Calculate all values
        calculated_values = SimulationService.calculate_simulation_values(
            simulation_data.property_value,
            simulation_data.down_payment_percentage,
            simulation_data.contract_years,
        )

        # Create simulation object
        db_simulation = models.Simulation(
            user_id=user_id,
            property_value=simulation_data.property_value,
            down_payment_percentage=simulation_data.down_payment_percentage,
            contract_years=simulation_data.contract_years,
            property_address=simulation_data.property_address,
            property_type=simulation_data.property_type,
            notes=simulation_data.notes,
            **calculated_values
        )

        db.add(db_simulation)
        db.commit()
        db.refresh(db_simulation)

        return db_simulation

    @staticmethod
    def get_user_simulations(
        db: Session, user_id: int, skip: int = 0, limit: int = 100
    ):
        """
        Get all simulations for a specific user with pagination
        """
        simulations = (
            db.query(models.Simulation)
            .filter(models.Simulation.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

        total = (
            db.query(models.Simulation)
            .filter(models.Simulation.user_id == user_id)
            .count()
        )

        return simulations, total

    @staticmethod
    def get_simulation(db: Session, simulation_id: int, user_id: int):
        """
        Get a specific simulation by ID, ensuring it belongs to the user
        """
        simulation = (
            db.query(models.Simulation)
            .filter(
                models.Simulation.id == simulation_id,
                models.Simulation.user_id == user_id,
            )
            .first()
        )

        if not simulation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Simulation not found"
            )

        return simulation

    @staticmethod
    def update_simulation(
        db: Session,
        simulation_id: int,
        simulation_data: schemas.SimulationUpdate,
        user_id: int,
    ):
        """
        Update an existing simulation
        """
        # Get existing simulation
        db_simulation = SimulationService.get_simulation(db, simulation_id, user_id)

        # Update fields if provided
        update_data = simulation_data.dict(exclude_unset=True)

        # Recalculate values if any of the main parameters changed
        if any(
            key in update_data
            for key in ["property_value", "down_payment_percentage", "contract_years"]
        ):
            # Get current values or use updated ones
            property_value = update_data.get(
                "property_value", db_simulation.property_value
            )
            down_payment_percentage = update_data.get(
                "down_payment_percentage", db_simulation.down_payment_percentage
            )
            contract_years = update_data.get(
                "contract_years", db_simulation.contract_years
            )

            # Recalculate
            calculated_values = SimulationService.calculate_simulation_values(
                property_value, down_payment_percentage, contract_years
            )
            update_data.update(calculated_values)

        # Update the simulation
        for field, value in update_data.items():
            setattr(db_simulation, field, value)

        db.commit()
        db.refresh(db_simulation)

        return db_simulation

    @staticmethod
    def delete_simulation(db: Session, simulation_id: int, user_id: int):
        """
        Delete a simulation
        """
        db_simulation = SimulationService.get_simulation(db, simulation_id, user_id)

        db.delete(db_simulation)
        db.commit()

        return {"message": "Simulation deleted successfully"}

    @staticmethod
    def get_simulation_statistics(db: Session, user_id: int):
        """
        Get statistics for user's simulations
        """
        simulations = (
            db.query(models.Simulation)
            .filter(models.Simulation.user_id == user_id)
            .all()
        )

        if not simulations:
            return {
                "total_simulations": 0,
                "total_property_value": 0,
                "average_down_payment_percentage": 0,
                "average_contract_years": 0,
            }

        total_property_value = sum(s.property_value for s in simulations)
        avg_down_payment = sum(s.down_payment_percentage for s in simulations) / len(
            simulations
        )
        avg_contract_years = sum(s.contract_years for s in simulations) / len(
            simulations
        )

        return {
            "total_simulations": len(simulations),
            "total_property_value": round(total_property_value, 2),
            "average_down_payment_percentage": round(avg_down_payment, 2),
            "average_contract_years": round(avg_contract_years, 2),
        }
