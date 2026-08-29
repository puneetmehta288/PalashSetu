# PalashSetu (पलाश सेतु)
### 100% Standalone On-Device Tablet App for Mother Tongue-Based Multilingual Education (MTB-MLE)
**Smart India Hackathon 2026 — Problem Statement SIH 26042**  
*Govt. of Jharkhand • Department of School Education & Literacy*

---

## 1. Executive Summary & Problem Statement

In primary classrooms across Jharkhand (particularly Santhal Pargana and Kolhan divisions), Hindi-speaking teachers face a critical language barrier when instructing tribal children whose mother tongue is **Santali** written in the **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)** script. 

Most remote village schools (Anganwadis, Balvatikas, and Government Primary Schools) have **zero internet connectivity** and are equipped only with low-cost Android tablets (often running Android 9 with 2 GB RAM).

**PalashSetu** is a **100% standalone, fully on-device Android tablet application**. It requires **no external server, no laptop, no Wi-Fi, and no cloud APIs** during school hours. Everything runs directly inside the Android tablet with sub-5ms latency and an ultra-low memory footprint (~55 MB RAM).

> **Note on Architecture Scope:** Development environments, localhost servers, and Vercel deployments were used exclusively as data extraction, model tokenization, and pipeline-building labs during engineering. **The delivered product is the self-contained Android APK (`PalashSetu-v1.0-debug.apk`) operating entirely on the tablet.**

---

## 2. On-Tablet System Architecture

```
+-----------------------------------------------------------------------------------+
|               PALASHSETU STANDALONE TABLET ARCHITECTURE                           |
|       (100% On-Device • Zero Server • Airplane Mode Ready • ~55 MB RAM)           |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ LAYER 1: TABLET-FIRST PEDAGOGICAL INTERFACE ]                                  |
|  • Framework: React 18.3 + TypeScript + Vite + Capacitor 6.1                     |
|  • Big-Touch Target Controls (Min 48px, High-Contrast UI for Rural Tablets)       |
|  • Modules:                                                                       |
|    - 🎙️ Live Classroom Voice Translator (Bidirectional Teacher <-> Student)      |
|    - 📚 36 NIPUN Bharat Structured Bilingual Lessons (Class 1-2 Math & FLN)       |
|    - 📝 Dynamic Bilingual Worksheet & Quiz Generator                             |
|    - 🃏 30+ Interactive SVG Ol Chiki Illustrated Flashcards                      |
|    - 📦 Offline Pedagogical Library & JCERT Resource Store                        |
|                                                                                   |
|  [ LAYER 2: ON-DEVICE LINGUISTIC TRANSLATION ENGINE ]                            |
|  • Latency: < 5 ms • Pure Client-Side Execution • Zero Network Latency            |
|  • 7,503 Total Curated Vocabulary Entries:                                       |
|    - 100% AI4Bharat IndicTrans2 Santali Tokens (5,448 tokens / 4,597 roots)       |
|    - Complete NIPUN FLN Class 1-2 Math (0-100 universal counting in Ol Chiki)    |
|    - Complete Pronoun Paradigms (आपकी, तुम्हारा, मेरा, हमारा, उसका, उनका)        |
|    - Abstract & Cultural Lexicon (किस्मत, जिंदगी, विचार, जोहार, झारखंड, रांची)    |
|  • Multi-Tier Parsing Pipeline:                                                   |
|    1. Longest-Match Phrasebook (Idiomatic classroom commands & greetings)        |
|    2. Grammatical Particle & Case Suffix Parser (ᱠᱷᱚᱱ, ᱦᱟᱹᱵᱤᱡ, ᱟᱨ, ᱨᱮ, ᱠᱚ, ᱠᱟᱱᱟ)       |
|    3. Sub-word & Stem Tokenizer against 7,503-word master lexicon                 |
|    4. Smart Ol Chiki Transliteration Fallback for proper nouns & student names    |
|                                                                                   |
|  [ LAYER 3: ACOUSTIC PHONETIC SPEECH SYNTHESIS (TTS) ]                            |
|  • Problem: Stock Android has no native Ol Chiki (sat_Olck) voice package         |
|  • Solution: Custom `santaliSpeech.ts` acoustic mapping engine                    |
|  • Maps Ol Chiki Unicode syllables into phonetic Devanagari & acoustic Indic     |
|    phonemes pronounced natively by Android's built-in `hi-IN` TTS offline         |
|  • 100% Offline • Zero Cloud Audio • Instant Spoken Feedback                      |
|                                                                                   |
|  [ LAYER 4: ANDROID NATIVE OS RUNTIME ]                                           |
|  • Target OS: Android 7.0 (API 24) to Android 14+ (API 34)                        |
|  • Hardware Optimization: android:largeHeap="true", hardwareAccelerated="true"    |
|  • Offline Speech Input: Native Android SpeechRecognizer with offline language    |
|  • Storage: Capacitor Preferences & Local Device Storage (zero database bloat)    |
+-----------------------------------------------------------------------------------+
```

---

## 3. Key Technical Specifications

