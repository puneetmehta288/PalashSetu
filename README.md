# BhashaSetu (भाषा सेतु)
### AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education
**Smart India Hackathon 2026 — Problem Statement SIH 26042**

---

## 1. Executive Summary & Problem Statement

In multilingual primary classrooms across India, a significant linguistic barrier exists between standard Hindi-medium teachers and tribal/vernacular-speaking children entering primary school. 

**BhashaSetu** is an AI-powered pedagogical teaching assistant designed for Hindi-speaking primary school teachers instructing **Santali-speaking children using the Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) script**. The teacher does not need to know Santali. BhashaSetu bridges the linguistic gap by providing real-time voice translation, automated bilingual lesson and worksheet generation, vernacular flashcard drills, video localization, and textbook translation.

* **Target Language:** Santali (`sat_Olck`) with native Ol Chiki script rendering.
* **Source Language:** Hindi (`hin_Deva`) in Devanagari script.
* **Target Hardware:** Low-cost Android 9+ tablets (2 GB RAM) operating in remote rural classrooms.
* **Core Philosophy:** **100% Offline Classroom Operation** with zero dependency on active internet connection during teaching hours.

---

## 2. System Architecture & Tech Stack

BhashaSetu employs a **web-first mobile architecture** that packages a polished React + TypeScript frontend into an installable Android APK using Capacitor, backed by a lightweight modular FastAPI server for heavy preparation and local AI inference.

```
+-------------------------------------------------------------------------------+
|                             BHASHASETU SYSTEM ARCHITECTURE                    |
+-------------------------------------------------------------------------------+
|                                                                               |
|  [ PREPARATION MODE: ONLINE / DESKTOP ]                                        |
|  • AI Model Setup & Download (IndicTrans2 320M Distilled)                     |
|  • Cloud Content Sync & Version Manifest                                      |
|  • Educational Video & PDF Localization Packages                              |
|  • Fast Generation of Custom Pedagogy Assets                                  |
|                                                                               |
|                                    | (One-time Sync & Download)               |
|                                    v                                          |
|                                                                               |
|  [ CLASSROOM MODE: 100% OFFLINE TABLET ]                                      |
|  +-------------------------------------------------------------------------+  |
|  | Android Tablet (Android 9+, ~2 GB RAM)                                  |  |
|  |                                                                         |  |
|  |  +-------------------------------------------------------------------+  |  |
|  |  | React 18 + TypeScript + Vite (Tablet-First UI)                    |  |  |
|  |  | • Dashboard • Live Voice Translation • Lesson & Worksheet Plans    |  |  |
|  |  | • Interactive Ol Chiki Flashcards • Video & PDF Offline Player     |  |  |
|  |  +-------------------------------------------------------------------+  |  |
|  |  | Capacitor Native Bridge (@capacitor/android, filesystem, network)   |  |  |
|  |  +-------------------------------------------------------------------+  |  |
|  |  | Local SQLite & Storage (Pre-cached Santali Audio, Offline SQLite)   |  |  |
|  |  +-------------------------------------------------------------------+  |  |
|  |  | Local Translation Engine (IndicTrans2 PyTorch CPU / FLN Dict)       |  |  |
|  |  +-------------------------------------------------------------------+  |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
```

### Technology Stack:
* **Frontend UI:** React 18.3, TypeScript 5.5, Vite 5.4, React Router DOM 6.26.
* **Mobile Shell:** Capacitor 6.1 (`@capacitor/android`, `@capacitor/filesystem`, `@capacitor/network`, `@capacitor/preferences`, `@capacitor/haptics`).
* **Backend Server:** Python 3.10+ / FastAPI 0.141, Starlette, Uvicorn, Pydantic 2.13.
* **Database & Storage:** SQLite + SQLAlchemy 2.0 (Sync engine for maximum Android/desktop compatibility).
* **Neural Translation (NMT):** AI4Bharat IndicTrans2 (`ai4bharat/indictrans2-indic-indic-dist-320M`) with PyTorch & `IndicTransToolkit`.
* **Speech Pipeline:** Real-time Web Speech Recognition (`hi-IN`) & Android On-Device Speech Recognizer; gTTS & local audio narration.
* **Document & Media Processing:** `pdfplumber` & `reportlab` for bilingual side-by-side reconstruction.

