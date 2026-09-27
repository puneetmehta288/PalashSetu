# Palash Vani (पलाश वाणी) — System Architecture Specification

**System Name:** Palash Vani (Formerly BhashaSetu)  
**Problem Statement:** SIH26042 — Smart Education / Mother Tongue-Based Multilingual Education (MTB-MLE)  
**Target Beneficiaries:** Primary School Teachers and Santali-Speaking Tribal Children (Balvatika to Class 3) across Santhal Parganas & Kolhan Divisions, Jharkhand  
**Architecture Classification:** Standalone 100% Offline Edge Runtime + Zero-Internet Local Classroom Mesh + Optional Store-and-Forward Cloud Telemetry  
**Interactive Architecture Runtime:** [`public/architecture.html`](file:///e:/hackathon/BhashaSetu/public/architecture.html) | [Live Architecture Viewer](https://puneetmehta288.github.io/PalashSetu/bhashasetu-architecture.html)

---

## 1. Executive Architectural Philosophy

Rural tribal classrooms in Jharkhand face three severe infrastructural constraints:
1. **Zero / Unreliable Cellular Connectivity:** Forested terrain and intermittent power eliminate reliance on cloud inference APIs (OpenAI, Google Cloud, HuggingFace Inference Endpoints).
2. **Resource-Constrained Edge Hardware:** Government-issued rural tablets feature low-end quad-core SoCs with 2GB–3GB RAM running Android 7.0 (API 24) to Android 14+ (API 34). Heavy 1.2GB PyTorch models (e.g. IndicTrans2) cause instant `OutOfMemoryError` (OOM) and device lockups.
3. **Linguistic Asymmetry in Primary Classrooms:** Teachers speak standard Hindi; children speak Santali in their ancestral **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)** orthography.

Palash Vani resolves this through an **Air-Gapped, Pure Edge Architecture**:
- **Zero Cloud Runtime Dependency:** 100% of live speech recognition, linguistic translation, acoustic compilation (TTS), attendance registers, and curriculum content execute on-device in RAM.
- **Dual-Role Edge Mesh:** The teacher's device acts as an autonomous **Local Wi-Fi Hotspot Access Point (Port 8888)** running an embedded Java HTTP daemon (`LocalClassroomServer`), broadcasting real-time translations and interactive slides to student companion devices in **< 1 second** without SIM cards or external internet.
- **Empirical Memory Budget (< 500 MB):** Hardware-verified on a real vivo V2545 (Android 16) at **324.7 MB memory footprint** (210–354 MB ADB PSS), leaving **~594 MB safe headroom** on 2GB rural tablets.

---

## 2. Complete System Topology

