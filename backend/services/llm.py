from groq import Groq

from config import settings


class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.groq_model

    def generate_answer(self, question: str, context_chunks: list[dict]) -> str:
        """Generate an answer using retrieved context chunks."""
        context_parts = []
        for i, chunk in enumerate(context_chunks, 1):
            source = chunk.get("metadata", {}).get("source_filename", "Document")
            context_parts.append(f"[Source {i}: {source}]\n{chunk['content']}")

        context_str = "\n\n---\n\n".join(context_parts)

        system_prompt = (
            "You are Dossier AI, an intelligent document assistant. "
            "Answer the user's question based ONLY on the provided context "
            "from their uploaded documents.\n\n"
            "Rules:\n"
            "- Answer based strictly on the provided context\n"
            "- If the context does not contain enough information, say so clearly\n"
            "- Cite which source(s) you used (e.g., 'According to Source 1...')\n"
            "- Be concise but thorough"
        )

        user_prompt = (
            f"Context from user's documents:\n\n{context_str}\n\n---\n\n"
            f"User question: {question}"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=1024,
        )

        return response.choices[0].message.content
