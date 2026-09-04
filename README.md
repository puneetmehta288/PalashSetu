# PalashSetu (पलाश सेतु)
### 100% Standalone On-Device Tablet App for Mother Tongue-Based Multilingual Education (MTB-MLE)
**Smart India Hackathon 2026 — Problem Statement SIH 26042**  
*Govt. of Jharkhand • Department of School Education & Literacy*

---

## 1. Executive Summary & Problem Statement

In rural and tribal primary classrooms across Jharkhand (particularly Santhal Pargana and Kolhan divisions), Hindi-speaking teachers face an acute communication gap when teaching indigenous children whose mother tongue is **Santali** written in the **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)** script. 

Most remote village schools (Anganwadis, Balvatikas, and Government Primary Schools) have **zero cellular connectivity** and operate on budget Android tablets (often running Android 7.0–9.0 with 2 GB RAM).

**PalashSetu** is a **100% standalone, fully on-device Android tablet application** that bridges the linguistic divide without relying on internet, external servers, or cloud APIs. Everything runs directly inside the Android tablet with sub-millisecond algorithmic execution and a lightweight memory footprint (~55 MB RAM).

> **Core Philosophy:** A modular, plug-and-play MTB-MLE architecture with **Santali (Ol Chiki)** as the live **Phase 1 flagship pilot**, architected for seamless expansion to other indigenous dialects (**Ho, Mundari, Kurukh, and Kharia**).

---

## 2. System Architecture (4-Layer Framework)