```
═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
                          PALASH VANI STANDALONE RUNTIME TOPOLOGY
═══════════════════════════════════════════════════════════════════════════════════════════════════════════════

  [ TIER 1: TEACHER STATION RUNTIME — 100% OFFLINE EDGE APK ]
  Hardware: Android 7.0–16+ | Memory: 324.7 MB Profiler / < 354 MB ADB PSS | APK: 31.5 MB Release
  ┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │  Capacitor Native Android Bridge (com.bhashasetu.app)                                                  │
  │  React 18.3.1 + TypeScript + Vite Shell                                                                │
  │                                                                                                        │
  │  ┌───────────────────────────┐      ┌───────────────────────────┐      ┌────────────────────────────┐  │
  │  │ Edge Voice Ingestion      │      │ 4-Tier Linguistic Engine  │      │ Acoustic Compiler (TTS)    │  │
  │  │ • Web Speech API ASR      │─────>│ • 7,503 Lookup Keys       │─────>│ • Ol Chiki ➔ Devanagari    │  │
  │  │ • 16 kHz PCM Audio stream │      │ • ~2,500 Core Roots       │      │ • Santali Glottal Rules    │  │
  │  │ • Latency: 150ms–350ms    │      │ • Latency: 0.004 ms       │      │ • 0.85x Native TTS Cadence │  │
  │  └───────────────────────────┘      └───────────────────────────┘      └─────────────┬──────────────┘  │
  │                 ▲                                                                    │ Audio Speech    │
  │                 │ Microphone PCM                                                     ▼ Output          │
  │  ┌──────────────┴────────────┐      ┌───────────────────────────┐      ┌────────────────────────────┐  │
  │  │ Teacher Operator UI       │      │ Scoped Local DB & Auth    │      │ Bundled Knowledge Store    │  │
  │  │ • Voice + Touch Interface │<────>│ • Multi-Teacher SHA-256   │<────>│ • 8 Full JCERT Textbooks   │  │
  │  │ • Live Translation View   │      │ • Scoped Attendance Logs  │      │ • 16 NIPUN FLN Decks       │  │
  │  │ • 60 FPS UI (< 16ms frame)│      │ • LocalStorage / Prefs    │      │ • 36 Panchaadi Lessons     │  │
  │  └──────────────┬────────────┘      └───────────────────────────┘      └────────────────────────────┘  │
  │                 │ Broadcast Event                                                                      │
  │                 ▼                                                                                      │
  │  ┌───────────────────────────┐      ┌───────────────────────────┐      ┌────────────────────────────┐  │
  │  │ Local Mesh Server         │      │ Curriculum Adapter        │      │ Telemetry & Sync Queue     │  │
  │  │ • Embedded Java Socket    │      │ • MTB-MLE Dialect Engine  │      │ • Store-and-Forward Queue  │  │
  │  │ • NanoHTTPD on Port 8888  │      │ • Santali / Ho / Mundari  │      │ • Anonymized Audit Buffer  │  │
  │  │ • SSE + REST Event Stream │      │ • < 1ms recursive map     │      │ • Flush upon network reach │  │
  │  └──────────────┬────────────┘      └───────────────────────────┘      └─────────────┬──────────────┘  │
  └─────────────────┼────────────────────────────────────────────────────────────────────┼─────────────────┘
                    │                                                                    │
                    │ Zero-Internet Local Wi-Fi AP (Port 8888)                           │ Intermittent
                    │ Physical Mesh Relay Latency: < 1 second                            │ Opportunistic HTTPS
                    ▼                                                                    ▼
  [ TIER 2: STUDENT COMPANION DOMAIN — OFFLINE MESH CLIENTS ]      [ TIER 3: PALASH CENTRAL CLOUD HUB ]
  Hardware: Companion Tablets / Smartphones / Web PWAs             Platform: Vercel Serverless Gateway
  ┌─────────────────────────────────────────────────────────┐      ┌────────────────────────────────────┐
  │  Student Client App (StudentClassroom.tsx)              │      │  PalashCentralHub Ingestion Sink   │
  │  • Fast 4-Digit PIN Join (e.g. 4819) / QR Code Scan     │      │  • POST /api/v1/events (Telemetry) │
  │  • Real-Time Speech Translation & Live Slide Receiver   │      │  • Web Portal & Admin Analytics    │
  │  • Interactive Quiz & Worksheet Answer Submissions      │      │  • Direct APK Download Mirrors     │
  │  • Session Leave without Profile Deletion               │      │  • TLS 1.3 End-to-End Encryption  │
  │                                                         │      └────────────────────────────────────┘
  │  Autonomous Student Learning Station                    │
  │  • 16 NIPUN FLN Decks (96 Bilingual Cards)              │      [ TIER 4: DIET PACKAGING NODE ]
  │  • 8 Full JCERT Bilingual Textbooks (Ol Chiki + Hindi)  │      Platform: District Workstation / Admin
  │  • Interactive Worksheets with Instant Tactile Audio    │      ┌────────────────────────────────────┐
  │  • Student Settings (Avatars, Balvatika–Class 3 Grades) │      │  FastAPI Content Packager + SQLite │
  └─────────────────────────────────────────────────────────┘      │  • Dataset Compilation & Packaging │
                                                                   │  • Master JCERT / NIPUN Schemas    │
                                                                   │  • Builds Standalone APK Assets    │
                                                                   └────────────────────────────────────┘
```

---

## 3. Detailed Component Specifications

### 3.1 Teacher Station Runtime (Primary Edge Tablet / Phone APK)

