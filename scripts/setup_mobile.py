import os
import subprocess
import sys

def check_node():
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True, check=True)
        print(f"Node.js version: {result.stdout.strip()}")
    except Exception:
        print("Error: Node.js is not installed or not in PATH.")
        sys.exit(1)

def run_npm_install():
    mobile_dir = "mobile"
    if not os.path.exists(mobile_dir):
        print("Mobile directory not found. Needs Implementation.")
        return
    print("Running npm install in mobile/")
    subprocess.check_call(["npm", "install"], cwd=mobile_dir, shell=True)

def run_npm_build():
    mobile_dir = "mobile"
    if not os.path.exists(mobile_dir):
        return
    print("Running npm run build...")
    subprocess.check_call(["npm", "run", "build"], cwd=mobile_dir, shell=True)

def check_capacitor():
    mobile_dir = "mobile"
    if not os.path.exists(mobile_dir):
        return
    try:
        subprocess.run(["npx", "cap", "--version"], cwd=mobile_dir, capture_output=True, check=True, shell=True)
        print("Capacitor CLI is available.")
    except Exception:
        print("Warning: Capacitor CLI is not available.")

def sync_android():
    mobile_dir = "mobile"
    if os.path.exists(os.path.join(mobile_dir, "android")):
        print("Running npx cap sync android...")
        subprocess.check_call(["npx", "cap", "sync", "android"], cwd=mobile_dir, shell=True)
    else:
        print("Android project does not exist yet. Run npx cap add android first.")

if __name__ == "__main__":
    check_node()
    run_npm_install()
    run_npm_build()
    check_capacitor()
    sync_android()
