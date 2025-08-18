from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import engine, Base
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


