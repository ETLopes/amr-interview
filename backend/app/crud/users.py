from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from .. import models, schemas
from ..core.security import get_password_hash


class UserCRUD:

    @staticmethod
    def create_user(db: Session, user: schemas.UserCreate):
        try:
            hashed_password = get_password_hash(user.password)
            db_user = models.User(
                email=user.email, name=user.name, hashed_password=hashed_password
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(models.User).filter(models.User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        return db.query(models.User).filter(models.User.id == user_id).first()

    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.User).offset(skip).limit(limit).all()

    @staticmethod
    def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
        db_user = UserCRUD.get_user_by_id(db, user_id)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(db_user, field):
                setattr(db_user, field, value)

        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def delete_user(db: Session, user_id: int):
        db_user = UserCRUD.get_user_by_id(db, user_id)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        db.delete(db_user)
        db.commit()
        return {"message": "User deleted successfully"}


