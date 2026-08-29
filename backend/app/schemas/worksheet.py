from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    hindi_text: str
    santali_text: str
    answer: str
    question_type: str
    difficulty: str

class WorksheetGenerationRequest(BaseModel):
    topic: str = "Counting 1-10"
    grade: str = "Class 1"
    subject: str = "Mathematics"
    difficulty: str = "easy"
    num_questions: int = 5

class Worksheet(BaseModel):
    id: Optional[int] = None
    title_hin: str
    title_sat: str
    questions: List[Question]
    grade: str
    subject: str
    topic: str
    difficulty: str
