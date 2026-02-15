import fitz  # PyMuPDF
from typing import Dict, Any

class OCRService:
    @staticmethod
    def extract_text(file_path: str) -> Dict[str, Any]:
        """Extracts text from a PDF file using PyMuPDF."""
        doc = fitz.open(file_path)
        full_text = ""
        for page in doc:
            full_text += page.get_text()
            
        page_count = len(doc)
        doc.close()
        
        return {
            "text": full_text,
            "page_count": page_count
        }

ocr_service = OCRService()
