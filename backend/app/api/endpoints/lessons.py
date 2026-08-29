from fastapi import APIRouter, Depends
from app.schemas.lesson import LessonGenerationRequest, Lesson
from app.services.lesson.lesson_service import LessonService
from app.services.translation.indictrans2_service import IndicTrans2Service

router = APIRouter()
translation_service = IndicTrans2Service()
lesson_service = LessonService(translation_service)

@router.post("/generate", response_model=Lesson)
async def generate_lesson(request: LessonGenerationRequest):
    return lesson_service.generate_counting_lesson()

@router.get("", response_model=list[Lesson])
async def list_lessons():
    return []

@router.get("/{id}", response_model=Lesson)
async def get_lesson(id: int):
    return lesson_service.generate_counting_lesson()
