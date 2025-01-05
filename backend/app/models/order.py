from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentMethod(str, Enum):
    STRIPE = "stripe"
    PAYPAL = "paypal"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class OrderItem(BaseModel):
    product_id: str
    variant_id: str
    quantity: int
    price: float
    name: str
    variant_name: str

class ShippingAddress(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    country: str
    phone: str

class Payment(BaseModel):
    method: PaymentMethod
    status: PaymentStatus
    amount: float
    transaction_id: Optional[str] = None
    payment_details: dict = {}

class OrderBase(BaseModel):
    user_id: str
    items: List[OrderItem]
    shipping_address: ShippingAddress
    payment: Payment
    subtotal: float
    shipping_cost: float
    tax: float
    total: float
    status: OrderStatus = OrderStatus.PENDING
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment: Optional[Payment] = None
    notes: Optional[str] = None

class Order(OrderBase):
    id: str = Field(..., alias="_id")
    order_number: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
