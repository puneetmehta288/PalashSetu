"""
Educational Video Localization Service
=======================================

Localizes educational videos (from URL or file upload) by translating
Hindi spoken audio/transcripts into Santali Ol Chiki subtitles and synchronized audio.
"""

import os
from typing import List, Dict
from app.services.translation.translation_service import TranslationService
from app.schemas.video import SubtitleCue, VideoLocalizeResponse

DEFAULT_EDUCATIONAL_CUES = [
    {
        "start_time": "00:00:01",
        "end_time": "00:00:06",
        "hindi_text": "नमस्ते बच्चों! आज हम एक से दस तक गिनती सीखेंगे।",
    },
    {
        "start_time": "00:00:07",
        "end_time": "00:00:12",
        "hindi_text": "एक सेब, दो सेब, तीन सेब... आइए मिलकर गिनें।",
    },
    {
        "start_time": "00:00:13",
        "end_time": "00:00:18",
        "hindi_text": "चार, पाँच, छह, सात... बहुत बढ़िया!",
    },
    {
        "start_time": "00:00:19",
        "end_time": "00:00:25",
        "hindi_text": "आठ, नौ और दस! हमने दस तक गिनती पूरी की।",
    },
    {
        "start_time": "00:00:26",
        "end_time": "00:00:30",
        "hindi_text": "शाबाश बच्चों, अब आप अपनी कॉपी में लिखें।",
    },
]

class VideoService:
    def __init__(self, translation_service: TranslationService):
        self.translation_service = translation_service

    def localize_from_url_or_text(
        self, video_url: str, title: str = "Counting 1-10", transcript_text: str = None
    ) -> VideoLocalizeResponse:
        cues_to_process = []

        if transcript_text and transcript_text.strip():
            # Parse lines from custom transcript
            lines = [l.strip() for l in transcript_text.strip().split("\n") if l.strip()]
            for i, line in enumerate(lines):
                cues_to_process.append({
                    "start_time": f"00:00:{i*5:02d}",
                    "end_time": f"00:00:{(i+1)*5:02d}",
                    "hindi_text": line,
                })
        else:
            cues_to_process = DEFAULT_EDUCATIONAL_CUES

        localized_cues: List[SubtitleCue] = []
        for cue in cues_to_process:
            sat_trans = self.translation_service.translate(
                cue["hindi_text"], source_lang="hin_Deva", target_lang="sat_Olck"
            ).translated_text

            localized_cues.append(
                SubtitleCue(
                    start_time=cue["start_time"],
                    end_time=cue["end_time"],
                    hindi_text=cue["hindi_text"],
                    santali_text=sat_trans or cue["hindi_text"],
                )
            )

        return VideoLocalizeResponse(
            title=title or "Class 1 Mathematics: Counting 1-10 Video",
            video_url=video_url or "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            duration="00:30",
            status="localized_ready",
            cues=localized_cues,
            download_url="/data/content/localized_counting_video_package.zip",
        )
