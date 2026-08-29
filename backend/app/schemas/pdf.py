from pydantic import BaseModel

class PDFLocalizeRequest(BaseModel):
    file_path: str

class PDFLocalizeResponse(BaseModel):
    original_path: str
    localized_path: str
