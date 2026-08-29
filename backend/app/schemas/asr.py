from pydantic import BaseModel

class ASRRequest(BaseModel):
    audio_path: str

class ASRResponse(BaseModel):
    text: str
