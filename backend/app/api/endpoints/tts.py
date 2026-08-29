from fastapi import APIRouter
from pydantic import BaseModel
from app.services.tts.tts_service import TTSService

router = APIRouter()
tts_service = TTSService()

class TTSRequest(BaseModel):
    text: str
    lang: str = "hi"

@router.post("/generate")
async def generate_tts(request: TTSRequest):
    filepath = tts_service.generate_audio(request.text, request.lang, f"{hash(request.text)}.mp3")
    return {"audio_path": filepath}
