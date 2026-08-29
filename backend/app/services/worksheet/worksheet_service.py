import random
from typing import List
from app.schemas.worksheet import Worksheet, Question
from app.services.translation.translation_service import TranslationService

class WorksheetService:
    def __init__(self, translation_service: TranslationService):
        self.translation_service = translation_service

    def generate_worksheet(self, topic: str, num_questions: int = 5) -> Worksheet:
        questions = []
        for i in range(1, num_questions + 1):
            n = random.randint(1, 10)
            q_hin = f"यह संख्या क्या है? {'🍎' * n}"
            q_sat = self.translation_service.translate(q_hin).translated_text
            questions.append(Question(
                hindi_text=q_hin,
                santali_text=q_sat,
                answer=str(n),
                question_type="counting",
                difficulty="easy"
            ))

        return Worksheet(
            title_hin="गिनती अभ्यास",
            title_sat=self.translation_service.translate("गिनती अभ्यास").translated_text,
            questions=questions,
            grade="Class 1",
            subject="Mathematics",
            topic=topic,
            difficulty="easy"
        )
