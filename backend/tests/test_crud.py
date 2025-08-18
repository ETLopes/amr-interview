import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app import models, schemas
from app.crud.users import UserRepository
from fastapi import HTTPException


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_create_and_get_user(db_session):
    user_in = schemas.UserCreate(email="unit@example.com", password="password123")
    user = UserRepository.create_user(db_session, user_in)

    assert user.id is not None
    assert user.email == "unit@example.com"
    # hashed_password should not equal plain password
    assert user.hashed_password != user_in.password

    fetched = UserRepository.get_user_by_email(db_session, "unit@example.com")
    assert fetched is not None
    assert fetched.id == user.id


def test_unique_email_constraint(db_session):
    user_in = schemas.UserCreate(email="dup@example.com", password="password123")
    UserRepository.create_user(db_session, user_in)
    with pytest.raises(HTTPException) as exc:
        UserRepository.create_user(db_session, user_in)
    assert exc.value.status_code == 400


def test_update_user(db_session):
    user_in = schemas.UserCreate(email="update@example.com", password="password123")
    user = UserRepository.create_user(db_session, user_in)

    updated = UserRepository.update_user(db_session, user.id, schemas.UserUpdate(name="John"))
    assert updated.name == "John"


def test_delete_user(db_session):
    user_in = schemas.UserCreate(email="delete@example.com", password="password123")
    user = UserRepository.create_user(db_session, user_in)

    result = UserRepository.delete_user(db_session, user.id)
    assert result["message"].lower().startswith("user deleted")

    with pytest.raises(HTTPException):
        UserRepository.delete_user(db_session, user.id)