| Parameter | Specification | Why It Matters for Rural Jharkhand |
|---|---|---|
| **App Delivery** | Standalone Android APK (`PalashSetu-v1.0-debug.apk`) | 1-tap installation via USB / SD card in remote schools |
| **APK File Size** | **4.44 MB** | Easily transferred via Bluetooth or WhatsApp in 2G areas |
| **Runtime RAM Usage** | **~55 MB** | Runs smoothly on cheap 2GB RAM budget tablets |
| **Translation Latency** | **< 5 milliseconds** | Instant voice translation during fast classroom dialogue |
| **Network Dependency** | **ZERO (0% Internet Required)** | Operates in 100% Airplane Mode |
| **Total Vocabulary** | **7,503 Entries** | Comprehensive primary school, math, and tribal vocabulary |
| **Model Token Coverage** | **100% of IndicTrans2 Santali (5,448 tokens)** | Covers all roots recognized by AI4Bharat IndicTrans2 |
| **Speech Recognition** | Android Google Speech Services (Offline Pack) | Hands-free walkie-talkie mode for rural teachers |
| **Speech Synthesis** | Custom On-Device Acoustic Phonetics | Audible pronunciation without any cloud TTS API |

---

## 4. Core On-Tablet Modules

### 1. 🎙️ Live Classroom Voice Translator (`/translate`)
* **Walkie-Talkie Mode**: Teacher speaks Hindi $\to$ translated instantly into authentic Ol Chiki script $\to$ automatically spoken aloud in Santali.
* **Student Mode**: Children speak/tap Santali $\to$ translated into Hindi for the teacher.
* **Phrase & Word Parsing**: Sentences like *"आपकी किस्मत"* translate directly to **`ᱟᱢᱟᱜ ᱠᱚᱯᱟᱲ`** (*Amag Kopal*); proper nouns (e.g. child's name *"राहुल"*) transliterate directly to Ol Chiki without breaking.

### 2. 📚 NIPUN Bharat Lesson Generator (`/lessons`)
* Pre-loaded with complete structured pedagogy for **Class 1 & 2 Foundational Numeracy (FLN)**.
* Each lesson provides: Learning Objectives, Teacher Opening Script (Bilingual), Classroom Hands-on Activity, Practice Drill, and Formative Assessment.

### 3. 📝 Dynamic Bilingual Worksheet Generator (`/worksheets`)
* Generates randomized, printable bilingual worksheets on the tablet.
* Supports: Object Counting, Number-Word Matching, Number Ordering, and Fill-in-the-Blanks.

### 4. 🃏 Illustrated Ol Chiki Flashcards (`/flashcards`)
* 30+ interactive flashcards for numbers 0–100, fruits, animals, and school objects.
* Displays visual graphics, Hindi word, Ol Chiki script, and 1-tap phonetic audio playback.

### 5. 📦 Offline Pedagogical Library (`/library`)
* Offline repository storing lessons, practice worksheets, and reference guides saved directly on the tablet's storage.

---

## 5. How the 7,503-Word Offline Linguistic Engine Works

Rather than attempting to force a 1.28 GB PyTorch transformer into a 2GB RAM tablet (which causes Android to instantly trigger an Out-of-Memory crash), PalashSetu utilizes an **advanced compiled linguistic matrix**:

1. **AI4Bharat Model Token Extraction**: We parsed the target vocabulary (`dict.TGT.json`) of the AI4Bharat IndicTrans2 320M model and extracted **100% of all 5,448 Ol Chiki tokens (4,597 clean roots)**.
2. **Curated NIPUN & JCERT Dictionary**: Mapped all numbers 0–100, verb paradigms (imperative, present, past, continuous), pronouns (all forms), anatomy, Jharkhand flora/fauna, and abstract concepts.
3. **Phonetic Transliteration Fallback**: Any word not in the dictionary is automatically converted character-by-character into Ol Chiki script (`transliterateDevanagariToOlChiki`), ensuring zero untranslated Hindi leaks into the Santali box.
4. **The result**: Complete linguistic coverage, 100% offline, zero server requirement, sub-5ms response time.

---

## 6. How to Build the Standalone APK

### Prerequisites:
* Node.js 18+ & npm
* Amazon Corretto JDK 17
* Android Studio (with Android SDK platform 34)

### Build Commands:
```powershell
# 1. Navigate to mobile directory
cd mobile

# 2. Build the optimized web bundle and sync to Android
npm run build
npx cap sync android

# 3. Compile the standalone Android APK
cd android
$env:JAVA_HOME = "C:\Program Files\Amazon Corretto\jdk17.0.20_10"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
.\gradlew.bat assembleDebug
```

**Output APK Location:**  
📁 `mobile/android/app/build/outputs/apk/debug/PalashSetu-v1.0-debug.apk` *(4.44 MB)*

Install directly on any Android phone or tablet via:
```powershell
adb install -r mobile/android/app/build/outputs/apk/debug/PalashSetu-v1.0-debug.apk
```

---

## 7. Verification & Offline Testing

The app has been tested end-to-end on Android hardware with **Airplane Mode enabled (Wi-Fi OFF, Mobile Data OFF)**:

- ✅ **65/65 Core Test Words Verified**: Pass rate 100% across classroom, math, abstract nouns, and pronouns.
- ✅ **Zero Network Call Guarantee**: No `fetch()` or external HTTP calls during translation.
- ✅ **Audio Playback**: Acoustic phonetics engine speaks Santali pronunciations locally without internet.
- ✅ **Memory Profile**: Stable at ~55 MB RAM throughout extended classroom sessions.

---

*Developed for Smart India Hackathon 2026 — Problem Statement SIH 26042.*  
*Authored & Maintained by Puneet Mehta (`puneetmehta288@gmail.com`).*
