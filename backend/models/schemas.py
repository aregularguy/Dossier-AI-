from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# --- Request models ---


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000)
    top_k: int = Field(default=5, ge=1, le=20)


# --- Response models ---


class DocumentResponse(BaseModel):
    id: str
    filename: str
    page_count: Optional[int] = None
    chunk_count: int
    status: str
    created_at: datetime


class IngestResponse(BaseModel):
    document_id: str
    filename: str
    page_count: int
    chunk_count: int
    status: str
    message: str


class AskResponse(BaseModel):
    answer: str
    sources: list[dict]
    question: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
