# PalashSetu (पलाश सेतु)
### Standalone On-Device Tablet App for Mother Tongue-Based Multilingual Education (MTB-MLE)
**Smart India Hackathon 2026 — Problem Statement SIH 26042**  
*Govt. of Jharkhand • Department of School Education & Literacy*

---

## 1. Executive Summary & Problem Context

In rural and tribal primary classrooms across Jharkhand (particularly the Santhal Pargana, Kolhan, and Chotanagpur divisions), Hindi-speaking teachers face an acute communication barrier when instructing indigenous children whose mother tongue is **Santali** (written in the **Ol Chiki ᱚᱞ ᱪᱤᱠᱤ** script), **Ho**, or **Mundari**.

Most village primary schools, Anganwadis, and Balvatikas operate in areas with **intermittent or zero cellular connectivity** on budget government-issued Android tablets (typically 2 GB RAM).

**PalashSetu** bridges this linguistic divide through an **offline-first edge architecture**:
- **On-Device Mobile App**: An ultra-fast, zero-network rule-based linguistic and vocabulary engine running directly inside the Android tablet with sub-millisecond execution (<0.01 ms) and a tiny memory footprint.
- **Centralized Cloud Pipeline (Backend)**: An IndicTrans2 / PyTorch server framework designed for centralized batch content synthesis, curriculum generation, and administrative sync.

---

## 2. Supported Languages & Implementation Scope

To maintain academic and technical honesty before evaluation committees, our language support is structured into distinct tiers:

| Language | IANA Code | Script | Current Status | Implemented Content Scope |
|---|---|---|---|---|
| **Santali** | `sat_Olck` | **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)** | **Primary Flagship** | 7,503 curated offline vocabulary entries, 36 prewritten NIPUN lesson plans, 16 flashcard decks (96 cards), 27 dynamic math drills, dual-column JCERT reader, bundled offline TTF fonts. |
| **Ho** | `hoc_Deva` | **Devanagari (हो)** | **Pilot Dialect Pack** | ~175 core vocabulary entries, NIPUN counting 1–10, classroom directives, greeting patterns, and phonetic Devanagari acoustic readout. |
| **Mundari** | `unr_Deva` | **Devanagari (मुंडारी)** | **Pilot Dialect Pack** | ~175 core vocabulary entries, NIPUN counting 1–10, classroom directives, greeting patterns, and phonetic Devanagari acoustic readout. Standardized to official IANA code `unr`. |

---

## 3. Core Classroom Features

### 🎙️ 1. Live Classroom Translator & Phrasebook
- Real-time bidirectional translation between Hindi and tribal languages.
- Categorized classroom quick-phrases (Greetings, Classroom Commands, FLN Numeracy, Common Responses).
- Web Speech recognition input with text fallback and acoustic phonetic speech readout.

### 📚 2. NIPUN Bharat Lesson Studio
- 36 structured lesson plans covering FLN Mathematics and Literacy (Balvatika through Class 3).
- Implements the **Panchaadi (पञ्चापदी)** pedagogical sequence:
  1. *प्रस्तावना / एतोहोब* (Introduction & Warm-up)
  2. *सीधा शिक्षण / सोजे इतू* (Direct Teacher Instruction)
  3. *मार्गदर्शित अभ्यास / गोड़ो आभ्यास* (Guided Practice)
  4. *स्वतंत्र अभ्यास / ᱟᱯᱱᱟᱨ ᱟᱵᱷᱭᱟᱥ* (Independent Practice)
  5. *मूल्यांकन / जांच* (Formative Assessment Drills)

### 🃏 3. NIPUN Interactive Flashcards (All Grades Unlocked)
- 16 decks / 96 cards spanning **Balvatika, Class 1, Class 2, and Class 3**.
- Rich visual SVGs for shapes, dot counting (1–5), place value bundles, and multiplication tables.
- Audio pronunciation with tap-to-reveal answers in Santali, Ho, or Mundari.

### 📝 4. Dynamic Bilingual Worksheet Generator
- Generates randomized arithmetic drills, counting grids, matching exercises, and word problems.
- Supports instant printable A4 PDF export with bilingual headers.

### 📖 5. JCERT Bilingual Textbook Reader
- Dual-column side-by-side reading layout (Hindi on the left, Tribal script on the right).
- Interactive word-level vocabulary tags and paragraph-by-paragraph acoustic readout.

