from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    simulations = relationship("Simulation", back_populates="user")


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    property_value = Column(Float, nullable=False)
    down_payment_percentage = Column(Float, nullable=False)
    contract_years = Column(Integer, nullable=False)

    down_payment_amount = Column(Float, nullable=False)
    financing_amount = Column(Float, nullable=False)
    total_to_save = Column(Float, nullable=False)
    monthly_savings = Column(Float, nullable=False)

    property_address = Column(Text, nullable=True)
    property_type = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="simulations")


