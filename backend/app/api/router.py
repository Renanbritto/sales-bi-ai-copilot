from fastapi import APIRouter
from app.api.endpoints import analytics, chat

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(analytics.router)
api_router.include_router(chat.router)
