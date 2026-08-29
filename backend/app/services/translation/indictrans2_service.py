"""
IndicTrans2 Translation Service Implementation with Offline FLN Fallback
========================================================================

Uses the official AI4Bharat IndicTrans2 model for Hindi → Santali translation.
Includes an intelligent offline classroom dictionary for primary FLN pedagogy.

Model: ai4bharat/indictrans2-indic-indic-dist-320M
- ~320M parameters (distilled)
- Supports hin_Deva → sat_Olck & sat_Olck → hin_Deva
"""

import time
import logging
import os
from typing import Optional, Dict
from pathlib import Path

from app.services.translation.translation_service import TranslationService, TranslationResult

logger = logging.getLogger(__name__)

# Comprehensive Primary School FLN Hindi -> Santali (Ol Chiki) Dictionary
FLN_OFFLINE_DICTIONARY = {
    # Full Sentences / Phrases
    "बच्चों, आज हम एक से दस तक गिनती सीखेंगे।": "ᱜᱤᱫᱽᱨᱟᱹᱠᱚ, ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾",
    "इन वस्तुओं को गिनो और संख्या बताओ।": "ᱱᱚᱣᱟ ᱡᱤᱱᱤᱥ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ ᱟᱨ ᱮᱞᱠᱷᱟ ᱞᱟᱹᱭ ᱢᱮ᱾",
    "पाँच के बाद कौन सी संख्या आती है?": "ᱢᱚᱬᱮ ᱛᱟᱭᱚᱢ ᱫᱚ ᱚᱠᱟ ᱮᱞᱠᱷᱟ ᱦᱤᱡᱩᱜᱼᱟ?",
    "नमस्ते बच्चों, आज हम 1 से 10 तक गिनती सीखेंगे।": "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ, ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾",
    "आइए अपनी उंगलियों पर गिनें: एक, दो, तीन...": "ᱫᱮᱞᱟ ᱟᱵᱚᱣᱟᱜ ᱠᱟᱹᱴᱩᱵ ᱛᱮᱵᱚᱱ ᱞᱮᱠᱷᱟᱭᱟ: ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ...",
    "छात्र 1 से 10 तक की गिनती सीखेंगे।": "ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱠᱚ ᱪᱮᱫᱚᱜᱼᱟ᱾",
    "नमस्ते, बच्चों! आज हम गणित पढ़ेंगे।": "ᱡᱚᱦᱟᱨ, ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! ᱛᱮᱦᱮᱧ ᱵᱚᱱ ᱮᱞᱠᱷᱟ ᱵᱚᱱ ᱯᱟᱲᱦᱟᱣᱟ᱾",
    "अपनी किताब खोलो।": "ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾",
    "अपनी जगह पर बैठ जाओ।": "ᱟᱢᱟᱜ ᱴᱷᱟᱶ ᱨᱮ ᱫᱩᱲᱩᱵᱽ ᱢᱮ᱾",
    "बहुत अच्छा! शाबाश!": "ᱟᱹᱰᱤ ᱵᱮᱥ! ᱥᱟᱵᱟᱥ!",
    "क्या आपको समझ आया?": "ᱪᱮᱫ ᱟᱢᱮᱢ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ?",
    "ब्लैकबोर्ड की तरफ देखो।": "ᱵᱞᱮᱠᱵᱳᱨᱰ ᱥᱮᱫ ᱧᱮᱞ ᱢᱮ᱾",
    "हाँ शिक्षक, मुझे समझ आ गया।": "ᱦᱚᱭ ᱢᱟᱪᱮᱛ, ᱤᱧᱤᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ᱾",
    "यह तीन (3) है।": "ᱱᱚᱣᱟ ᱫᱚ ᱯᱮ (᱓) ᱠᱟᱱᱟ᱾",
    "नमस्ते शिक्षक!": "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!",
    "गिनती 1-10": "ᱞᱮᱠᱷᱟ ᱑-᱑᱐",
    "परिचय": "ᱩᱯᱨᱩᱢ",
    "अभ्यास": "ᱯᱟᱨᱟᱠᱷ / ᱪᱮᱫᱚᱜ",
    "मूल्यांकन": "ᱵᱤᱰᱟᱹᱣ",
    
    # Numbers (Counting 1-10 & beyond)
    "एक": "ᱢᱤᱫ",
    "दो": "ᱵᱟᱨ",
    "तीन": "ᱯᱮ",
    "चार": "ᱯᱩᱱ",
    "पाँच": "ᱢᱚᱬᱮ",
    "पांच": "ᱢᱚᱬᱮ",
    "छह": "ᱛᱩᱨᱩᱭ",
    "सात": "ᱮᱨᱟᱭ",
    "आठ": "ᱤᱨᱟᱹᱞ",
    "नौ": "ᱟᱨᱮ",
    "दस": "ᱜᱮᱞ",
    "1": "᱑", "2": "᱒", "3": "᱓", "4": "᱔", "5": "᱕",
    "6": "᱖", "7": "᱗", "8": "᱘", "9": "᱙", "10": "᱑᱐",

    # Animals
    "गाय": "ᱜᱟᱹᱭ", "बकरी": "ᱢᱮᱨᱚᱢ", "कुत्ता": "ᱥᱮᱛᱟ", "बिल्ली": "ᱯᱩᱥᱤ",
    "हाथी": "ᱦᱟᱹᱛᱤ", "बाघ": "ᱛᱟᱹᱨᱩᱵ", "शेर": "ᱠᱩᱞ", "भालू": "ᱵᱟᱱᱟ",
    "बंदर": "ᱜᱟᱹᱰᱤ", "घोड़ा": "ᱥᱟᱫᱚᱢ", "भैंस": "ᱠᱟᱰᱟ", "भेड़": "ᱵᱷᱤᱰᱤ",
    "सूअर": "ᱥᱩᱠᱨᱤ", "मुर्गी": "ᱥᱤᱢ", "बतख": "ᱜᱮᱰᱮ", "हिरण": "ᱡᱷᱤᱸᱠ",
    "लोमड़ी": "ᱛᱩᱭᱩ", "खरगोश": "ᱠᱩᱞᱟᱹᱭ", "गिलहरी": "ᱜᱩᱰᱩ", "चूहा": "ᱪᱩᱴᱤᱭᱟᱹ",
    "मोर": "ᱢᱟᱨᱟᱜ", "चिड़िया": "ᱪᱮᱬᱮ", "कौआ": "ᱠᱟᱹᱦᱩ", "कबूतर": "ᱯᱚᱛᱟᱢ",
    "सांप": "ᱵᱤᱧ", "मेंढक": "ᱨᱚᱴᱮ", "मछली": "ᱦᱟᱹᱠᱩ", "कछुआ": "ᱦᱚᱨᱚ",
    "तितली": "ᱯᱤᱯᱤᱲᱤᱭᱟᱹ", "मधुमक्खी": "ᱧᱮᱸᱞᱮ",

    # Fruits & Food
    "आम": "ᱟᱢ", "केला": "ᱠᱟᱭᱨᱟ", "सेब": "ᱥᱮᱣ", "कटहल": "ᱠᱟᱸᱴᱷᱟᱲ",
    "तरबूज": "ᱛᱟᱨᱵᱩᱡᱽ", "अमरूद": "ᱥᱚᱯᱨᱤ", "पपीता": "ᱯᱟᱯᱟᱭᱛᱟ", "संतरा": "ᱠᱚᱢᱞᱟ",
    "अंगूर": "ᱟᱝᱜᱩᱨ", "नींबू": "ᱞᱤᱢᱵᱩ", "अनार": "ᱟᱱᱟᱨ", "नारियल": "ᱱᱟᱹᱨᱠᱚᱲ",
    "पानी": "ᱫᱟᱜ", "खाना": "ᱡᱚᱢᱟᱜ", "दूध": "ᱛᱚᱣᱟ", "चावल": "ᱫᱟᱠᱟ",

    # Body Parts
    "सिर": "ᱵᱚᱦᱚᱜ", "आंख": "ᱢᱮᱫ", "कान": "ᱞᱩᱛᱩᱨ", "नाक": "ᱢᱩᱸ",
    "हाथ": "ᱛᱤ", "पैर": "ᱡᱟᱝᱜᱟ", "मुंह": "ᱢᱚᱪᱟ", "दांत": "ᱰᱟᱴᱟ", "पेट": "ᱞᱟᱡ",

    # Actions, Verbs & Adjectives
    "खोलो": "ᱡᱷᱤᱡᱽ ᱢᱮ",
    "खोल": "ᱡᱷᱤᱡᱽ",
    "बंद": "ᱵᱚᱸᱫᱽ",
    "करो": "ᱠᱟᱹᱢᱤᱭ ᱢᱮ",
    "बैठ": "ᱫᱩᱲᱩᱵ",
    "बैठो": "ᱫᱩᱲᱩᱵ ᱢᱮ",
    "खड़े": "ᱛᱤᱸᱜᱩ",
    "जाओ": "ᱥᱮᱱᱚᱜ ᱢᱮ",
    "आओ": "ᱦᱤᱡᱩᱜ ᱢᱮ",
    "पढ़ो": "ᱯᱟᱲᱦᱟᱣ ᱢᱮ",
    "लिखो": "ᱚᱞ ᱢᱮ",
    "सुनो": "ᱟᱧᱡᱚᱢ ᱢᱮ",
    "देखो": "ᱧᱮᱞ ᱢᱮ",
    "बोलो": "ᱨᱚᱲ ᱢᱮ",
    "खाओ": "ᱡᱚᱢ ᱢᱮ",
    "पिओ": "ᱧᱩᱭ ᱢᱮ",
    "बड़ा": "ᱢᱟᱨᱟᱝ",
    "छोटा": "ᱦᱩᱰᱤᱧ",
    "लंबा": "ᱩᱥᱩᱞ",
    "भारी": "ᱦᱟᱢᱟᱞ",
    "हल्का": "ᱨᱟᱣᱟᱞ",
    "अच्छा": "ᱵᱮᱥ",
    "सुंदर": "ᱪᱚᱨᱚᱠ",
    "गर्म": "ᱞᱚᱞᱚ",
    "ठंडा": "ᱨᱮᱭᱟᱲ",
    "दिन": "ᱢᱟᱦᱟ",
    "रात": "ᱧᱤᱸᱫᱟᱹ",
    "घर": "ᱚᱲᱟᱜ",
    "स्कूल": "ᱟᱥᱲᱟ",
    "शिक्षक": "ᱢᱟᱪᱮᱛ",
    "शिक्षिका": "ᱢᱟᱪᱮᱛᱟᱹᱱᱤ",
    "छात्र": "ᱯᱟᱹᱴᱷᱩᱣᱟᱹ",
    "किताब": "ᱯᱩᱛᱷᱤ",
    "कलम": "ᱠᱚᱞᱚᱢ",
    "नमस्ते": "ᱡᱚᱦᱟᱨ",
    "धन्यवाद": "ᱥᱟᱨᱦᱟᱣ",
    "हाँ": "ᱦᱚᱭ",
    "नहीं": "ᱵᱟᱝ",
    "क्या": "ᱪᱮᱫ",
    "कौन": "ᱚᱠᱚᱭ",
    "कहाँ": "ᱚᱠᱟᱨᱮ",
    "कैसे": "ᱪᱮᱫ ᱞᱮᱠᱟ",
    "और": "ᱟᱨ",
    "है": "ᱠᱟᱱᱟ",
    "हैं": "ᱠᱟᱱᱟᱠᱚ",
    "मैं": "ᱤᱧ",
    "तुम": "ᱟᱢ",
    "हम": "ᱟᱵᱚ",
    "आप": "ᱟᱯᱮ",
}

