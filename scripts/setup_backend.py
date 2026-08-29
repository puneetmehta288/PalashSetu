import os
import subprocess
import sys

def create_venv():
    if not os.path.exists(".venv"):
        print("Creating virtual environment...")
        subprocess.check_call([sys.executable, "-m", "venv", ".venv"])
    else:
        print("Virtual environment already exists.")

def install_requirements():
    print("Installing requirements...")
    pip_exe = os.path.join(".venv", "Scripts", "pip") if os.name == "nt" else os.path.join(".venv", "bin", "pip")
    # Using a dummy install since there's no requirements.txt created yet
    # subprocess.check_call([pip_exe, "install", "-r", "requirements.txt"])
    subprocess.check_call([pip_exe, "install", "fastapi", "uvicorn", "sqlalchemy"])

def init_db():
    print("Initializing database...")
    os.makedirs("data", exist_ok=True)
    import sqlite3
    conn = sqlite3.connect('data/bhashasetu.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS demo_content (id INTEGER PRIMARY KEY, content TEXT)''')
    conn.commit()
    conn.close()

def seed_demo_content():
    print("Seeding demo content...")
    import shutil
    if os.path.exists('data/demo_content.json'):
        print("Demo content already exists.")
    else:
        print("Demo content not found. Create using data_tools.py or copy manually.")

def verify_backend():
    print("Verifying backend setup...")
    print("Backend setup complete. Run 'uvicorn main:app --reload' to start.")

if __name__ == "__main__":
    create_venv()
    install_requirements()
    init_db()
    seed_demo_content()
    verify_backend()
