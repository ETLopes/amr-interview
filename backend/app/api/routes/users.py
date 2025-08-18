from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ... import models, schemas
from ...db import get_db
from ...core.security import get_current_active_user
from ...crud.users import UserRepository

router = APIRouter()


@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user


@router.patch("/me", response_model=schemas.User)
async def update_user_me(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return UserRepository.update_user(db, current_user.id, user_update)


