# PalashSetu (पलाश सेतु)
### Standalone On-Device Tablet App for Mother Tongue-Based Multilingual Education (MTB-MLE)
**Smart India Hackathon 2026 — Problem Statement SIH 26042**  
*Govt. of Jharkhand • Department of School Education & Literacy*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20Tablet%20%7C%20Web-green.svg)](https://github.com/puneetmehta288/PalashSetu)
[![Offline](https://img.shields.io/badge/Engine-100%25%20Offline%20Edge-success.svg)](https://github.com/puneetmehta288/PalashSetu)
[![Vocabulary](https://img.shields.io/badge/Santali%20Dictionary-7%2C503%20Entries-orange.svg)](mobile/src/data/santali_comprehensive_dictionary.ts)
[![FLN Flashcards](https://img.shields.io/badge/FLN%20Cards-16%20Decks%20%2896%20Cards%29-purple.svg)](mobile/src/data/nipunDecks.ts)
[![Latency](https://img.shields.io/badge/Edge%20Latency-%3C%205ms%20%28On--Device%29-brightgreen.svg)](scripts/test_offline_engine.js)
[![Central Hub](https://img.shields.io/badge/Central%20Hub-Live%20on%20Vercel-000000.svg)](https://palashsetu-xi.vercel.app)

---

## 1. Executive Summary & Problem Context

In rural and tribal primary classrooms across Jharkhand (particularly in the **Santhal Pargana, Kolhan, and Chotanagpur divisions**), non-tribal Hindi-speaking teachers face an acute communication barrier when instructing young indigenous children. Over **70% of Grade 1–3 learners** enter school speaking exclusively in their indigenous mother tongue:
- **Santali** (written in the official **Ol Chiki ᱚᱞ ᱪᱤᱠᱤ** script)
- **Ho** (Kolhan division, phonetically rendered in Devanagari)
- **Mundari** (Chotanagpur division, phonetically rendered in Devanagari)

### The Ground Reality in Rural Jharkhand:
1. **Zero / Intermittent Cellular Coverage**: Most village primary schools, Anganwadis, and Balvatikas operate deep in forested or rural areas where 4G/5G mobile internet is non-existent.
2. **Budget Hardware (2 GB RAM Tablets)**: Government schools are issued entry-level Android tablets (Android 9–13, Quad-Core CPU, 2 GB RAM).
3. **Why Cloud LLMs Fail Here**: Cloud APIs (OpenAI, Gemini, Bhashini Cloud) require uninterrupted high-speed internet, carry recurring token costs, and suffer latency spikes of 3,000–5,000 ms.
4. **Why Heavy Neural Transformers Fail On-Device**: Running heavy neural models like IndicTrans2 (1.2 GB+ PyTorch weight files) directly on 2 GB Android tablets triggers instant **Out-Of-Memory (OOM) killer crashes** and exhausts battery in minutes.

**PalashSetu solves this with an edge-first, Store-and-Forward hybrid architecture**:
- **100% Offline Edge Tablet App**: An on-device rule-based linguistic engine with a 7,503-entry Santali dictionary, native Ol Chiki font rendering, phonetic acoustic voice synthesis, and teacher-scoped attendance register. It executes in **< 5 ms on Android tablets** and consumes **< 50 MB RAM**.
- **Store-and-Forward Classroom Telemetry**: Sentences spoken by teachers during classroom instruction are buffered locally in an offline telemetry queue. When connectivity is restored, the queue syncs with **PalashCentralHub** and automatically purges locally.
- **PalashCentralHub (State Administration Portal)**: A responsive administrative dashboard deployed on Vercel providing school-wise and teacher-wise speech intelligence drill-downs, active vocabulary discovery, teacher field complaints, and over-the-air (OTA) content releases.

---

## 2. System Architecture

```
+-------------------------------------------------------------------------------------------------+
|                               PALASHSETU ARCHITECTURAL TOPOLOGY                                 |
+-------------------------------------------------------------------------------------------------+

                      OFFLINE VILLAGE CLASSROOM (No Internet • Airplane Mode)
   +-------------------------------------------------------------------------------------------+
   |  BUDGET ANDROID TABLET (2GB RAM • Android 9-14)                                           |
   |                                                                                           |
   |  [ Layer 1: Tablet Pedagogical UI ] (React 18.3 + TypeScript + Vite 5 + Capacitor 6)      |
   |   • Live Voice Translator & Phrasebook       • 16 FLN Decks (96 Visual Cards)             |
   |   • 36 NIPUN Panchaadi Lesson Plans          • 8 JCERT Bilingual Textbooks (Ol Chiki/Deva)|
   |   • 27 Dynamic Arithmetic Worksheets         • Daily Attendance Register (Teacher-Scoped) |
   |                                                                                           |
   |  [ Layer 2: On-Device 4-Tier Linguistic Engine ] (< 5ms on Android, < 0.01ms on PC)       |
   |   Tier 1: Exact Match Hashmap (7,503 Santali + 350 Ho/Mundari entries)                    |
   |   Tier 2: Phrase Regex & Classroom Sentence Bank (300+ validated structures)              |
   |   Tier 3: Grammatical Particle & Case Suffix Deconstruction (-re, -te, -khon, -ko)        |
   |   Tier 4: Phonetic Ol Chiki Transliteration Fallback (ISO 15919 compliant)                |
   |                                                                                           |
   |  [ Layer 3: Acoustic-Phonetic TTS Voice Bridge ] (Zero Heavy Neural Models Needed)        |
   |   • Compiles Ol Chiki (sat_Olck) graphemes into acoustic Indic phonemes pronounced with   |
   |     high fidelity using Android's native offline hi-IN speech synthesizer.                |
   |                                                                                           |
   |  [ Layer 4: Offline Persistence & Store-and-Forward Telemetry Queue ]                     |
   |   • Teacher profiles & SHA-256 PIN auth      • Teacher-scoped attendance registers (CSV)  |
   |   • Classroom Speech Telemetry Buffer        • Local queue purge upon cloud sync          |
   +-------------------------------------------------------------------------------------------+
                                                │
                                                ▼  (When Teacher connects to Wi-Fi / Hotspot)
                                   HTTPS Store-and-Forward Sync
                                                │
                                                ▼
   +-------------------------------------------------------------------------------------------+
   |  PALASHCENTRALHUB STATE PORTAL (https://palashsetu-xi.vercel.app)                          |
   |                                                                                           |
   |  • School-Wise & Teacher-Wise Drill-Down: Filter by School UDise & Teacher ID             |
   |  • Active Vocabulary Intelligence: Frequency rankings & word clouds of classroom speech   |
   |  • Field Issue & Linguistic Complaint Tracker: Direct feedback channel for teachers       |
   |  • Content Manifest & OTA Dictionary Distribution Pipeline                                |
   +-------------------------------------------------------------------------------------------+
```

---

## 3. Supported Languages & Linguistic Precision

Our linguistic engine maintains strict academic honesty and clear tier differentiation:

| Language | Script | Status | Lexicon / Corpus Scope | Acoustic TTS Synthesis |
|---|---|---|---|---|
| **Santali** (`sat_Olck`) | **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)** | **Flagship (Complete)** | **7,503 curated offline dictionary entries** + 300+ validated classroom sentences + 8 JCERT textbooks | Syllable-level Ol Chiki to acoustic Indic phoneme compiler |
| **Ho** (`hoc_Deva`) | Devanagari (हो भाषा) | **Pilot Dialect Pack** | ~175 core classroom terms, NIPUN counting 1–10, basic greetings | Native Devanagari phonetic synthesis |
| **Mundari** (`unr_Deva`) | Devanagari (मुंडारी) | **Pilot Dialect Pack** | ~175 core classroom terms, NIPUN counting 1–10, basic greetings | Native Devanagari phonetic synthesis |

> **Note on Ol Chiki Script Fonts**: Budget government tablets do not ship with Ol Chiki Unicode glyphs pre-installed. PalashSetu bundles `NotoSansOlChiki-Medium.ttf` and `NotoSansOlChiki-Bold.ttf` directly inside the APK assets (`assets/fonts/`), guaranteeing flawless zero-network rendering without external Google Fonts CDN calls.

---

## 4. Key Classroom Features

### 🎙️ 1. Live Voice Translator & Phrasebook
- **Bidirectional Translation**: Real-time translation between Hindi and Santali (`sat_Olck`), Ho, or Mundari.
- **Categorized Quick Phrasebook**: 300+ verified classroom phrases divided into Greetings, Classroom Commands, FLN Numeracy, and Common Queries.
- **Dual Speech Recognition**: Uses native Android SpeechRecognizer bridge when packaged in APK, falling back to Web Speech API in desktop browsers.
- **Acoustic Audio Playback**: Readout of Santali Ol Chiki text at adjustable playback speeds (0.6x to 1.2x).

### 📚 2. NIPUN Bharat Lesson Studio (Panchaadi Sequence)
- **36 prewritten lesson plans** covering FLN Mathematics and Literacy from Balvatika through Class 3.
- Implements the NEP 2020 / NIPUN Bharat **5-step Panchaadi (पञ्चापदी)** pedagogical flow:
  1. *प्रस्तावना / एतोहोब* (Warm-up & Introduction)
  2. *सीधा शिक्षण / सोजे इतू* (Direct Instruction)
  3. *मार्गदर्शित अभ्यास / गोड़ो आभ्यास* (Guided Practice)
  4. *स्वतंत्र अभ्यास / ᱟᱯᱱᱟᱨ ᱟᱵᱷᱭᱟᱥ* (Independent Practice)
  5. *मूल्यांकन / जांच* (Formative Assessment Drills)

### 🃏 3. FLN Visual Flashcards (All Grades Unlocked)
- **16 decks / 96 cards** spanning Balvatika, Class 1, Class 2, and Class 3.
- Custom vector graphics and SVGs for geometric shapes, dot counting (1–5), place value tens bundles, and multiplication tables.
- Tap-to-flip cards with tribal audio pronunciation and romanized phonetic hints.

### 📝 4. Dynamic Bilingual Worksheet Generator
- Generates randomized arithmetic drills, counting grids, matching exercises, and word problems.
- One-tap printable **bilingual A4 PDF export** with school headers and tribal instructions.

### 📖 5. JCERT Bilingual Textbook Reader
- **8 Class 1–3 JCERT textbooks** rendered in dual-column layout (Hindi on left, tribal translation on right).
- Word-level tap-to-inspect vocabulary popups and paragraph-by-paragraph audio narration.

### 📋 6. Multi-Teacher Daily Attendance Register
- **100% Offline Storage**: Stored locally on the device with zero cloud dependency.
- **Teacher Profile Isolation**: The school's student roster is unified by grade, while attendance records are strictly isolated per teacher ID (`${teacherId}_${classId}_${date}`).
- **Unsaved Changes Guard**: Visual `⚠️ Unsaved Changes` banner and navigation confirmation dialogs prevent accidental data loss.
- **Pending / Unmarked State**: Unrecorded days do not falsely default students to present; each student displays unmarked until explicitly registered.
- **Student CRUD & Validation**: Add, edit, or remove students with duplicate roll number prevention.
- **Classroom Management**: Add custom classes or delete classes with confirmation.
- **Linguistic Cohort Tracking**: Real-time breakdown of class attendance by mother tongue (Santali, Ho, Mundari, Hindi).
- **Offline CSV Export**: Exports comprehensive attendance sheets compatible with state e-Vidyavahini reporting.

### 📡 7. Store-and-Forward Telemetry Subsystem
- Logs every phrase translated or spoken in the classroom with timestamp, teacher ID, and school UDise.
- Offline telemetry queue persisted locally on the tablet.
- One-tap sync from Settings when connectivity is detected.
- Automatic queue purge on sync prevents duplicate transmissions and keeps local storage clean.

---

## 5. PalashCentralHub — State Administrative Portal

Live URL: **[https://palashsetu-xi.vercel.app](https://palashsetu-xi.vercel.app)**

PalashCentralHub serves as the command center for block education officers (BEOs) and state curriculum planners:
1. **School-Wise & Teacher-Wise Drill-Down**: Inspect speech records by selecting school UDise code and teacher profile.
2. **Classroom Speech Intelligence**: Timeline view of every Hindi sentence used by teachers in tribal classrooms.
3. **Active Vocabulary Discovery**: Term frequency analytics highlighting tribal words children hear most often.
4. **Field Grievance Portal**: Review teacher-submitted feedback, linguistic edge cases, and dictionary suggestions.
5. **OTA Content Management**: Deploy new vocabulary packs, worksheets, and lesson updates to edge tablets.

---

## 6. Benchmarks & Honest Performance Metrics

We believe in verifiable engineering rather than inflated claims. All metrics are measured directly on hardware:

| Benchmark / Metric | Measured Reality | Test Setup / Reference |
|---|---|---|
| **Santali Dictionary Size** | **7,503 key-value entries** | Verified in `santali_comprehensive_dictionary.ts` |
| **FLN Flashcard Content** | **16 Decks / 96 Visual Cards** | Verified in `nipunDecks.ts` |
| **NIPUN Lesson Plans** | **36 Complete Lessons** | Verified in `nipun_lessons_data.ts` |
| **JCERT Textbooks** | **8 Full Textbooks** | Verified in `jcert_full_textbooks_data.ts` |
| **Edge Lookup Latency (PC)** | **~0.005–0.008 ms per sentence** | Benchmarked over 1,000 iterations via Node.js |
| **Edge Execution Latency (Tablet)** | **< 5 ms per sentence** | Tested on low-cost Android WebView (Quad-Core, 2GB RAM) |
| **APK Package Size** | **4.5 MB (Debug APK)** | Verified in `PalashSetu-v1.0-debug.apk` |
| **RAM Footprint** | **< 50 MB active heap** | Well within the 2 GB budget limit |
| **Test Suite Pass Rate** | **46 / 46 assertions (100%)** | Verified via `node scripts/test_offline_engine.js` |

---

## 7. Verification & Automated Test Suite

To verify the on-device linguistic engine and TTS compilation on any machine:

```bash
# Run linguistic test suite from repository root
node scripts/test_offline_engine.js
```

**Output:**
```
===============================================================
🧪 PALASHSETU ON-DEVICE LINGUISTIC & TTS ENGINE TEST SUITE
===============================================================
Results: 46 passed, 0 failed out of 46 assertions.
⏱️ Average Translation Latency: 0.0047 ms per sentence (Tested over 1000 iterations).
===============================================================
✅ ALL 46 AUTOMATED TEST ASSERTIONS PASSED (100% SUCCESS RATE)!
```

---

## 8. Quick Start & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Android Studio / JDK 17+** (for building Android APK)

### 1. Web / Tablet Simulation (Development)
```bash
# Clone the repository
git clone https://github.com/puneetmehta288/PalashSetu.git
cd PalashSetu/mobile

# Install dependencies
npm install

# Start local development server
npm run dev
# Open http://localhost:5173 on your browser or tablet simulator
```

### 2. Building the Production Web Assets
```bash
cd mobile
npm run build
```

### 3. Assembling the Android APK
```bash
cd mobile

# Sync web build and assets with Android native project
npx cap sync android

# Compile Android debug APK
cd android
./gradlew assembleDebug
```
The compiled APK is generated at:
`mobile/android/app/build/outputs/apk/debug/PalashSetu-v1.0-debug.apk`
(A ready-to-install copy is also available at the root: `PalashSetu-v1.0-debug.apk`).

---

## 9. Directory Structure

```
PalashSetu/
├── PalashSetu-v1.0-debug.apk      # Compiled standalone Android debug APK (4.5 MB)
├── api/                           # Vercel serverless functions (Telemetry & Feedback)
│   ├── complaints.ts              # Teacher field complaints endpoint
│   ├── feedback.ts                # App feedback submission endpoint
│   └── telemetry.ts               # Store-and-Forward classroom speech sync
├── mobile/                        # React + TypeScript + Capacitor mobile application
│   ├── android/                   # Native Android Studio project
│   │   └── app/src/main/assets/fonts/ # Bundled NotoSansOlChiki TTF fonts
│   ├── public/                    # Web assets & bundled fonts
│   └── src/
│       ├── components/            # Header, Sidebar, Layout, VoiceModal
│       ├── context/               # ThemeContext (Light & Dark theme)
│       ├── data/                  # 7,503 Santali entries, Ho/Mundari, NIPUN decks, JCERT books
│       ├── pages/                 # Dashboard, LiveTranslation, Lessons, Worksheets,
│       │                          # Flashcards, JCERTTextbooks, Attendance, Settings,
│       │                          # CentralHub (Admin Portal), AuthLogin, AuthRegister
│       ├── services/              # attendanceService, authService, telemetryService
│       └── utils/                 # santaliSpeech (Ol Chiki phonetic compiler), sfx
├── scripts/                       # Linguistic test suite & build utilities
│   ├── test_offline_engine.js     # 46-assertion automated benchmark runner
│   └── build_apk.py               # Automated APK compilation script
└── docs/                          # Comprehensive technical documentation
    ├── architecture.md            # In-depth architectural specification
    ├── nipun_alignment.md         # Detailed NIPUN Bharat curriculum mapping
    └── translation.md             # 4-tier linguistic rule breakdown
```

---

## 10. Team & Acknowledgments

- **Team**: Psyduck
- **Hackathon**: Smart India Hackathon 2026
- **Problem Statement**: SIH 26042
- **Beneficiary**: Department of School Education and Literacy, Government of Jharkhand
- **Linguistic References**:
  - Pandit Raghunath Murmu (Creator of the Ol Chiki script, 1925)
  - AI4Bharat IndicTrans2 root lexicons
  - Jharkhand Council of Educational Research and Training (JCERT) primary curriculum
