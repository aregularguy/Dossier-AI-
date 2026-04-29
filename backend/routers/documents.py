from fastapi import APIRouter, Depends

from models.schemas import DocumentResponse
from services.auth import get_current_user
from services.vector_store import VectorStore

router = APIRouter()


@router.get("/documents", response_model=list[DocumentResponse])
async def list_documents(user: dict = Depends(get_current_user)):
    """List all documents ingested by the current user."""
    store = VectorStore()
    docs = store.get_user_documents(user["user_id"])
    return docs


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    user: dict = Depends(get_current_user),
):
    """Delete a document and all its chunks."""
    store = VectorStore()
    store.delete_document(document_id, user["user_id"])
    return {"message": "Document deleted"}