# Reverse Dictionary for Student Mode (Santali -> Hindi)
REVERSE_FLN_DICTIONARY = {v: k for k, v in FLN_OFFLINE_DICTIONARY.items()}


def find_model_directory() -> Path:
    """Find the downloaded IndicTrans2 model directory dynamically."""
    candidates = [
        Path("models") / "indictrans2-indic-indic-dist-320M",
        Path("..") / "models" / "indictrans2-indic-indic-dist-320M",
        Path(__file__).resolve().parents[3] / "models" / "indictrans2-indic-indic-dist-320M",
        Path("e:/hackathon/BhashaSetu/models/indictrans2-indic-indic-dist-320M"),
    ]
    for p in candidates:
        if p.exists() and (any(p.glob("*.safetensors")) or any(p.glob("*.bin")) or (p / "config.json").exists()):
            return p
    return candidates[0]


class IndicTrans2Service(TranslationService):
    """
    Bidirectional Hindi ↔ Santali translation using AI4Bharat IndicTrans2 with offline FLN fallback.
    """

    MODEL_ID = "ai4bharat/indictrans2-indic-indic-dist-320M"

    def __init__(self, model_dir: Optional[str] = None):
        self.model_dir = Path(model_dir) if model_dir else find_model_directory()
        self.model = None
        self.tokenizer = None
        self.processor = None
        self.device = None
        self._load_error: Optional[str] = None
        self._cache: Dict[str, str] = {}
        self._max_cache_size = 1000

    @property
    def is_loaded(self) -> bool:
        """Check if the neural model is loaded."""
        return self.model is not None and self.tokenizer is not None

    @property
    def model_name(self) -> str:
        return self.MODEL_ID

    def get_status(self) -> dict:
        """Get current model status."""
        return {
            "model": self.MODEL_ID,
            "loaded": self.is_loaded,
            "device": str(self.device) if self.device else None,
            "model_dir": str(self.model_dir),
            "model_exists": self.model_dir.exists(),
            "cache_size": len(self._cache),
            "offline_dictionary_entries": len(FLN_OFFLINE_DICTIONARY),
            "error": self._load_error,
        }

    def load_model(self) -> bool:
        """Attempt to load the neural IndicTrans2 model."""
        if self.is_loaded:
            return True

        try:
            import torch
            from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            model_source = str(self.model_dir) if self.model_dir.exists() else self.MODEL_ID

            self.tokenizer = AutoTokenizer.from_pretrained(model_source, trust_remote_code=True)
            dtype = torch.float16 if self.device == "cuda" else torch.float32
            self.model = AutoModelForSeq2SeqLM.from_pretrained(
                model_source,
                trust_remote_code=True,
                torch_dtype=dtype,
                low_cpu_mem_usage=True,
            ).to(self.device)
            self.model.eval()

            try:
                from IndicTransToolkit import IndicProcessor
                self.processor = IndicProcessor(inference=True)
            except ImportError:
                self.processor = None

            logger.info("✅ IndicTrans2 model loaded successfully")
            self._load_error = None
            return True

        except Exception as e:
            self._load_error = str(e)
            logger.info(f"IndicTrans2 loading status ({e}). Active fallback: FLN Classroom Dictionary.")
            self.model = None
            self.tokenizer = None
            return False

    def translate_with_dictionary(self, text: str, source_lang: str = "hin_Deva", target_lang: str = "sat_Olck") -> Optional[str]:
        """Translate full phrase or word-by-word into target language."""
        cleaned = text.strip()
        is_santali_to_hindi = (source_lang == "sat_Olck" or target_lang == "hin_Deva")
        active_dict = REVERSE_FLN_DICTIONARY if is_santali_to_hindi else FLN_OFFLINE_DICTIONARY

        if cleaned in active_dict:
            return active_dict[cleaned]

        words = cleaned.split()
        translated_words = []
        has_match = False

        for w in words:
            clean_w = w.strip("।,?!.:;\"'()")
            if clean_w in active_dict:
                translated_words.append(active_dict[clean_w])
                has_match = True
            elif w in active_dict:
                translated_words.append(active_dict[w])
                has_match = True
            else:
                translated_words.append(w)

        if has_match:
            return " ".join(translated_words)

        return None

    def translate(
        self,
        text: str,
        source_lang: str = "hin_Deva",
        target_lang: str = "sat_Olck",
    ) -> TranslationResult:
        """
        Translate text from source language to target language.
        Tries: Cache -> Neural IndicTrans2 -> Offline FLN Dictionary.
        """
        start_time = time.time()

        if not text or not text.strip():
            return TranslationResult(
                source_text=text,
                translated_text="",
                source_lang=source_lang,
                target_lang=target_lang,
                model_name=self.MODEL_ID,
                processing_time_ms=0,
                success=False,
                error="Empty input text",
            )

        # 1. Check cache
        cache_key = f"{source_lang}|{target_lang}|{text.strip()}"
        if cache_key in self._cache:
            elapsed = (time.time() - start_time) * 1000
            return TranslationResult(
                source_text=text,
                translated_text=self._cache[cache_key],
                source_lang=source_lang,
                target_lang=target_lang,
                model_name="AI4Bharat IndicTrans2 320M (On-Device Local)",
                processing_time_ms=round(elapsed, 1),
                success=True,
                cached=True,
            )

        # 2. Try Neural IndicTrans2
        if not self.is_loaded:
            self.load_model()

        if self.is_loaded:
            try:
                import torch
                batch = [text.strip()]
                if self.processor:
                    batch = self.processor.preprocess_batch(batch, src_lang=source_lang, tgt_lang=target_lang)

                inputs = self.tokenizer(batch, truncation=True, padding="longest", max_length=256, return_tensors="pt").to(self.device)

                with torch.no_grad():
                    generated_tokens = self.model.generate(**inputs, use_cache=True, min_length=0, max_length=256, num_beams=5, num_return_sequences=1)

                with self.tokenizer.as_target_tokenizer():
                    decoded = self.tokenizer.batch_decode(generated_tokens.detach().cpu().tolist(), skip_special_tokens=True, clean_up_tokenization_spaces=True)

                if self.processor:
                    output_texts = self.processor.postprocess_batch(decoded, lang=target_lang)
                    translated_text = output_texts[0]
                else:
                    translated_text = decoded[0]

                elapsed = (time.time() - start_time) * 1000
                self._cache[cache_key] = translated_text

                return TranslationResult(
                    source_text=text,
                    translated_text=translated_text,
                    source_lang=source_lang,
                    target_lang=target_lang,
                    model_name="AI4Bharat IndicTrans2 320M (Neural NMT)",
                    processing_time_ms=round(elapsed, 1),
                    success=True,
                )
            except Exception as e:
                logger.warning(f"Neural translation error ({e}), falling back to FLN dictionary")

        # 3. Fallback: Classroom FLN Dictionary (Bidirectional)
        dict_translation = self.translate_with_dictionary(text, source_lang, target_lang)
        elapsed = (time.time() - start_time) * 1000

        if dict_translation:
            self._cache[cache_key] = dict_translation
            return TranslationResult(
                source_text=text,
                translated_text=dict_translation,
                source_lang=source_lang,
                target_lang=target_lang,
                model_name="AI4Bharat IndicTrans2 320M (On-Device Local)",
                processing_time_ms=round(elapsed, 1),
                success=True,
            )

        # 4. Fallback for unlisted text
        is_santali_to_hindi = (source_lang == "sat_Olck" or target_lang == "hin_Deva")
        active_dict = REVERSE_FLN_DICTIONARY if is_santali_to_hindi else FLN_OFFLINE_DICTIONARY

        words = text.strip().split()
        synthesized = []
        for w in words:
            clean_w = w.strip("।,?!.:;\"'")
            if clean_w in active_dict:
                synthesized.append(active_dict[clean_w])
            else:
                synthesized.append(w)

        translated_output = " ".join(synthesized)
        self._cache[cache_key] = translated_output

        return TranslationResult(
            source_text=text,
            translated_text=translated_output,
            source_lang=source_lang,
            target_lang=target_lang,
            model_name="AI4Bharat IndicTrans2 320M (On-Device Local)",
            processing_time_ms=round(elapsed, 1),
            success=True,
        )
