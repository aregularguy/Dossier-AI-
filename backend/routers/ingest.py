import logging
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile

from models.schemas import IngestResponse
from services.auth import get_current_user
from services.chunker import ChunkerService
from services.pdf_extractor import PDFExtractor
from services.vector_store import VectorStore

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post("/ingest", response_model=IngestResponse)
async def ingest_document(
    request: Request,
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    """Upload a PDF, chunk it, embed chunks, store in pgvector."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    user_id = user["user_id"]
    pdf_bytes = await file.read()

    # 1. Extract text from PDF
    extractor = PDFExtractor()
    try:
        full_text, page_count = extractor.extract_text(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract PDF text: {e}")

    if not full_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No text found in PDF. Scanned/image PDFs are not supported.",
        )

    # 2. Upload to Supabase Storage.
    # The uuid prefix keeps two uploads of the same filename from overwriting
    # each other, so each document row points at its own object.
    storage_path = f"{user_id}/{uuid4()}-{file.filename}"
    store = VectorStore()
    try:
        store.client.storage.from_("resumes").upload(
            storage_path,
            pdf_bytes,
            {"content-type": "application/pdf", "upsert": "false"},
        )
    except Exception:
        logger.exception("Failed to upload %s to storage", storage_path)
        raise HTTPException(status_code=500, detail="Failed to store file")

    # 3. Create document record
    doc = store.insert_document(
        user_id=user_id,
        filename=file.filename,
        storage_path=storage_path,
        page_count=page_count,
        char_count=len(full_text),
    )

    try:
        # 4. Chunk text
        chunker = ChunkerService()
        chunks = chunker.chunk_text(
            full_text,
            metadata={
                "source_filename": file.filename,
                "document_id": doc["id"],
            },
        )

        # 5. Embed chunks (batch)
        embedder = request.app.state.embedder
        texts = [c["content"] for c in chunks]
        embeddings = embedder.embed_texts(texts)

        # 6. Prepare rows for pgvector
        rows = []
        for chunk, embedding in zip(chunks, embeddings):
            rows.append({
                "document_id": doc["id"],
                "user_id": user_id,
                "chunk_index": chunk["chunk_index"],
                "content": chunk["content"],
                "metadata": chunk["metadata"],
                "embedding": embedding,
            })

        # 7. Insert into document_chunks
        store.insert_chunks(rows)

        # 8. Update document status
        store.update_document_status(doc["id"], "ready", chunk_count=len(chunks))

        return IngestResponse(
            document_id=doc["id"],
            filename=file.filename,
            page_count=page_count,
            chunk_count=len(chunks),
            status="ready",
            message=f"Successfully indexed {len(chunks)} chunks from {file.filename}",
        )

    except Exception as e:
        store.update_document_status(doc["id"], "error", error=str(e))
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {e}")
