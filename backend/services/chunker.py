from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import settings


class ChunkerService:
    def __init__(self):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

    def chunk_text(self, text: str, metadata: dict | None = None) -> list[dict]:
        """Split text into chunks with metadata."""
        chunks = self.splitter.split_text(text)
        result = []
        for i, chunk in enumerate(chunks):
            result.append({
                "content": chunk,
                "chunk_index": i,
                "metadata": {**(metadata or {}), "chunk_index": i},
            })
        return result
