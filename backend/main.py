from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import health, ingest, ask, documents
from services.embedder import EmbedderService


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load embedding model at startup (~2s, ~90MB)
    app.state.embedder = EmbedderService(settings.embedding_model)
    yield
    del app.state.embedder


app = FastAPI(
    title="Dossier AI - RAG API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(ingest.router, prefix="/api", tags=["Ingest"])
app.include_router(ask.router, prefix="/api", tags=["Ask"])
app.include_router(documents.router, prefix="/api", tags=["Documents"])
