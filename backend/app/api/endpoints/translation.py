"""Translation API endpoints."""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter()


class TranslateRequest(BaseModel):
    """Translation request body supporting both 'text' and 'source_text'."""
    text: Optional[str] = None
    source_text: Optional[str] = None
    source_lang: str = "hin_Deva"
    target_lang: str = "sat_Olck"


class TranslateResponse(BaseModel):
    """Translation response body."""
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    model_name: str
    processing_time_ms: float
    success: bool
    error: Optional[str] = None
    cached: bool = False


# Lazy singleton
_service = None

def _get_service():
    global _service
    if _service is None:
        from app.services.translation.indictrans2_service import IndicTrans2Service
        _service = IndicTrans2Service()
    return _service


@router.post("/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    """Translate text from source to target language."""
    input_text = request.text or request.source_text or ""
    service = _get_service()
    result = service.translate(input_text, request.source_lang, request.target_lang)
    return TranslateResponse(
        source_text=result.source_text,
        translated_text=result.translated_text,
        source_lang=result.source_lang,
        target_lang=result.target_lang,
        model_name=result.model_name,
        processing_time_ms=result.processing_time_ms,
        success=result.success,
        error=result.error,
        cached=result.cached,
    )


@router.get("/status")
async def translation_status():
    """Get translation model status."""
    service = _get_service()
    return service.get_status()
