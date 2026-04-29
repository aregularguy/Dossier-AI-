from fastapi import APIRouter, Request

from models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check(request: Request):
    model_loaded = (
        hasattr(request.app.state, "embedder")
        and request.app.state.embedder is not None
    )
    return HealthResponse(
        status="ok",
        model_loaded=model_loaded,
        version="1.0.0",
    )
