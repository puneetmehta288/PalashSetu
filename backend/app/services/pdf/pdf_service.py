import os
import pdfplumber
from reportlab.pdfgen import canvas
from app.services.translation.translation_service import TranslationService

class PDFService:
    def __init__(self, translation_service: TranslationService):
        self.translation_service = translation_service

    def localize_pdf(self, file_path: str) -> str:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF not found: {file_path}")
            
        out_path = file_path.replace(".pdf", "_localized.pdf")
        
        # Extract and translate
        extracted = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    for line in text.split('\n'):
                        sat_text = self.translation_service.translate(line).translated_text
                        extracted.append((line, sat_text))
                        
        # Generate new PDF
        c = canvas.Canvas(out_path)
        y = 800
        for hin, sat in extracted:
            c.drawString(50, y, f"Hin: {hin[:50]}...")
            c.drawString(300, y, f"Sat: {sat[:50]}...")
            y -= 20
            if y < 50:
                c.showPage()
                y = 800
        c.save()
        return out_path