---

## 3. Core Features & Capabilities

1. **Tablet-First Dashboard (`/`):**
   * Overview of teacher profile, class grade (Class 1), active FLN topic (Counting 1–10), online/offline status, and quick action launch tiles.
2. **Live Hindi $\to$ Santali Voice Translation (`/translate`):**
   * Real-time continuous speech recognition with live audio visualizer.
   * Instant Ol Chiki script rendering (`sat_Olck`) with measured latency tracking ($\le 3.0$ seconds).
   * 1-Tap Quick Teacher Phrases for instant offline classroom drills.
3. **AI Lesson Generator (`/lessons`):**
   * Generates bilingual structured pedagogy: Learning Objectives, Warmup/Greetings, Teacher Scripts, Classroom Activities, and Assessments.
   * Default topic: Class 1 $\to$ Mathematics $\to$ Counting 1–10 (Foundational Numeracy).
4. **AI Worksheet Generator (`/worksheets`):**
   * Randomized bilingual question generator supporting Counting, Matching, Number Ordering, and Fill-in-the-Blanks with answer keys and printable layout.
5. **Interactive Ol Chiki Flashcards (`/flashcards`):**
   * Visual 1 to 10 number cards with visual emoji groups (apples/stars), Devanagari words, Ol Chiki script, phonetic pronunciation, and audio triggers.
6. **Hindi PDF Localizer (`/pdf`):**
   * Text-based Hindi PDF extractor and paragraph segmenter that generates bilingual side-by-side translated sheets.
7. **Educational Video Localizer (`/video`):**
   * Accepts educational video links (YouTube/DIKSHA/MP4) or local video files.
   * Automatically translates spoken Hindi dialogue into synchronized Santali Ol Chiki subtitles with live audio voice narration.
8. **Offline Content Library (`/library`):**
   * Filterable repository (Lessons, Worksheets, PDFs, Videos, Flashcards) storing all synchronized classroom materials locally.
9. **Online Synchronization & Versioning (`/settings`):**
   * Content manifest tracking versions and timestamps for incremental, data-loss-free offline synchronization.
10. **Settings & Diagnostics (`/settings`):**
    * Configurable backend endpoints, local cache management, and translation model health reporting.

---

## 4. AI & Translation Pipeline

### IndicTrans2 Model Details:
* **Model Checkpoint:** `ai4bharat/indictrans2-indic-indic-dist-320M` (Official AI4Bharat Indic-to-Indic Distilled checkpoint).
* **Parameters:** ~320 Million parameters (optimized for resource-constrained edge hardware).
* **Language Codes:**
  * Source (Hindi): `hin_Deva`
  * Target (Santali): `sat_Olck` (Ol Chiki script: ᱚᱞ ᱪᱤᱠᱤ)
* **Execution Architecture:**
  1. Lazy loading: Model is loaded into memory only on demand to prevent memory bloat.
  2. LRU In-Memory Caching: Repeated classroom phrases translate in `0 ms`.
  3. Preprocessing: Script tagging and tokenization via `IndicTransToolkit` / `IndicProcessor`.
  4. Offline FLN Classroom Fallback: Built-in local dictionary for numbers, counting, and teacher commands ensuring immediate offline execution.

---

## 5. Offline vs. Online Modes

