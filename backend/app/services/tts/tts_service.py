import os
from gtts import gTTS

class TTSService:
    def __init__(self, audio_dir: str = "./data/audio"):
        self.audio_dir = audio_dir
        os.makedirs(self.audio_dir, exist_ok=True)

    def generate_audio(self, text: str, lang: str = "hi", filename: str = "audio.mp3") -> str:
        filepath = os.path.join(self.audio_dir, filename)
        if not os.path.exists(filepath):
            if lang == "sat":
                # Mark as NEEDS VERIFICATION since gTTS doesn't formally support Santali
                lang = "hi"
            tts = gTTS(text=text, lang=lang)
            tts.save(filepath)
        return filepath
