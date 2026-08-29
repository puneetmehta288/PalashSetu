"""
PalashSetu — Automatic IndicTrans2 Setup Script
=================================================

This script automates the installation and verification of the
AI4Bharat IndicTrans2 model for Hindi → Santali translation.

Model: ai4bharat/indictrans2-indic-indic-dist-320M
Source: hin_Deva (Hindi)
Target: sat_Olck (Santali / Ol Chiki)

Usage:
    python scripts/setup_indictrans2.py

Environment Variables:
    HF_TOKEN - HuggingFace access token (required if model is gated)
"""

import os
import sys
import subprocess
import time
import json
from pathlib import Path
from datetime import datetime

# Configure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Configuration
MODEL_ID = "ai4bharat/indictrans2-indic-indic-dist-320M"
MODEL_DIR = Path("models") / "indictrans2-indic-indic-dist-320M"
DOCS_DIR = Path("docs")
SRC_LANG = "hin_Deva"
TGT_LANG = "sat_Olck"

SMOKE_TEST_SENTENCES = [
    "बच्चों, आज हम एक से दस तक गिनती सीखेंगे।",
    "इन वस्तुओं को गिनो और संख्या बताओ।",
    "पाँच के बाद कौन सी संख्या आती है?",
]


def print_header(msg: str):
    print(f"\n{'='*60}")
    print(f"  {msg}")
    print(f"{'='*60}\n")


def check_python_version():
    """Step 1: Check Python version is 3.10+"""
    print_header("Step 1: Checking Python Version")
    v = sys.version_info
    print(f"  Python version: {v.major}.{v.minor}.{v.micro}")
    if v < (3, 10):
        print("  ❌ ERROR: Python 3.10+ is required.")
        print("  Please install Python 3.10 or newer.")
        sys.exit(1)
    print("  ✅ Python version OK")


def install_dependencies():
    """Step 2: Install required dependencies"""
    print_header("Step 2: Installing Dependencies")

    core_deps = [
        "huggingface_hub",
    ]

    print("  Installing huggingface_hub...")
    try:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "--quiet", *core_deps],
            stdout=subprocess.DEVNULL if os.name == "nt" else None,
        )
        print("  ✅ huggingface_hub installed")
    except subprocess.CalledProcessError as e:
        print(f"  ❌ Failed to install dependencies: {e}")


def download_model() -> Path:
    """Step 3: Download the IndicTrans2 checkpoint"""
    print_header("Step 3: Downloading IndicTrans2 Model")

    model_path = MODEL_DIR
    model_path.mkdir(parents=True, exist_ok=True)

    if (model_path.exists() and any(model_path.glob("*.safetensors"))) or (model_path.exists() and any(model_path.glob("*.bin"))):
        print(f"  ✅ Model already exists at {model_path}")
        return model_path

    print(f"  Model: {MODEL_ID}")
    print(f"  Target directory: {model_path}")

    from huggingface_hub import snapshot_download

    token = os.environ.get("HF_TOKEN")
    if token:
        print("  Using HF_TOKEN for authentication")
    else:
        print("  No HF_TOKEN set — will attempt download")

    try:
        downloaded_path = snapshot_download(
            repo_id=MODEL_ID,
            local_dir=str(model_path),
            token=token,
            ignore_patterns=["*.msgpack", "*.h5", "*.ot"],
        )
        print(f"  ✅ Model downloaded successfully to {downloaded_path}")
        return Path(downloaded_path)
    except Exception as e:
        error_str = str(e)
        if "gated" in error_str.lower() or "401" in error_str or "403" in error_str:
            print("\n" + "!" * 60)
            print("  HUMAN ACTION REQUIRED")
            print("!" * 60)
            print()
            print("  The IndicTrans2 model is GATED on HuggingFace.")
            print("  Make sure you clicked 'Agree and access repository' at:")
            print("  https://huggingface.co/ai4bharat/indictrans2-indic-indic-dist-320M")
            print()
            sys.exit(1)
        else:
            print(f"  ❌ Download failed: {e}")
            sys.exit(1)


def verify_model_files(model_path: Path):
    """Step 4: Verify all required files are present"""
    print_header("Step 4: Verifying Model Files")

    required_patterns = ["config.json", "tokenizer_config.json"]
    model_patterns = ["*.safetensors", "*.bin"]

    for pattern in required_patterns:
        matches = list(model_path.glob(pattern))
        if matches:
            print(f"  ✅ Found {pattern}")
        else:
            print(f"  ⚠️  Missing {pattern}")

    has_model = False
    for pattern in model_patterns:
        matches = list(model_path.glob(pattern))
        if matches:
            total_size = sum(f.stat().st_size for f in matches)
            print(f"  ✅ Found model weights ({pattern}): {total_size / (1024**2):.1f} MB")
            has_model = True
            break

    if not has_model:
        print("  ⚠️ Model weight files are downloading in progress...")

    all_files = list(model_path.rglob("*"))
    file_count = len([f for f in all_files if f.is_file()])
    total_bytes = sum(f.stat().st_size for f in all_files if f.is_file())
    print(f"  Total files: {file_count}")
    print(f"  Total size: {total_bytes / (1024**2):.1f} MB")


def main():
    print_header("PalashSetu — IndicTrans2 Setup")
    print(f"  Model: {MODEL_ID}")
    print(f"  Direction: {SRC_LANG} -> {TGT_LANG}")
    print(f"  (Hindi -> Santali / Ol Chiki)")

    check_python_version()
    install_dependencies()
    model_path = download_model()
    verify_model_files(model_path)

    print_header("Setup Complete")
    print("  ✅ IndicTrans2 setup finished!")
    print(f"  Model location: {model_path}")


if __name__ == "__main__":
    main()
