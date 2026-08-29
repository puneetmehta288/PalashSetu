"""
Translation Service — Abstract Base Class and Result Model
============================================================
"""

from abc import ABC, abstractmethod
from typing import Optional
from dataclasses import dataclass, field


@dataclass
class TranslationResult:
    """Result of a translation request."""
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    model_name: str
    processing_time_ms: float
    success: bool
    error: Optional[str] = None
    cached: bool = False

    def to_dict(self) -> dict:
        return {
            "source_text": self.source_text,
            "translated_text": self.translated_text,
            "source_lang": self.source_lang,
            "target_lang": self.target_lang,
            "model_name": self.model_name,
            "processing_time_ms": self.processing_time_ms,
            "success": self.success,
            "error": self.error,
            "cached": self.cached,
        }


class TranslationService(ABC):
    """Abstract base class for translation services."""

    @abstractmethod
    def translate(
        self,
        text: str,
        source_lang: str = "hin_Deva",
        target_lang: str = "sat_Olck",
    ) -> TranslationResult:
        """Translate text from source to target language."""
        pass

    @abstractmethod
    def load_model(self) -> bool:
        """Load the translation model. Returns True on success."""
        pass

    @abstractmethod
    def get_status(self) -> dict:
        """Get current service status."""
        pass

    def unload_model(self):
        """Unload the model to free memory."""
        pass

    def translate_batch(
        self,
        texts: list[str],
        source_lang: str = "hin_Deva",
        target_lang: str = "sat_Olck",
    ) -> list[TranslationResult]:
        """Translate multiple texts. Default: iterate."""
        return [self.translate(t, source_lang, target_lang) for t in texts]
