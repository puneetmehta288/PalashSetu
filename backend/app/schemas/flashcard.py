from pydantic import BaseModel
from typing import List

class Flashcard(BaseModel):
    id: int
    hindi_text: str
    santali_text: str
    pronunciation_hint: str
    topic: str
    visual_description: str

class FlashcardGenerationRequest(BaseModel):
    topic: str = "Counting 1-10"
