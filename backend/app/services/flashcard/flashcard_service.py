from typing import List
from app.schemas.flashcard import Flashcard
from app.services.translation.translation_service import TranslationService

class FlashcardService:
    def __init__(self, translation_service: TranslationService):
        self.translation_service = translation_service

    def generate_flashcards(self, topic: str) -> List[Flashcard]:
        hindi_numbers = ["एक", "दो", "तीन", "चार", "पांच", "छह", "सात", "आठ", "नौ", "दस"]
        flashcards = []
        for i, word in enumerate(hindi_numbers):
            n = i + 1
            sat_word = self.translation_service.translate(word).translated_text
            flashcards.append(Flashcard(
                id=n,
                hindi_text=word,
                santali_text=sat_word,
                pronunciation_hint=f"Pronounce {n}",
                topic=topic,
                visual_description="🍎" * n
            ))
        return flashcards
