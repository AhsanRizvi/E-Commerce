from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    CUSTOMER = "customer"
    STAFF = "staff"

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.CUSTOMER
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class Address(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool = False

class UserInDB(UserBase):
    id: str = Field(..., alias="_id")
    hashed_password: str
    addresses: List[Address] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class User(UserBase):
    id: str = Field(..., alias="_id")
    addresses: List[Address] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
