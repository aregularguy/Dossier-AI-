from fastapi import APIRouter, Depends, Request

from config import settings
from models.schemas import AskRequest, AskResponse
from services.auth import get_current_user
from services.llm import LLMService
from services.vector_store import VectorStore

router = APIRouter()


@router.post("/ask", response_model=AskResponse)
async def ask_documents(
    request: Request,
    body: AskRequest,
    user: dict = Depends(get_current_user),
):
    """Semantic search across user's documents, then generate answer via Groq."""
    user_id = user["user_id"]
    embedder = request.app.state.embedder

    # 1. Embed the question
    query_embedding = embedder.embed_query(body.question)

    # 2. Similarity search in pgvector
    store = VectorStore()
    chunks = store.similarity_search(
        query_embedding=query_embedding,
        user_id=user_id,
        top_k=body.top_k,
        threshold=settings.similarity_threshold,
    )

    if not chunks:
        return AskResponse(
            answer="I could not find any relevant information in your uploaded documents. "
            "Please make sure you have ingested at least one document first.",
            sources=[],
            question=body.question,
        )

    # 3. Generate answer with Groq LLM
    llm = LLMService()
    answer = llm.generate_answer(body.question, chunks)

    # 4. Build source attribution
    sources = [
        {
            "chunk_id": str(c["id"]),
            "document_id": str(c["document_id"]),
            "content_preview": c["content"][:200],
            "similarity": round(c["similarity"], 4),
            "metadata": c.get("metadata", {}),
        }
        for c in chunks
    ]

    return AskResponse(
        answer=answer,
        sources=sources,
        question=body.question,
    )
