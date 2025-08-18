from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ... import models, schemas
from ...db import get_db
from ...core.security import get_current_active_user
from ...services.simulations import SimulationService

router = APIRouter()


@router.post("/", response_model=schemas.Simulation)
async def create_simulation(
    simulation: schemas.SimulationCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return SimulationService.create_simulation(db, simulation, current_user.id)


@router.get("/", response_model=schemas.SimulationsListResponse)
async def get_user_simulations(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    simulations, total = SimulationService.get_user_simulations(db, current_user.id, skip, limit)
    return schemas.SimulationsListResponse(simulations=simulations, total=total)


@router.get("/{simulation_id}", response_model=schemas.Simulation)
async def get_simulation(
    simulation_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return SimulationService.get_simulation(db, simulation_id, current_user.id)


@router.put("/{simulation_id}", response_model=schemas.Simulation)
async def update_simulation(
    simulation_id: int,
    simulation_update: schemas.SimulationUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return SimulationService.update_simulation(db, simulation_id, simulation_update, current_user.id)


@router.delete("/{simulation_id}")
async def delete_simulation(
    simulation_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return SimulationService.delete_simulation(db, simulation_id, current_user.id)


@router.get("/statistics")
async def get_simulation_statistics(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return SimulationService.get_simulation_statistics(db, current_user.id)


