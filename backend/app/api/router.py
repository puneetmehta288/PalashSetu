from fastapi import APIRouter
from app.api.endpoints import translation, lessons, tts, worksheets, flashcards, pdf, video, sync, asr

api_router = APIRouter()
api_router.include_router(translation.router, prefix="/translation", tags=["translation"])
api_router.include_router(translation.router, tags=["translation"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
api_router.include_router(tts.router, prefix="/tts", tags=["tts"])
api_router.include_router(worksheets.router, prefix="/worksheets", tags=["worksheets"])
api_router.include_router(flashcards.router, prefix="/flashcards", tags=["flashcards"])
api_router.include_router(pdf.router, prefix="/pdf", tags=["pdf"])
api_router.include_router(video.router, prefix="/video", tags=["video"])
api_router.include_router(sync.router, prefix="/sync", tags=["sync"])
api_router.include_router(asr.router, prefix="/asr", tags=["asr"])
