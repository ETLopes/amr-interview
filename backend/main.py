from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from database import engine, get_db
import models
import schemas
from auth import authenticate_user, create_access_token, get_current_active_user, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from crud import UserCRUD
from simulation_service import SimulationService

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="aMORA Real Estate Simulator API",
    description="API for simulating real estate purchases with mortgage calculations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to aMORA Real Estate Simulator API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "aMORA API"}

# Authentication endpoints
@app.post("/register", response_model=schemas.User)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    # Check if username already exists
    if UserCRUD.get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    if UserCRUD.get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    return UserCRUD.create_user(db, user)

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login and get access token
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# User endpoints
@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    """
    Get current user information
    """
    return current_user

# Simulation endpoints
@app.post("/simulations", response_model=schemas.Simulation)
async def create_simulation(
    simulation: schemas.SimulationCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new simulation
    """
    return SimulationService.create_simulation(db, simulation, current_user.id)

@app.get("/simulations", response_model=schemas.SimulationsListResponse)
async def get_user_simulations(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all simulations for the current user
    """
    simulations, total = SimulationService.get_user_simulations(
        db, current_user.id, skip, limit
    )
    return schemas.SimulationsListResponse(simulations=simulations, total=total)

@app.get("/simulations/{simulation_id}", response_model=schemas.Simulation)
async def get_simulation(
    simulation_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific simulation by ID
    """
    return SimulationService.get_simulation(db, simulation_id, current_user.id)

@app.put("/simulations/{simulation_id}", response_model=schemas.Simulation)
async def update_simulation(
    simulation_id: int,
    simulation_update: schemas.SimulationUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update an existing simulation
    """
    return SimulationService.update_simulation(
        db, simulation_id, simulation_update, current_user.id
    )

@app.delete("/simulations/{simulation_id}")
async def delete_simulation(
    simulation_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a simulation
    """
    return SimulationService.delete_simulation(db, simulation_id, current_user.id)

@app.get("/simulations/statistics")
async def get_simulation_statistics(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics for user's simulations
    """
    return SimulationService.get_simulation_statistics(db, current_user.id)

# Utility endpoints
@app.post("/calculate")
async def calculate_simulation_values(
    simulation_data: schemas.SimulationCreate
):
    """
    Calculate simulation values without saving to database
    """
    calculated_values = SimulationService.calculate_simulation_values(
        simulation_data.property_value,
        simulation_data.down_payment_percentage,
        simulation_data.contract_years
    )
    
    return {
        "input": {
            "property_value": simulation_data.property_value,
            "down_payment_percentage": simulation_data.down_payment_percentage,
            "contract_years": simulation_data.contract_years
        },
        "calculated_values": calculated_values
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

