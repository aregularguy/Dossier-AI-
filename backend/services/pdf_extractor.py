import io

import pdfplumber


class PDFExtractor:
    @staticmethod
    def extract_text(pdf_bytes: bytes) -> tuple[str, int]:
        """Extract text from PDF bytes. Returns (full_text, page_count)."""
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            pages = []
            for page in pdf.pages:
                text = page.extract_text() or ""
                pages.append(text)
            return "\n\n".join(pages), len(pages)
