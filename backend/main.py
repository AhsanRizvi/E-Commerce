from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import uvicorn

from app.routers import (
    auth,
    products,
    categories,
    orders,
    users,
    cart,
    payments,
    admin,
    content
)
from app.core.config import settings

# Load environment variables
load_dotenv()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="E-Commerce Platform API"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URI)
    app.mongodb = app.mongodb_client[settings.MONGODB_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

# Include routers
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(products.router, prefix="/api/v1", tags=["Products"])
app.include_router(categories.router, prefix="/api/v1", tags=["Categories"])
app.include_router(orders.router, prefix="/api/v1", tags=["Orders"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(cart.router, prefix="/api/v1", tags=["Cart"])
app.include_router(payments.router, prefix="/api/v1", tags=["Payments"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(content.router, prefix="/api/v1", tags=["Content"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to E-Commerce Platform API",
        "version": settings.API_VERSION,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