| Capability | Preparation Mode (Online / Wi-Fi) | Classroom Mode (100% Offline / Zero Internet) |
|---|---|---|
| **App Navigation & Dashboard** | ✅ Live | ✅ 100% Local from device storage |
| **Class 1 Math Lessons (1–10)** | ✅ Generates & syncs | ✅ Opens all pre-saved lessons |
| **Worksheets & Quizzes** | ✅ Generates & exports | ✅ Opens saved worksheets |
| **Flashcard Drills** | ✅ Live | ✅ 100% Offline interactive |
| **Bilingual Video & Audio** | ✅ Translates online links | ✅ Plays downloaded videos with Ol Chiki captions & audio |
| **Classroom Speech Translation** | ✅ Cloud WebSpeech / Server | ✅ Native Android on-device speech & offline FLN engine |
| **Model Download** | ✅ One-time setup via script | ✅ Runs 100% locally from hard drive/storage |

---

## 6. Setup, Run & Build Instructions

### Prerequisites:
* Python 3.10+
* Node.js 18+ & npm
* Amazon Corretto JDK 17 (installed at `C:\Program Files\Amazon Corretto\jdk17.0.20_10`)
* Android Studio (free, required for Android SDK compilation)

---

### Step 1: Run the Application Locally (Web / Preview Mode)

#### Start Backend:
```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Start Mobile Web UI:
```powershell
cd mobile
npm run dev
```
Open **`http://localhost:5173`** in your browser to test all 10 modules.

---

### Step 2: Download AI Model Weights (Optional / Free)
To enable open-ended neural translation for arbitrary sentences:
1. Accept terms at [Hugging Face IndicTrans2](https://huggingface.co/ai4bharat/indictrans2-indic-indic-dist-320M) (Free).
2. Create a token at [Hugging Face Tokens](https://huggingface.co/settings/tokens).
3. Run:
   ```powershell
   $env:HF_TOKEN = "your_huggingface_token"
   python scripts/setup_indictrans2.py
   ```

---

### Step 3: Build Android APK
```powershell
# 1. Build and sync web bundle
cd mobile
npm run build
npx cap sync android

# 2. Compile APK
cd android
$env:JAVA_HOME = "C:\Program Files\Amazon Corretto\jdk17.0.20_10"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
.\gradlew.bat assembleDebug
```
*Finished installable APK will be at: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`*

---

## 7. Automated Test Suite & Validation

The backend includes automated test coverage with PyTest:

```powershell
cd backend
python -m pytest tests/ -v
```

### Test Results (7/7 Passed — 100% Success Rate):
* `test_health.py::test_health_check` $\to$ **PASSED**
* `test_health.py::test_root_endpoint` $\to$ **PASSED**
* `test_lessons.py::test_lesson_generation` $\to$ **PASSED**
* `test_worksheets.py::test_worksheet_generation` $\to$ **PASSED**
* `test_flashcards.py::test_flashcard_generation` $\to$ **PASSED**
* `test_sync.py::test_sync_check` $\to$ **PASSED**
* `test_translation.py::test_translation_service_mock` $\to$ **PASSED**

---

## 8. Repository Structure (Cleaned & Minimal)

```
BhashaSetu/
├── backend/            # FastAPI Python backend server, endpoints, and services
│   ├── app/            # Core logic, IndicTrans2 translation, ASR, TTS, sync
│   ├── tests/          # Pytest automated test suite
│   ├── pytest.ini      # Pytest configuration
│   └── requirements.txt# Backend Python dependencies
├── mobile/             # React + TypeScript + Vite + Capacitor Android mobile app
│   ├── android/        # Native Android project shell and Gradle wrapper
│   ├── src/            # Pages, components, hooks, services, and Ol Chiki styles
│   ├── package.json    # Frontend dependencies
│   └── vite.config.ts  # Vite bundler configuration
├── data/               # Dataset schemas and demo content
│   ├── demo_content.json
│   └── schema.json
├── models/             # Local offline weights directory (created on setup)
├── scripts/            # Build automation & IndicTrans2 setup scripts
│   ├── build_apk.py
│   ├── data_tools.py
│   ├── setup_backend.py
│   ├── setup_indictrans2.py
│   └── setup_mobile.py
├── .env.example        # Environment variable templates
├── .gitignore          # Git exclusion rules
└── README.md           # Master Documentation (This file)
```

---
*Developed for Smart India Hackathon 2026 — Team BhashaSetu.*
