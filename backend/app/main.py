from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import engine, Base
from . import schemas
from .services.simulations import SimulationService
from .api.routes import auth as auth_routes
from .api.routes import users as user_routes
from .api.routes import simulations as simulation_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="aMORA Real Estate Simulator API",
    description="API for simulating real estate purchases with mortgage calculations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


app.include_router(auth_routes.router, tags=["auth"])
app.include_router(user_routes.router, prefix="/users", tags=["users"])
app.include_router(simulation_routes.router, prefix="/simulations", tags=["simulations"])


@app.post("/calculate")
async def calculate_simulation_values(simulation_data: schemas.SimulationCreate):
    calculated_values = SimulationService.calculate_simulation_values(
        simulation_data.property_value,
        simulation_data.down_payment_percentage,
        simulation_data.contract_years,
    )
    return {
        "input": {
            "property_value": simulation_data.property_value,
            "down_payment_percentage": simulation_data.down_payment_percentage,
            "contract_years": simulation_data.contract_years,
        },
        "calculated_values": calculated_values,
    }


