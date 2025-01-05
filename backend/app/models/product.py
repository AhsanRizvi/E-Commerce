from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ProductStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    OUT_OF_STOCK = "out_of_stock"
    DISCONTINUED = "discontinued"

class ProductImage(BaseModel):
    url: str
    alt: Optional[str] = None
    is_primary: bool = False

class ProductVariant(BaseModel):
    sku: str
    name: str
    price: float
    sale_price: Optional[float] = None
    stock: int
    attributes: dict  # e.g., {"color": "red", "size": "XL"}

class ProductBase(BaseModel):
    name: str
    description: str
    category_id: str
    brand: Optional[str] = None
    status: ProductStatus = ProductStatus.DRAFT
    tags: List[str] = []
    images: List[ProductImage] = []
    variants: List[ProductVariant] = []
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: List[str] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    brand: Optional[str] = None
    status: Optional[ProductStatus] = None
    tags: Optional[List[str]] = None
    images: Optional[List[ProductImage]] = None
    variants: Optional[List[ProductVariant]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[List[str]] = None

class Product(ProductBase):
    id: str = Field(..., alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
