from fastapi import APIRouter
from typing import List
from app.schemas.flashcard import FlashcardGenerationRequest, Flashcard
from app.services.flashcard.flashcard_service import FlashcardService
from app.services.translation.indictrans2_service import IndicTrans2Service

router = APIRouter()
translation_service = IndicTrans2Service()
flashcard_service = FlashcardService(translation_service)

@router.post("/generate", response_model=List[Flashcard])
async def generate_flashcards(request: FlashcardGenerationRequest):
    return flashcard_service.generate_flashcards(request.topic)

@router.get("", response_model=List[Flashcard])
async def list_flashcards():
    return []

@router.get("/{topic}", response_model=List[Flashcard])
async def get_flashcards(topic: str):
    return flashcard_service.generate_flashcards(topic)
