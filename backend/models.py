from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    simulations = relationship("Simulation", back_populates="user")

class Simulation(Base):
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Property details
    property_value = Column(Float, nullable=False)
    down_payment_percentage = Column(Float, nullable=False)
    contract_years = Column(Integer, nullable=False)
    
    # Calculated values
    down_payment_amount = Column(Float, nullable=False)
    financing_amount = Column(Float, nullable=False)
    total_to_save = Column(Float, nullable=False)
    monthly_savings = Column(Float, nullable=False)
    
    # Additional details
    property_address = Column(Text, nullable=True)
    property_type = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="simulations")
