from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import timedelta
from typing import Any

from app.core.security import verify_password, create_access_token, get_password_hash
from app.core.config import settings
from app.models.user import UserCreate, User, UserInDB
from app.dependencies.database import get_database

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def authenticate_user(db: AsyncIOMotorClient, email: str, password: str) -> Any:
    user_collection = db[settings.MONGODB_NAME].users
    user = await user_collection.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorClient = Depends(get_database)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "role": user["role"],
            "first_name": user["first_name"],
            "last_name": user["last_name"]
        }
    }

@router.post("/register", response_model=User)
async def register_user(
    user: UserCreate,
    db: AsyncIOMotorClient = Depends(get_database)
):
    user_collection = db[settings.MONGODB_NAME].users
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_dict = user.dict()
    hashed_password = get_password_hash(user_dict.pop("password"))
    user_db = UserInDB(
        **user_dict,
        hashed_password=hashed_password
    )
    
    result = await user_collection.insert_one(user_db.dict(by_alias=True))
    created_user = await user_collection.find_one({"_id": result.inserted_id})
    
    return User(**created_user)
