from supabase import create_client, Client

from config import settings


class VectorStore:
    def __init__(self):
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
        )

    def insert_document(
        self,
        user_id: str,
        filename: str,
        storage_path: str,
        page_count: int,
        char_count: int,
    ) -> dict:
        """Create a document record."""
        result = (
            self.client.table("documents")
            .insert({
                "user_id": user_id,
                "filename": filename,
                "storage_path": storage_path,
                "page_count": page_count,
                "char_count": char_count,
                "status": "processing",
            })
            .execute()
        )
        return result.data[0]

    def update_document_status(
        self,
        doc_id: str,
        status: str,
        chunk_count: int | None = None,
        error: str | None = None,
    ):
        """Update document status after ingestion."""
        update: dict = {"status": status}
        if chunk_count is not None:
            update["chunk_count"] = chunk_count
        if error:
            update["error_message"] = error
        self.client.table("documents").update(update).eq("id", doc_id).execute()

    def insert_chunks(self, chunks: list[dict]):
        """Batch insert chunks with embeddings."""
        self.client.table("document_chunks").insert(chunks).execute()

    def similarity_search(
        self,
        query_embedding: list[float],
        user_id: str,
        top_k: int = 5,
        threshold: float = 0.3,
    ) -> list[dict]:
        """Vector similarity search via the match_document_chunks RPC."""
        result = self.client.rpc(
            "match_document_chunks",
            {
                "query_embedding": query_embedding,
                "match_user_id": user_id,
                "match_count": top_k,
                "match_threshold": threshold,
            },
        ).execute()
        return result.data

    def get_user_documents(self, user_id: str) -> list[dict]:
        """List all documents for a user."""
        result = (
            self.client.table("documents")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data

    def delete_document(self, doc_id: str, user_id: str):
        """Delete a document and its chunks (CASCADE handles chunks)."""
        (
            self.client.table("documents")
            .delete()
            .eq("id", doc_id)
            .eq("user_id", user_id)
            .execute()
        )