```
+-----------------------------------------------------------------------------------+
|               PALASHSETU STANDALONE TABLET ARCHITECTURE                           |
|       (100% On-Device • Zero Server • Airplane Mode Ready • ~55 MB RAM)           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ LAYER 1: TABLET-FIRST PEDAGOGICAL INTERFACE ]                                  |
|  • Framework: React 18.3 + TypeScript + Vite 5 + Capacitor 6.1                     |
|  • High-Contrast Touch UI (Min 48px targets designed for rural tablets)            |
|  • 5 Classroom Tools:                                                             |
|    - 🎙️ Live Classroom Voice Translator (Bidirectional Walkie-Talkie)             |
|    - 📚 36 NIPUN Bharat Structured Bilingual Lessons (Class 1-3 Math & FLN)       |
|    - 📝 Dynamic Bilingual Worksheet & Drill Generator (Printable A4)               |
|    - 🃏 30+ Interactive 3D Ol Chiki Illustrated Flashcard Decks (96+ Cards)        |
|    - 📖 Official JCERT State Textbooks Library (Balvatika to Grade 3)             |
|    - ⚙️ Teacher Profile & District Settings (10 Jharkhand Tribal Districts)       |
|                                                                                   |
|  [ LAYER 2: ON-DEVICE LINGUISTIC TRANSLATION ENGINE ]                            |
|  • Latency: < 1 ms • Pure In-Memory Hash Lookup • Zero Network Latency             |
|  • 7,503 Curated Vocabulary Entries:                                              |
|    - 100% AI4Bharat IndicTrans2 Santali Tokens (5,448 tokens / 4,597 roots)       |
|    - Complete NIPUN FLN Class 1-3 Math (0-100 universal counting in Ol Chiki)    |
|    - Complete Pronoun Paradigms (आपकी, तुम्हारा, मेरा, हमारा, उसका, उनका)        |
|    - Abstract & Cultural Lexicon (किस्मत, जिंदगी, विचार, जोहार, झारखंड, रांची)    |
|  • 4-Tier Resilient Fallback Pipeline:                                            |
|    1. Direct Dictionary Match (< 0.001 ms)                                        |
|    2. Longest-Match Phrasebook Regex Parser (Classroom commands & greetings)      |
|    3. Grammatical Particle & Case Suffix Parser (ᱠᱷᱚᱱ, ᱦᱟᱹᱵᱤᱡ, ᱟᱨ, ᱨᱮ, ᱠᱚ, ᱠᱟᱱᱟ)       |
|    4. Ol Chiki Transliteration Fallback (proper nouns & student names never fail) |
|                                                                                   |
|  [ LAYER 3: NOVEL ACOUSTIC-PHONETIC TTS SYNTHESIZER ]                             |
|  • The Challenge: Android OS has zero native Ol Chiki (sat_Olck) voice packages.  |
|  • The Solution: Custom `santaliSpeech.ts` acoustic mapping compiler.             |
|  • Compiles Ol Chiki Unicode syllables into phonetic Devanagari & Indic phonemes  |
|    pronounced with authentic phonetics by Android's built-in offline `hi-IN` TTS. |
|  • 100% Offline • Zero Cloud Audio • Adjustable Pedagogical Speech Speed (0.6x-1.2x)
|                                                                                   |
|  [ LAYER 4: ANDROID NATIVE OS & HARDWARE RUNTIME ]                                |
|  • Bridge: Capacitor 6.1 Native Bridge                                            |
|  • Target OS: Android 7.0 (API 24) to Android 14+ (API 34)                        |
|  • Hardware Optimizations: android:largeHeap="true", hardwareAccelerated="true"    |
|  • Offline Speech Input: Native Android SpeechRecognizer with offline language    |
|  • Local Persistence: Capacitor Preferences & SHA-256 Local Teacher Auth Storage  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Key Technical Specifications

| Parameter | Specification | Why It Matters for Rural Jharkhand |
|---|---|---|
| **App Delivery** | Standalone Android APK (`PalashSetu-v1.0-debug.apk`) | Instant offline installation via Bluetooth, SD card, or USB |
| **APK File Size** | **4.44 MB** | Lightweight enough to download or share in 2G connectivity zones |
| **Runtime RAM Usage** | **~55 MB** | Runs smoothly on budget 2GB RAM government school tablets |
| **Algorithmic Latency** | **0.0035 ms (3.5 μs)** | 600,000× faster than the SIH 3.0-second SLA requirement |
| **End-to-End Latency** | **< 250 ms (including audio)** | Seamless natural classroom conversation without awkward pauses |
| **Network Dependency** | **ZERO (0% Internet Required)** | Operates 100% in Airplane Mode |
| **Total Vocabulary** | **7,503 Entries** | Comprehensive primary school, math, and tribal vocabulary |
| **Model Token Coverage** | **100% of IndicTrans2 Santali (5,448 tokens)** | Covers all roots recognized by AI4Bharat IndicTrans2 |
| **Speech Recognition** | Android Google Speech Services (Offline Pack) | Hands-free walkie-talkie mode for teachers |
| **Speech Synthesis** | Custom On-Device Acoustic Phonetics (`santaliSpeech.ts`) | Native offline speech with zero cloud TTS / gTTS dependencies |
| **Teacher Profiles** | Local SHA-256 PIN Hashed Auth (`authService.ts`) | Enables multiple teachers to safely share one school tablet |

---

## 4. Core On-Tablet Modules

### 1. 🎙️ Live Classroom Voice Translator (`/translate`)
* **Walkie-Talkie Mode:** Teacher speaks Hindi $\to$ translated instantly into authentic Ol Chiki script $\to$ spoken aloud in Santali.
* **Student Mode:** Children speak or tap Santali phrases $\to$ translated into Hindi for the teacher.
* **4-Tier Translation Engine:** Compound commands (e.g. *"अपनी किताब खोलो और इन सेबों को गिनो"*) translate with correct postpositions and verb inflections; proper names (e.g. *"राहुल"*) transliterate into Ol Chiki (`ᱨᱟᱦᱩᱞ`) without breaking.
* **Quick Phrase Shortcuts:** One-tap audio triggers for Greetings, Classroom Commands, Numeracy Prompts, and Student Responses.

### 2. 🃏 Visual Ol Chiki Flashcards (`/flashcards`)
* 30+ interactive 3D flip-and-reveal flashcard decks (96+ cards) across Balvatika, Class 1, Class 2, and Class 3.
* Covers Animals, Fruits, Vegetables, Classroom Objects, Body Parts, Colors, Nature, and FLN Numbers.
* Visual SVG/Emoji graphics, Hindi spelling, Ol Chiki script, romanized pronunciation hint, and 1-tap acoustic speech playback.

### 3. 📚 NIPUN Bharat Lesson Studio (`/lessons`)
* Pre-loaded with **36 complete structured lessons** aligned to the Government of India's **Panchaadi (5-step) framework**:
  1. *Adhiti / Pusthabhumi* (Connect & Introduction)
  2. *Bodh / Pustha* (Explore & Explanation)
  3. *Abhyas / Prayas* (Guided Practice & Teacher Talk-Script)
  4. *Prayog / Vyavahar* (Independent Classroom Activity)
  5. *Prasar / Mulyankan* (Evaluation & Assessment Prompts)
* Dual-language teacher scripts in Hindi and Ol Chiki.
* 1-Tap A4 printable handout layout for classroom distribution.

### 4. 📝 Dynamic Bilingual Worksheet Generator (`/worksheets`)
* Algorithmic generation engine producing infinite randomized worksheets on-device.
* Exercise drills: Object Counting, Number-Word Matching, Missing Number Sequencing, Randomized Arithmetic, Pattern Completion, and Place Value.
* High-contrast, clean printable formatting for physical paper tests.

### 5. 📖 Official JCERT State Textbooks Library (`/books`)
* Official Jharkhand state primary textbooks for **Balvatika, Class 1, Class 2, and Class 3** across **Mathematics, Language, and EVS**.
* Side-by-side dual-column reading: Original Hindi textbook text paired with authentic Santali Ol Chiki translation.
* Paragraph-level **`🔊 Pronounce`** audio buttons and word-level vocabulary tags.

### 6. ⚙️ Teacher Profile & District Settings (`/settings`)
* Synchronized with active authenticated teacher profile (`authService.ts`).
* Configurable district selector covering all 10 Jharkhand tribal districts:
  * *Santhal Pargana:* Dumka (`ᱫᱩᱢᱠᱟᱹ`), Deoghar, Pakur, Sahebganj, Godda, Jamtara
  * *Kolhan:* East Singhbhum (`ᱥᱟᱢᱟᱝ ᱥᱤᱝᱵᱷᱩᱢ`), West Singhbhum, Seraikela Kharsawan
  * *South Chotanagpur:* Ranchi (`ᱨᱟᱺᱪᱤ`)
* Audio pronunciation speed slider (`0.6x` slow for beginners $\leftrightarrow$ `0.85x` standard $\leftrightarrow$ `1.2x` fast).
* Interactive sound effects (SFX) toggle and real-time voice engine diagnostic test.
* Instant teacher account switching for shared school tablets.

---

## 5. Automated Test Suite & Verification

The offline linguistic engine and acoustic audio synthesizer are continuously verified by an automated test suite evaluating **44 core linguistic and performance assertions**:

```powershell
# Run the automated test suite
node scripts/test_offline_engine.js
```

### Test Results (44/44 Passed — 100% Success Rate):

| Test Category | Tested Capabilities | Status |
|---|---|---|
| **1. Classroom Commands** | नमस्ते, जोहार, किताब, कलम, शिक्षक, बच्चे, अपनी किताब खोलो, बैठ जाओ, खड़े हो जाओ, बहुत अच्छा | ✅ **10/10 PASS** |
| **2. Pronouns & Abstract Nouns** | आपकी किस्मत, किस्मत, आपकी, जिंदगी, विचार, सपना, उम्मीद, भरोसा, प्यार | ✅ **9/9 PASS** |
| **3. NIPUN FLN Math (0–100)** | शून्य, एक, दो, पाँच, दस, बीस, पचास, सौ, जोड़, घटाना | ✅ **10/10 PASS** |
| **4. Jharkhand Culture & Geography** | झारखंड, रांची, पलाश (राज्य पुष्प), साल (राज्य वृक्ष), सरहुल, करम, संताली | ✅ **7/7 PASS** |
| **5. Out-of-Vocabulary (OOV) Fallback** | राहुल $\to$ `ᱨᱟᱦᱩᱞ`, सुनीता $\to$ `ᱥᱩᱱᱤᱛᱟ`, राहुल और सुनीता $\to$ `ᱨᱟᱦᱩᱞ ᱟᱨ ᱥᱩᱱᱤᱛᱟ` | ✅ **3/3 PASS** |
| **6. Acoustic TTS Verification** | `ᱡᱚᱦᱟᱨ` $\to$ जोहार, `ᱟᱢᱟᱜ ᱠᱚᱯᱟᱲ` $\to$ आमाग कोपाड़, `ᱢᱟᱪᱮᱛ` $\to$ माचेत, `ᱯᱩᱛᱷᱤ` $\to$ पुथी | ✅ **4/4 PASS** |
| **7. Real-Time Latency Benchmark** | 1,000 continuous translation loops evaluated via `process.hrtime` | ✅ **0.0035 ms PASS** |

---

## 6. How to Build the Standalone Android APK

### Prerequisites:
* Node.js 18+ & npm
* Amazon Corretto JDK 17
* Android SDK (API level 34)

### Build Steps:
```powershell
# 1. Navigate to the mobile directory
cd mobile

