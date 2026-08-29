"""ASR (Speech Recognition) API endpoints."""

from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from pydantic import BaseModel
from app.services.asr.asr_service import ASRService

router = APIRouter()
asr_service = ASRService()


class ASRResponse(BaseModel):
    """Transcription response."""
    text: str
    latency_ms: float = 0.0
    offline: bool = True
    provider: str = "Local Offline ASR"


@router.post("/transcribe", response_model=ASRResponse)
async def transcribe_audio_file(
    file: UploadFile = File(...),
):
    """
    Transcribe raw audio file uploaded from microphone.
    Runs locally on the machine with zero cloud connectivity required.
    """
    contents = await file.read()
    text, latency = asr_service.transcribe_audio_bytes(contents, file.filename or "recording.webm")
    return ASRResponse(
        text=text,
        latency_ms=latency,
        offline=True,
        provider="Local Offline ASR (Whisper Architecture)",
    )
