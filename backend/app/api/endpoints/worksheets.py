from fastapi import APIRouter
from app.schemas.worksheet import WorksheetGenerationRequest, Worksheet
from app.services.worksheet.worksheet_service import WorksheetService
from app.services.translation.indictrans2_service import IndicTrans2Service

router = APIRouter()
translation_service = IndicTrans2Service()
worksheet_service = WorksheetService(translation_service)

@router.post("/generate", response_model=Worksheet)
async def generate_worksheet(request: WorksheetGenerationRequest):
    return worksheet_service.generate_worksheet(request.topic, request.num_questions)

@router.get("", response_model=list[Worksheet])
async def list_worksheets():
    return []

@router.get("/{id}", response_model=Worksheet)
async def get_worksheet(id: int):
    return worksheet_service.generate_worksheet("Counting 1-10", 5)
