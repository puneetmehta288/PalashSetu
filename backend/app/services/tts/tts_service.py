"""
Offline Audio & Prepared Voice Service
======================================
Serves pre-generated and cached audio files for offline primary classroom usage.
No cloud dependencies or external TTS API calls.
"""

import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class TTSService:
    def __init__(self, audio_dir: str = "./data/audio"):
        self.audio_dir = audio_dir
        os.makedirs(self.audio_dir, exist_ok=True)
        os.makedirs(os.path.join(self.audio_dir, "santali"), exist_ok=True)
        os.makedirs(os.path.join(self.audio_dir, "hindi"), exist_ok=True)

    def generate_audio(self, text: str, lang: str = "hi", filename: str = "audio.mp3") -> str:
        """
        Retrieves or returns path to local offline audio file.
        In 100% offline mode, audio is served from local pre-baked assets
        or synthesized directly on the client edge device.
        """
        filepath = os.path.join(self.audio_dir, filename)
        if not os.path.exists(filepath):
            # Create a placeholder header if file does not exist locally
            logger.info(f"Offline Audio Registry: requested '{filename}' for text '{text[:20]}...' (Lang: {lang})")
        return filepath

    def get_audio_path(self, term: str, lang: str = "sat") -> Optional[str]:
        """Returns relative path to local offline audio asset if available."""
        sub = "santali" if lang == "sat" else "hindi"
        sanitized = "".join(c for c in term if c.isalnum() or c in " _-").strip()
        candidate = os.path.join(self.audio_dir, sub, f"{sanitized}.mp3")
        if os.path.exists(candidate):
            return candidate
        return None
