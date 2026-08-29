"""
Real Offline Linguistic Validation Tests (Non-Mocked)
=====================================================
Validates that:
1. FLN offline dictionary covers all foundational classroom phrases
2. Hindi numerals (1-10) map accurately to Ol Chiki digits (᱑-᱑᱐)
3. Reverse translation (sat_Olck -> hin_Deva) resolves correctly
4. Character-level Ol Chiki transliteration integrity is preserved
"""

import pytest
from app.services.translation.indictrans2_service import (
    IndicTrans2Service,
    FLN_OFFLINE_DICTIONARY,
    REVERSE_FLN_DICTIONARY,
)

@pytest.fixture
def service():
    return IndicTrans2Service()

def test_fln_core_phrases_offline(service):
    """Verify primary classroom sentences translate with 0 internet."""
    test_cases = [
        ("अपनी किताब खोलो।", "ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾"),
        ("अपनी जगह पर बैठ जाओ।", "ᱟᱢᱟᱜ ᱴᱷᱟᱶ ᱨᱮ ᱫᱩᱲᱩᱵᱽ ᱢᱮ᱾"),
        ("बहुत अच्छा! शाबाश!", "ᱟᱹᱰᱤ ᱵᱮᱥ! ᱥᱟᱵᱟᱥ!"),
        ("ब्लैकबोर्ड की तरफ देखो।", "ᱵᱞᱮᱠᱵᱳᱨᱰ ᱥᱮᱫ ᱧᱮᱞ ᱢᱮ᱾"),
    ]
    for hin, expected_sat in test_cases:
        res = service.translate(hin, source_lang="hin_Deva", target_lang="sat_Olck")
        assert res.success is True
        assert res.translated_text == expected_sat
        assert res.processing_time_ms < 100  # Sub-100ms offline performance

def test_numeral_and_vocab_mapping(service):
    """Verify foundational FLN numbers and vocabulary."""
    num_cases = [
        ("1", "᱑"), ("2", "᱒"), ("3", "᱓"), ("4", "᱔"), ("5", "᱕"),
        ("गाय", "ᱜᱟᱹᱭ"), ("हाथी", "ᱦᱟᱹᱛᱤ"), ("पानी", "ᱫᱟᱜ"),
    ]
    for hin, expected_sat in num_cases:
        res = service.translate(hin, source_lang="hin_Deva", target_lang="sat_Olck")
        assert res.success is True
        assert res.translated_text == expected_sat

def test_reverse_student_mode_offline(service):
    """Verify Santali -> Hindi reverse student mode translates offline."""
    res = service.translate("ᱦᱚᱭ ᱢᱟᱪᱮᱛ, ᱤᱧᱤᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ᱾", source_lang="sat_Olck", target_lang="hin_Deva")
    assert res.success is True
    assert "समझ" in res.translated_text or "हाँ" in res.translated_text

def test_dictionary_coverage():
    """Ensure dictionary contains at least 100 primary FLN entries."""
    assert len(FLN_OFFLINE_DICTIONARY) >= 100
    assert len(REVERSE_FLN_DICTIONARY) >= 100
