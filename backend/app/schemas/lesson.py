from pydantic import BaseModel
from typing import List, Optional

class LessonSection(BaseModel):
    title_hin: str
    title_sat: str
    content_hin: str
    content_sat: str
    duration_minutes: int

class AssessmentPrompt(BaseModel):
    question_hin: str
    question_sat: str
    answer_hin: str
    answer_sat: str

class LessonGenerationRequest(BaseModel):
    topic: str = "Counting 1-10"
    grade: str = "Class 1"
    subject: str = "Mathematics"

class Lesson(BaseModel):
    id: Optional[int] = None
    title_hin: str
    title_sat: str
    grade: Optional[str] = "Class 1"
    subject: Optional[str] = "Mathematics"
    objective_hin: str
    objective_sat: str
    warmup_hin: Optional[str] = None
    warmup_sat: Optional[str] = None
    teacher_script_hin: Optional[str] = None
    teacher_script_sat: Optional[str] = None
    activity_hin: Optional[str] = None
    activity_sat: Optional[str] = None
    assessment_prompts: Optional[List[AssessmentPrompt]] = []
    sections: List[LessonSection]