# 2. Compile optimized web distribution
npm run build

# 3. Synchronize native Android wrapper assets
npx cap sync android

# 4. Assemble the release/debug Android APK
cd android
$env:JAVA_HOME = "C:\Program Files\Amazon Corretto\jdk17.0.20_10"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
.\gradlew.bat assembleDebug
```

**Compiled Standalone APK Output:**  
📁 `mobile/android/app/build/outputs/apk/debug/PalashSetu-v1.0-debug.apk` *(4.44 MB)*

---

## 7. Cloud Web Preview (Vercel)

For quick desktop preview during presentations and judge evaluations, the project is configured with automated Vercel single-page application (SPA) rewrites:

```json
{
  "buildCommand": "cd mobile && npm install && npm run build",
  "outputDirectory": "mobile/dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Every push to GitHub automatically triggers a live cloud preview while preserving 100% offline edge execution in the client browser.

---

## 8. Scalability Roadmap: Extending to Other Tribal Dialects

PalashSetu's decoupled architecture makes expanding to other low-resource indigenous languages straightforward:

```
┌────────────────────────────────────────────────────────────┐
│              MODULAR LANGUAGE ADAPTER PIPELINE             │
└─────────────────────────────┬──────────────────────────────┘
                              ▼
 ┌───────────────────────┬───────────────────────┬───────────────────────┐
 │   PHASE 1 (LIVE)      │   PHASE 2 (NEXT)      │   PHASE 3 (FUTURE)    │
 ├───────────────────────┼───────────────────────┼───────────────────────┤
 │ • Santali (Ol Chiki)  │ • Ho (Warang Chiti)   │ • Kurukh (Tolong Siki)│
 │ • 7,503 Lexicon       │ • Mundari (Devanagari/│ • Kharia              │
 │ • 36 NIPUN Lessons    │   Bani)               │ • Gondi               │
 │ • 8 JCERT Textbooks   │ • Santhal Pargana &   │ • Central Tribal Belt │
 │ • Santhal Pargana     │   Kolhan Expansion    │                       │
 └───────────────────────┴───────────────────────┴───────────────────────┘
```

Adding a new dialect requires only two data additions:
1. Compiling a distilled bilingual token lexicon into the data layer.
2. Providing the acoustic phoneme mapping table in the speech engine.
*Zero modifications are needed for the UI, state machine, or hardware bridges.*

---

*Developed for Smart India Hackathon 2026 — Problem Statement SIH 26042.*  
*Maintained by Team Psyduck • Author: Puneet Mehta (`puneetmehta288@gmail.com`).*
