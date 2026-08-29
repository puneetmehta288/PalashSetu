import json
from typing import List, Dict
from app.schemas.lesson import Lesson, LessonSection, AssessmentPrompt
from app.services.translation.translation_service import TranslationService

class LessonService:
    def __init__(self, translation_service: TranslationService):
        self.translation_service = translation_service

    def generate_lesson(self, topic: str = "Counting 1-10", grade: str = "Class 1", subject: str = "Mathematics") -> Lesson:
        title_hin = f"{grade} {subject}: {topic}"
        title_sat = self.translation_service.translate(title_hin).translated_text

        # 1. Objectives
        obj_hin = f"छात्र {topic} की बुनियादी अवधारणाओं को समझेंगे और अपने दैनिक जीवन में प्रयोग करेंगे।"
        obj_sat = self.translation_service.translate(obj_hin).translated_text

        # 2. Warmup & Greetings
        warmup_hin = "नमस्ते बच्चों! सब बच्चे अपनी जगह पर बैठें और हाथ उठाकर जोहार बोलें।"
        warmup_sat = "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ! ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱯᱱᱟᱨᱟᱜ ᱴᱷᱟᱶ ᱨᱮ ᱫᱩᱲᱩᱵᱽ ᱯᱮ ᱟᱨ ᱛᱤ ᱛᱩᱞ ᱠᱟᱛᱮ ᱡᱚᱦᱟᱨ ᱢᱮᱱ ᱯᱮ᱾"

        # 3. Teacher Script
        script_hin = "शिक्षिका: 'आज हम सब मिलकर 1 से 10 तक गिनती सीखेंगे। यह एक सेब है (1), यह दो सेब हैं (2)...'"
        script_sat = "ᱢᱟᱪᱮᱛ: 'ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱥᱟᱱᱟᱢ ᱠᱚ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱝ ᱥᱮᱣ (᱑), ᱱᱚᱣᱟ ᱫᱚ ᱵᱟᱨᱭᱟ ᱥᱮᱣ (᱒)...'"

        # 4. Activity Instructions
        activity_hin = "गतिविधि: सभी बच्चे अपने बस्ते से 5 पेंसिल निकालें और 1 से 5 तक गिनकर दिखाएं।"
        activity_sat = "ᱠᱟᱹᱢᱤᱦᱚᱨᱟ: ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱠᱚᱣᱟᱜ ᱵᱮᱜᱽ ᱠᱷᱚᱱ ᱕ ᱴᱤ ᱯᱮᱱᱥᱤᱞ ᱚᱰᱚᱠ ᱯᱮ ᱟᱨ ᱑ ᱠᱷᱚᱱ ᱕ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱩᱫᱩᱜ ᱯᱮ᱾"

        # 5. NIPUN Bharat Assessment Prompts & Oral Quiz
        assessment_prompts = [
            AssessmentPrompt(
                question_hin="प्रश्न 1: 3 के बाद कौन सी संख्या आती है?",
                question_sat="ᱠᱩᱠᱞᱤ ᱑: ᱯᱮ (᱓) ᱛᱟᱭᱚᱢ ᱚᱠᱟ ᱞᱮᱠᱷᱟ ᱦᱤᱡᱩᱜᱼᱟ?",
                answer_hin="उत्तर: 4 (चार)",
                answer_sat="ᱛᱮᱞᱟ: ᱯᱩᱱ (᱔)",
            ),
            AssessmentPrompt(
                question_hin="प्रश्न 2: अपने दोनों हाथों की उंगलियां गिनकर बताएं।",
                question_sat="ᱠᱩᱠᱞᱤ ᱒: ᱟᱢᱟᱜ ᱵᱟᱱᱟᱨ ᱛᱤ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱴᱩᱵ ᱞᱮᱠᱷᱟ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ᱾",
                answer_hin="उत्तर: 10 (दस)",
                answer_sat="ᱛᱮᱞᱟ: ᱜᱮᱞ (᱑᱐)",
            ),
            AssessmentPrompt(
                question_hin="प्रश्न 3: 5 सेब में से 2 सेब निकाल दिए जाएं तो कितने बचेंगे?",
                question_sat="ᱠᱩᱠᱞᱤ ᱓: ᱢᱚᱬᱮ (᱕) ᱥᱮᱣ ᱠᱷᱚᱱ ᱵᱟᱨᱭᱟ (᱒) ᱥᱮᱣ ᱚᱰᱚᱠ ᱞᱮᱠᱷᱟᱱ ᱛᱤᱱᱟᱹᱜ ᱥᱟᱨᱮᱲᱚᱜᱼᱟ?",
                answer_hin="उत्तर: 3 (तीन)",
                answer_sat="ᱛᱮᱞᱟ: ᱯᱮ (᱓)",
            ),
        ]

        sections = [
            LessonSection(title_hin="1. उद्देश्य", title_sat="᱑. ᱩᱫᱽᱫᱮᱥ", content_hin=obj_hin, content_sat=obj_sat, duration_minutes=5),
            LessonSection(title_hin="2. वार्मअप व अभिवादन", title_sat="᱒. ᱡᱚᱦᱟᱨ ᱟᱨ ᱮᱛᱚᱦᱚᱵ", content_hin=warmup_hin, content_sat=warmup_sat, duration_minutes=5),
            LessonSection(title_hin="3. शिक्षिका संवाद (Teacher Script)", title_sat="᱓. ᱢᱟᱪᱮᱛ ᱨᱚᱲ", content_hin=script_hin, content_sat=script_sat, duration_minutes=15),
            LessonSection(title_hin="4. कक्षा गतिविधि", title_sat="᱔. ᱠᱟᱹᱢᱤᱦᱚᱨᱟ", content_hin=activity_hin, content_sat=activity_sat, duration_minutes=10),
            LessonSection(title_hin="5. 🎯 निपुण मूल्यांकन प्रश्न", title_sat="᱕. 🎯 ᱱᱤᱯᱩᱱ ᱵᱤᱰᱟᱹᱣ ᱠᱩᱠᱞᱤ", content_hin="मौखिक प्रश्नोत्तरी व समझ की जांच", content_sat="ᱢᱚᱪᱟ ᱠᱩᱠᱞᱤ ᱟᱨ ᱵᱩᱡᱷᱟᱹᱣ ᱵᱤᱰᱟᱹᱣ", duration_minutes=10),
        ]

        return Lesson(
            title_hin=title_hin,
            title_sat=title_sat,
            grade=grade,
            subject=subject,
            objective_hin=obj_hin,
            objective_sat=obj_sat,
            warmup_hin=warmup_hin,
            warmup_sat=warmup_sat,
            teacher_script_hin=script_hin,
            teacher_script_sat=script_sat,
            activity_hin=activity_hin,
            activity_sat=activity_sat,
            assessment_prompts=assessment_prompts,
            sections=sections,
        )

    def generate_counting_lesson(self) -> Lesson:
        return self.generate_lesson()
