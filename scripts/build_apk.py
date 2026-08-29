import os
import subprocess
import sys

def build_web():
    print("Building web app...")
    mobile_dir = "mobile"
    if not os.path.exists(mobile_dir):
        print("Mobile directory not found. Skipping web build.")
        return False
    try:
        subprocess.check_call(["npm", "run", "build"], cwd=mobile_dir, shell=True)
        return True
    except subprocess.CalledProcessError:
        print("Failed to build web app.")
        return False

def sync_capacitor():
    print("Syncing Capacitor with Android...")
    mobile_dir = "mobile"
    try:
        subprocess.check_call(["npx", "cap", "sync", "android"], cwd=mobile_dir, shell=True)
        return True
    except subprocess.CalledProcessError:
        print("Failed to sync Capacitor.")
        return False

def check_android_reqs():
    missing = []
    if not os.environ.get("ANDROID_HOME"):
        missing.append("ANDROID_HOME")
    if not os.environ.get("JAVA_HOME"):
        missing.append("JAVA_HOME")
    
    if missing:
        print("Missing requirements:")
        for req in missing:
            print(f" - {req} environment variable is not set.")
        return False
    
    print("Android SDK and JDK environments found.")
    return True

def build_apk():
    print("Building APK...")
    android_dir = os.path.join("mobile", "android")
    if not os.path.exists(android_dir):
        print("Android directory not found.")
        return
        
    gradlew = "gradlew.bat" if os.name == "nt" else "./gradlew"
    try:
        subprocess.check_call([gradlew, "assembleDebug"], cwd=android_dir, shell=True)
        apk_path = os.path.join(android_dir, "app", "build", "outputs", "apk", "debug", "app-debug.apk")
        if os.path.exists(apk_path):
            print(f"APK successfully built! Path: {os.path.abspath(apk_path)}")
        else:
            print("Build completed but APK not found at expected path.")
    except subprocess.CalledProcessError:
        print("Failed to build APK.")

if __name__ == "__main__":
    if build_web():
        if sync_capacitor():
            if check_android_reqs():
                build_apk()
            else:
                print("Cannot build APK due to missing requirements.")
