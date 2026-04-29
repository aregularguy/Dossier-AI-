from sentence_transformers import SentenceTransformer


class EmbedderService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        """Embed a batch of texts. Returns list of 384-dim float lists."""
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        return embeddings.tolist()

    def embed_query(self, query: str) -> list[float]:
        """Embed a single query string."""
        embedding = self.model.encode([query], normalize_embeddings=True)
        return embedding[0].tolist()
