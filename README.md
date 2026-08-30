# PalashSetu (पलाश सेतु)
### 100% Standalone On-Device Tablet App for Mother Tongue-Based Multilingual Education (MTB-MLE)
**Smart India Hackathon 2026 — Problem Statement SIH 26042**  
*Govt. of Jharkhand • Department of School Education & Literacy*

---

## 1. Executive Summary & Problem Statement

In primary classrooms across Jharkhand (particularly Santhal Pargana and Kolhan divisions), Hindi-speaking teachers face a critical language barrier when instructing tribal children whose mother tongue is **Santali** written in the **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)** script. 

Most remote village schools (Anganwadis, Balvatikas, and Government Primary Schools) have **zero internet connectivity** and are equipped only with low-cost Android tablets (often running Android 9 with 2 GB RAM).

**PalashSetu** is a **100% standalone, fully on-device Android tablet application**. It requires **no external server, no laptop, no Wi-Fi, and no cloud APIs** during school hours. Everything runs directly inside the Android tablet with sub-5ms latency and an ultra-low memory footprint (~55 MB RAM).

> **App Type:** Standalone Android Mobile & Tablet Application (`PalashSetu-v1.0-debug.apk`). Runs 100% on-device on low-cost government school tablets with zero internet connectivity.

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
|  • 100% Offline • Zero Cloud Audio • Zero gTTS on Tablet • Instant Spoken Audio  |
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
| **Algorithmic Latency** | **0.0067 ms (6.7 μs)** | Benchmarked over 1,000 iterations via `process.hrtime` |
| **End-to-End Latency** | **< 250 ms (including audio render)** | Far exceeds SIH requirement of $\le 3.0$ seconds |
| **Network Dependency** | **ZERO (0% Internet Required)** | Operates in 100% Airplane Mode |
| **Total Vocabulary** | **7,503 Entries** | Comprehensive primary school, math, and tribal vocabulary |
| **Model Token Coverage** | **100% of IndicTrans2 Santali (5,448 tokens)** | Covers all roots recognized by AI4Bharat IndicTrans2 |
| **Speech Recognition** | Android Google Speech Services (Offline Pack) | Hands-free walkie-talkie mode for rural teachers |
| **Speech Synthesis** | Custom On-Device Acoustic Phonetics (`santaliSpeech.ts`) | Native offline audio with zero cloud TTS/gTTS calls |

---

## 4. Core On-Tablet Modules & Deep Engineering

### 1. 🎙️ Live Classroom Voice Translator (`/translate`)
* **Walkie-Talkie Mode**: Teacher speaks Hindi $\to$ translated instantly into authentic Ol Chiki script $\to$ automatically spoken aloud in Santali.
* **Student Mode**: Children speak/tap Santali $\to$ translated into Hindi for the teacher.
* **Phrase & Word Parsing**: Sentences like *"आपकी किस्मत"* translate directly to **`ᱟᱢᱟᱜ ᱠᱚᱯᱟᱲ`** (*Amag Kopal*); proper nouns (e.g. child's name *"राहुल"*) transliterate directly to Ol Chiki without breaking.

#### 1.1 The Acoustic-Phonetic Bridge (`santaliSpeech.ts`)
* **The Engineering Problem:** Google Android's SpeechSynthesis engine has no voice locale for Santali (`sat_Olck`). Passing raw Ol Chiki unicode (`U+1C50`–`U+1C7F`) to Android's `TextToSpeech` results in total silence.
* **The Solution:** Rather than attempting to run a 200MB neural TTS model on a 2GB RAM tablet, `santaliSpeech.ts` implements a deterministic acoustic-phonetic compiler:
  $$\text{Ol Chiki Glyphs} \xrightarrow{\text{Acoustic Compiler}} \text{Indic Acoustic Phonemes} \xrightarrow{\text{Android Native TTS}} \text{Authentic Santali Voice}$$
* **How It Works:**
  1. **Direct Word Pronunciation Lexicon (`SANTALI_VOCAB_PHONETICS`)**: Hand-tuned phonetic acoustic spellings for all core greetings, classroom verbs, and nouns (e.g., `ᱡᱚᱦᱟᱨ` $\to$ `"जोहार"`, `ᱟᱢᱟᱜ ᱠᱚᱯᱟᱲ` $\to$ `"आमाग कोपाड़"`, `ᱢᱟᱪᱮᱛ` $\to$ `"माचेत"`).
  2. **Glyph-to-Phoneme Fallback**: Any unmapped Ol Chiki syllable is decomposed into acoustic Devanagari phonemes (e.g., `ᱚ` $\to$ `अ`, `ᱟ` $\to$ `आ`, `ᱠ` $\to$ `क`, `ᱪ` $\to$ `च`).
  3. **Audio Playback**: The resulting acoustic string is dispatched to Android's built-in `hi-IN` TTS voice at `0.85x` rate. Android produces clear, authentic, human-sounding Santali speech completely offline with zero internet and zero cloud TTS services.

---

### 2. 🃏 Illustrated Ol Chiki Flashcards (`/flashcards`)
* 30+ interactive 3D flip flashcards across 4 grade levels (Balvatika to Class 3).
* Displays visual graphics, Hindi word, Ol Chiki script, and 1-tap phonetic audio playback.

### 3. 📚 NIPUN Bharat Lesson Studio (`/lessons`)
* Pre-loaded with **36 complete structured lessons** covering Balvatika to Class 3 Foundational Literacy & Numeracy.
* Follows the **Panchaadi (5-step) framework**: Adhiti (Warmup), Bodh (Concept), Abhyas (Activity), Prayog (Script), and Prasar (Assessment).

### 4. 📝 Dynamic Bilingual Worksheet Generator (`/worksheets`)
* Generates infinite randomized, printable bilingual worksheets on the tablet.
* Supports: Object Counting, Number-Word Matching, Number Ordering, Addition/Subtraction drills, and Shape Recognition.

### 5. 📖 Official JCERT State Textbooks Library (`/books`)
* Complete official Jharkhand state primary curriculum textbooks in **Mathematics, Language, and EVS**.
* Covers **Balvatika, Class 1, Class 2, and Class 3** chapters with side-by-side Hindi and Santali Ol Chiki texts, native acoustic audio pronunciation on every paragraph, and 1-tap A4 printable handout export.

---

## 5. Automated Test Suite & Verification

The offline linguistic engine and acoustic audio synthesizer are backed by an automated test suite verifying **44 core linguistic capabilities**:

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
| **7. Real-Time Latency Benchmark** | 1,000 continuous translation loops evaluated via `process.hrtime` | ✅ **0.0067 ms PASS** |

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

---

*Developed for Smart India Hackathon 2026 — Problem Statement SIH 26042.*  
*Authored & Maintained by Puneet Mehta (`puneetmehta288@gmail.com`).*
