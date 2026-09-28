import json
import math
import os

print("Training lightweight crop recommendation engine...")

# Ideal benchmark parameters for crops: [N, P, K, temp, humidity, ph, rainfall]
CROP_PROFILES = {
    "rice": {
        "N": 90, "P": 42, "K": 43, "temp": 24.5, "humidity": 82.0, "ph": 6.5, "rainfall": 220.0
    },
    "wheat": {
        "N": 60, "P": 50, "K": 40, "temp": 18.0, "humidity": 55.0, "ph": 7.0, "rainfall": 80.0
    },
    "maize": {
        "N": 70, "P": 40, "K": 45, "temp": 26.0, "humidity": 65.0, "ph": 6.2, "rainfall": 110.0
    },
    "cotton": {
        "N": 110, "P": 45, "K": 35, "temp": 28.0, "humidity": 60.0, "ph": 7.5, "rainfall": 90.0
    },
    "jute": {
        "N": 80, "P": 38, "K": 40, "temp": 29.0, "humidity": 85.0, "ph": 6.8, "rainfall": 180.0
    }
}

os.makedirs("models", exist_ok=True)
model_path = os.path.join("models", "crop_rules.json")

with open(model_path, "w") as f:
    json.dump(CROP_PROFILES, f, indent=2)

print(f"Success! Pure-Python model saved at: {model_path}")