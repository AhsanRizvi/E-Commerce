from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = os.getenv("APP_NAME", "ECommerce Platform")
    API_VERSION: str = os.getenv("API_VERSION", "v1")
    DEBUG: bool = os.getenv("DEBUG", True)
    
    # MongoDB Settings
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/ecommerce")
    MONGODB_NAME: str = "ecommerce"
    
    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # File Storage Settings
    STORAGE_PROVIDER: str = os.getenv("STORAGE_PROVIDER", "cloudinary")  # or 's3'
    
    # AWS S3 Settings
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_BUCKET_NAME: str = os.getenv("AWS_BUCKET_NAME", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "")
    
    # Cloudinary Settings
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    
    # Payment Settings
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET", "")
    PAYPAL_MODE: str = os.getenv("PAYPAL_MODE", "sandbox")
    
    # Email Settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "")
    
    # Frontend URLs
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:4200")
    ADMIN_URL: str = os.getenv("ADMIN_URL", "http://localhost:4201")
    
    # Security Settings
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", '["http://localhost:4200","http://localhost:4201"]').split(",")
    RATE_LIMIT_PER_SECOND: int = int(os.getenv("RATE_LIMIT_PER_SECOND", 10))

    class Config:
        case_sensitive = True

settings = Settings()
