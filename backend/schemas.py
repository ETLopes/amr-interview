from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Simulation schemas
class SimulationBase(BaseModel):
    property_value: float = Field(..., gt=0)
    down_payment_percentage: float = Field(..., ge=0, le=100)
    contract_years: int = Field(..., ge=1, le=30)
    property_address: Optional[str] = None
    property_type: Optional[str] = None
    notes: Optional[str] = None

class SimulationCreate(SimulationBase):
    pass

class SimulationUpdate(BaseModel):
    property_value: Optional[float] = Field(None, gt=0)
    down_payment_percentage: Optional[float] = Field(None, ge=0, le=100)
    contract_years: Optional[int] = Field(None, ge=1, le=30)
    property_address: Optional[str] = None
    property_type: Optional[str] = None
    notes: Optional[str] = None

class Simulation(SimulationBase):
    id: int
    user_id: int
    down_payment_amount: float
    financing_amount: float
    total_to_save: float
    monthly_savings: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Response schemas
class SimulationResponse(BaseModel):
    simulation: Simulation
    message: str

class SimulationsListResponse(BaseModel):
    simulations: List[Simulation]
    total: int

class UserSimulationsResponse(BaseModel):
    user: User
    simulations: List[Simulation]
    total: int