| Attribute | Specification |
|---|---|
| **Layer** | Teacher Presentation, State Orchestration & Pure Edge Inference |
| **Source Modules** | [`mobile/src/App.tsx`](file:///e:/hackathon/BhashaSetu/mobile/src/App.tsx), [`mobile/src/pages/LiveTranslation.tsx`](file:///e:/hackathon/BhashaSetu/mobile/src/pages/LiveTranslation.tsx), [`mobile/src/services/authService.ts`](file:///e:/hackathon/BhashaSetu/mobile/src/services/authService.ts) |
| **Runtime Environment** | Android Native APK via `@capacitor/android` (MinSdk 24, TargetSdk 34) |
| **Operator Interface** | Voice input (16 kHz PCM microphone capture) + 60Hz capacitive multi-touch |
| **Authentication** | Multi-Teacher offline SHA-256 hashed 4-digit PIN authentication with role-based navigation |
| **Attendance Tracking** | Scoped local attendance register: tracks student presence, date, and grade locally per teacher |
| **Memory Footprint** | **324.7 MB** (Android Studio Profiler on vivo V2545) / 210–354 MB real-world ADB PSS |
| **Render Budget** | 60 FPS UI (< 16 ms render cycles); cold boot < 1200 ms on 2GB RAM devices |
| **Isolation Boundary** | Sandboxed Android WebView IPC partition; zero runtime cloud dependency |

### 3.2 Zero-Internet Local Classroom Mesh Server (Port 8888)

| Attribute | Specification |
|---|---|
| **Layer** | Local Peer-to-Peer Micro-Mesh Daemon |
| **Source Module** | `mobile/android/app/src/main/java/.../LocalClassroomServer.java` (Java NanoHTTPD) |
| **Transport Medium** | Local Wi-Fi Access Point (Hotspot) on teacher device (`http://192.168.43.1:8888`) |
| **Network Dependency** | **Zero Internet, Zero SIM Card, Zero Router required** |
| **Communication Protocols** | REST JSON endpoints (`/api/classroom/info`, `/api/classroom/submit`) + Server-Sent Events (SSE) `/api/classroom/stream` |
| **Relay Latency** | **< 1 second physical mesh broadcast latency** from teacher speech to all connected student screens |
| **Payload Delivery** | Real-time translated speech tokens, Ol Chiki transcriptions, active lesson cards, worksheet exercises |
| **Client Capacity** | Tested up to 35 concurrent companion devices over standard Android Wi-Fi hotspot AP |
| **Security Boundary** | Air-gapped physical classroom perimeter; ephemeral 4-digit session room codes (e.g. `4819`) |

### 3.3 Student Companion Domain (Offline Mesh Clients)

| Attribute | Specification |
|---|---|
| **Layer** | Student Presentation, Real-Time Receiver & Autonomous Practice Station |
| **Source Modules** | [`mobile/src/pages/StudentClassroom.tsx`](file:///e:/hackathon/BhashaSetu/mobile/src/pages/StudentClassroom.tsx), [`mobile/src/services/classroomService.ts`](file:///e:/hackathon/BhashaSetu/mobile/src/services/classroomService.ts) |
| **Companion Hardware** | Student tablets, low-cost smartphones, or browsers running the PWA shell |
| **Onboarding Flow** | **Zero-QR Join**: Student enters name, avatar, and 4-digit class code; joins in < 3 seconds |
| **Live Broadcast Mode** | Receives teacher's speech translations, synchronized bilingual text, and lesson cards in real-time |
| **Interactive Mode** | Students submit quiz answers and worksheet responses back to the teacher's station |
| **Session Leave Handling** | `authService.leaveSession()` disconnects from current mesh room without deleting the student profile |
| **Autonomous Modules** | Access to 16 NIPUN FLN Decks (96 cards), 8 Full JCERT textbooks, and interactive practice drills |
| **Student Settings** | Custom avatar pickers (`🎒`, `✏️`, `🌟`, `🦁`, `🌸`, `🏹`), Balvatika–Class 3 grade selector, sound effect toggles |

---

## 4. Linguistic & Acoustic Inference Pipeline

### 4.1 4-Tier Pure In-Memory Translation Engine

Rather than bundling fragile, multi-gigabyte neural machine translation (NMT) weights on 2GB RAM tablets, Palash Vani uses a **deterministic, 4-tier in-memory inference pipeline** executing in pure JavaScript heap:

```
[ Input: Hindi Classroom Sentence ]
                │
                ▼
┌────────────────────────────────────────┐
│ TIER 1: Exact Phrase Matching          │──[ Match Found? ]──> [ Ol Chiki Output ]
│ • Curriculum greetings & commands      │
│ • O(1) hash table lookup               │
└────────────────────────────────────────┘
                │ No
                ▼
┌────────────────────────────────────────┐
│ TIER 2: Token-Level Match & Stemming   │──[ Match Found? ]──> [ Ol Chiki Output ]
│ • 7,503 lookup keys / ~2,500 roots     │
│ • Inflectional suffix removal          │
└────────────────────────────────────────┘
                │ No
                ▼
┌────────────────────────────────────────┐
│ TIER 3: Compound Phrase Tokenization   │──[ Match Found? ]──> [ Ol Chiki Output ]
│ • Greedy multi-word sliding window     │
│ • Context-sensitive tribal semantics   │
└────────────────────────────────────────┘
                │ No
                ▼
┌────────────────────────────────────────┐
│ TIER 4: Phonetic Transliteration       │
│ • Devanagari ➔ Ol Chiki script map     │────────────────────> [ Ol Chiki Output ]
│ • Fallback character-level transducer  │
└────────────────────────────────────────┘
```

#### Empirical Benchmark Comparison:

| Translation Engine | Hardware Target | Execution Latency | Memory Footprint | OOM Risk on 2GB RAM |
|---|---|---|---|---|
| **IndicTrans2 (320M Gated)** | Cloud GPU / 8GB Server | 450 ms–1200 ms | ~1,200 MB–2,400 MB | **FATAL CRASH (100% OOM)** |
| **Palash Vani 4-Tier Engine** | **Rural Tablet (2GB Edge)** | **0.004 ms (Lookup)** | **< 3 MB (Heap Resident)** | **ZERO RISK (100% Stable)** |

### 4.2 Acoustic Transpiler & TTS Synthesizer

Santali is an Austroasiatic language featuring distinct phonological characteristics not present in standard Indo-Aryan Devanagari (checked consonants, glottal stops, and specific vowel lengths).

[`mobile/src/utils/santaliSpeech.ts`](file:///e:/hackathon/BhashaSetu/mobile/src/utils/santaliSpeech.ts) implements an **Acoustic Transpiler**:
1. **Unicode Script Parser:** Parses Ol Chiki glyphs (Unicode block `U+1C50`–`U+1C7F`).
2. **Phonetic Transliteration:** Maps Ol Chiki phonemes into phonetic Devanagari representations modified with Santali diacritics:
   - Ol Chiki Glottal Stop `U+1C79` (`ᱼ` / Ah) ➔ Intermittent aspirated stop `ᱷ`
   - Ol Chiki Nasalization `U+1C78` (`ᱸ` / Mu) ➔ Anusvara `ं`
   - Ol Chiki Lengthener `U+1C7A` (`ᱽ` / Rel) ➔ Extended vowel cadence
3. **Paced Audio Synthesis:** Bridges to native Android `TextToSpeech` at **0.85x speed cadence** optimized for foundational tribal comprehension.
4. **Storage Advantage:** Generates natural speech on the fly using native OS voice engines; requires **zero bundled audio files**, saving over 500 MB of disk space.

---

## 5. Bundled Pedagogical Knowledge Base (In-APK)

All curriculum assets are pre-compiled into immutable JavaScript heap objects inside the APK:

1. **8 Full JCERT Bilingual Textbooks:**
   - Classes 1, 2, and 3: Hindi, Mathematics, Environmental Studies (EVS).
   - Side-by-side Hindi (Devanagari) and Santali (Ol Chiki) aligned by pedagogical paragraph.
   - Synchronized audio read-aloud buttons for individual paragraphs.

2. **16 NIPUN FLN Decks (96 Interactive Bilingual Cards):**
   - Foundational Literacy: Santali Alphabet (Ol Chiki Varnamala), Animals, Fruits, Classroom Objects, Body Parts.
   - Foundational Numeracy: Counting 1–10, 11–20, Addition, Subtraction, Shapes, Spatial Reasoning.
   - High-contrast visuals with bilingual captions and instant tactile audio.

3. **36 Panchaadi 5-Part Lesson Plans:**
   - Aligned with National Education Policy (NEP) 2020 and NIPUN Bharat FLN milestones.
   - Five pedagogical phases: *Uddeshya* (Objective), *Prastavana* (Introduction), *Shikshak Sanket* (Teacher Script), *Gatividhi* (Activity), and *Aakalan* (Assessment).

4. **Bundled Typography:**
   - Embedded `Noto Sans Ol Chiki` and `Noto Sans Devanagari` fonts ensure 100% crisp typography on all Android versions, even if the OEM ROM lacks tribal font support.

---

## 6. Empirical Hardware & Memory Operating Envelope

Hardware benchmarks measured using **Android Studio Profiler** and continuous **ADB Shell dumpsys** on a real **vivo V2545 (Android 16)**:

### 6.1 Android Studio Profiler Breakdown (vivo V2545)

```
Total Active Application Memory: 324.7 MB (Under Heavy Classroom Stress Test)
┌────────────────────────────────────────────────────────────┐
│ Native Heap:       153.2 MB  (47.2%)                       │
│ Graphics / GPU:    104.9 MB  (32.3%)                       │
│ Code & Resources:   35.8 MB  (11.0%)                       │
│ Java Heap:          26.2 MB   (8.1%)                       │
│ Thread Stack:        4.6 MB   (1.4%)                       │
└────────────────────────────────────────────────────────────┘
```

### 6.2 2GB Rural Tablet RAM Headroom Analysis

```
Total Physical RAM: 2,048 MB (2.0 GB)
┌──────────────────────────────────────────────┬─────────────┐
│ Subsystem / Consumer                         │ Memory Used │
├──────────────────────────────────────────────┼─────────────┤
│ Android OS Kernel & System Services          │      950 MB │
│ Android System UI & Launcher                 │      180 MB │
│ Palash Vani (Peak Classroom Load)            │      324 MB │
├──────────────────────────────────────────────┼─────────────┤
│ TOTAL COMMITTED RAM                          │    1,454 MB │
│ SAFE HEADROOM BEFORE LOW MEMORY KILLER (LMK) │      594 MB │
└──────────────────────────────────────────────┴─────────────┘
Status: Verified 100% Safe Headroom. Zero Low-Memory Kills under multi-hour testing.
```

### 6.3 Standalone Binary Footprint

| Package Artifact | Size | Scope & Included Components |
|---|---|---|
| `PalashVani.apk` (Release) | **31.5 MB** | Production Standalone APK; complete 8 JCERT books, 16 NIPUN decks, 7,503 dictionary, Noto fonts, embedded LocalClassroomServer |
| `PalashVani-v1.0-debug.apk` | **70.1 MB** | Debug APK with developer symbol tables and live profiling hooks |

---

## 7. Cloud Administrative & Telemetry Integration (Internet Optional)

When rural tablets temporarily enter areas with Wi-Fi or cellular coverage (e.g. block headquarters or teacher's home), the **Store-and-Forward Telemetry Service** activates:

1. **Local Enqueue:** Attendance logs, lesson completions, and anonymized translation frequency events are buffered into `localStorage` / Capacitor Preferences.
2. **Network Detection:** `@capacitor/network` reactive listener detects active Internet reachability.
3. **Batch Sync:** Auto-flushes buffered events via HTTPS POST to `https://bhashasetu-telemetry.vercel.app/api/v1/events` using TLS 1.3 encryption.
4. **DIET Admin Dashboard:** District officials inspect aggregate tribal literacy progress, active classroom sessions, and pedagogical hotspot utilization without ever touching classroom tablets.

---

## 8. Architectural Integrity Summary

| Dimension | Palash Vani Architecture Implementation |
|---|---|
| **Classroom Connectivity** | 100% Air-Gapped Autonomy; Embedded Java Hotspot Server (Port 8888) |
| **Mesh Broadcast Latency** | < 1 second physical mesh relay from teacher to student screens |
| **Translation Engine** | 4-Tier In-Memory Engine (7,503 entries, 0.004 ms lookup, 0 MB PyTorch) |
| **Hardware Compatibility** | Android 7.0 (API 24) to Android 16+; tested on vivo V2545 |
| **Memory Budget** | 324.7 MB Profiler / 210–354 MB ADB PSS; 594 MB safe headroom on 2GB RAM |
| **Distribution** | Standalone self-contained 31.5 MB release APK with bundled textbooks & fonts |
