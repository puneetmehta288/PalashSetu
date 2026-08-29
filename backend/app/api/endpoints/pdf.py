from fastapi import APIRouter, HTTPException
from app.schemas.pdf import PDFLocalizeRequest, PDFLocalizeResponse
from app.services.pdf.pdf_service import PDFService
from app.services.translation.indictrans2_service import IndicTrans2Service

router = APIRouter()
translation_service = IndicTrans2Service()
pdf_service = PDFService(translation_service)

@router.post("/localize", response_model=PDFLocalizeResponse)
async def localize_pdf(request: PDFLocalizeRequest):
    try:
        out_path = pdf_service.localize_pdf(request.file_path)
        return PDFLocalizeResponse(original_path=request.file_path, localized_path=out_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
