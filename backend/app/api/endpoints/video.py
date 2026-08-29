"""Educational Video Localization API."""

from fastapi import APIRouter, HTTPException
from app.schemas.video import VideoLocalizeRequest, VideoLocalizeResponse
from app.services.video.video_service import VideoService
from app.services.translation.indictrans2_service import IndicTrans2Service

router = APIRouter()
translation_service = IndicTrans2Service()
video_service = VideoService(translation_service)


@router.post("/localize", response_model=VideoLocalizeResponse)
async def localize_video(request: VideoLocalizeRequest):
    """
    Online video localization: Translates video audio/transcripts from Hindi
    into Santali Ol Chiki subtitles and packages for offline download to tablet.
    """
    try:
        return video_service.localize_from_url_or_text(
            video_url=request.video_url or "",
            title=request.title or "Class 1 Mathematics: Counting 1-10 Video",
            transcript_text=request.transcript_text,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
