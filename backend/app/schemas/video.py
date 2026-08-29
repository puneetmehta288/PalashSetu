from pydantic import BaseModel
from typing import List, Optional

class SubtitleCue(BaseModel):
    start_time: str
    end_time: str
    hindi_text: str
    santali_text: str

class VideoLocalizeRequest(BaseModel):
    video_url: Optional[str] = None
    title: Optional[str] = "Class 1 Mathematics: Counting 1-10"
    transcript_text: Optional[str] = None

class VideoLocalizeResponse(BaseModel):
    title: str
    video_url: str
    duration: str
    status: str
    cues: List[SubtitleCue]
    download_url: str