### 📋 6. Teacher Daily Attendance Register (New)
- 100% offline classroom attendance tracker stored in device storage.
- Date picker (Today, Yesterday, or custom date) and class selector (Balvatika through Class 3, plus custom classes).
- One-tap **"Mark All Present"** for rapid morning roll call.
- Student management: add, edit, or remove students with roll numbers and gender.
- **Tribal Mother Tongue Cohort Tracking**: Real-time breakdown of class attendance by linguistic background (Santali, Ho, Mundari, Hindi).
- Historical attendance records and percentage summaries.

---

## 4. Technical Architecture

```
+-----------------------------------------------------------------------------------+
|               PALASHSETU EDGE TABLET ARCHITECTURE                                 |
|       (100% On-Device • Zero Cloud Dependency • Airplane Mode Ready)              |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ LAYER 1: TABLET-FIRST PEDAGOGICAL INTERFACE ]                                  |
|  • Framework: React 18.3 + TypeScript + Vite 5 + Capacitor 6.1                     |
|  • High-Contrast Touch UI designed for rural classroom tablets                    |
|  • Features: Voice Translator, Lessons, Worksheets, Cards, Books, Attendance      |
|                                                                                   |
|  [ LAYER 2: ON-DEVICE LINGUISTIC & VOCABULARY ENGINE ]                            |
|  • Sub-millisecond Execution (<0.01 ms per sentence in-memory lookup)              |
|  • 7,503 Santali Vocabulary Entries (AI4Bharat roots + NIPUN FLN curriculum)      |
|  • Pilot Lexicons for Ho and Mundari (~175 core terms each)                       |
|  • 4-Tier Fallback: Exact Match -> Phrase Regex -> Suffix/Particle -> Translit   |
|                                                                                   |
|  [ LAYER 3: ACOUSTIC-PHONETIC TTS SYNTHESIS ]                                     |
|  • Challenge: Android OS has zero native Ol Chiki (sat_Olck) voice models.         |
|  • Solution: santaliSpeech.ts compiles Ol Chiki syllables into acoustic Indic     |
|    phonemes pronounced with high clarity by Android's built-in hi-IN TTS engine.  |
|  • Synchronized speech rate preference across all app modules (0.6x - 1.2x).     |
|                                                                                   |
|  [ LAYER 4: NATIVE ASSETS & ZERO-NETWORK TYPOGRAPHY ]                             |
|  • Bundled Native Fonts: NotoSansOlChiki-Medium.ttf & Bold.ttf in APK assets      |
|  • Zero Google Fonts CDN requests: Eliminates network stalls in airplane mode     |
|  • Security: SHA-256 local PIN hashing without hardcoded bypasses                 |
|  • Session Persistence: Restores active teacher profile across reloads            |
+-----------------------------------------------------------------------------------+
```

---

## 5. Verification & Test Suite

The repository includes automated linguistic test suites validating the on-device edge engine:

```bash
# Run the linguistic test suite from repository root
node scripts/test_offline_engine.js
```

**Results:**
- **44/44 automated test assertions passed (100% success rate)**
- Average translation latency: **0.0034 ms per sentence** (tested over 1,000 iterations)

**Build Verification:**
```bash
cd mobile
npm run build         # TypeScript compilation & Vite bundle (zero warnings)
npx cap sync android  # Syncs assets and bundled fonts into Android native project
```

---

## 6. Directory Structure

```
BhashaSetu/
├── api/                    # Vercel serverless endpoints (feedback, complaints)
├── backend/                # FastAPI central server pipeline (IndicTrans2 batch tools)
├── mobile/                 # React + TypeScript + Capacitor Android Application
│   ├── android/            # Native Android Studio Project
│   ├── public/             # Static web assets & bundled fonts (NotoSansOlChiki-*.ttf)
│   └── src/
│       ├── components/     # Header, Sidebar, Layout, Navigation
│       ├── context/        # ThemeContext (Light / Dark mode)
│       ├── data/           # Santali, Ho, Mundari dictionaries & NIPUN decks
│       ├── pages/          # Dashboard, Lessons, Worksheets, Flashcards,
│       │                   # JCERTTextbooks, LiveTranslation, Attendance, Settings
│       ├── services/       # authService, attendanceService, feedbackService
│       └── utils/          # santaliSpeech, sfx sound effects
└── scripts/                # Automated linguistic test and benchmark scripts
```

---

## 7. Team & Attribution
- **Team**: Psyduck
- **Hackathon**: Smart India Hackathon 2026
- **Problem Statement**: SIH 26042
- **Beneficiary**: Department of School Education and Literacy, Government of Jharkhand
