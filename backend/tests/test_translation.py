"""Tests for translation service."""

from app.services.translation.indictrans2_service import IndicTrans2Service


def test_translation_service_mock():
    """Test translation service with offline dictionary and fallback behavior."""
    service = IndicTrans2Service()

    # 1. Known classroom FLN greeting translates successfully
    result = service.translate("नमस्ते", "hin_Deva", "sat_Olck")
    assert result.source_text == "नमस्ते"
    assert result.success is True
    assert result.translated_text == "ᱡᱚᱦᱟᱨ"

    # 2. Number translation
    num_result = service.translate("पाँच", "hin_Deva", "sat_Olck")
    assert num_result.success is True
    assert "ᱢᱚᱬᱮ" in num_result.translated_text

    # 3. Cached lookup test
    cached_result = service.translate("नमस्ते", "hin_Deva", "sat_Olck")
    assert cached_result.cached is True
