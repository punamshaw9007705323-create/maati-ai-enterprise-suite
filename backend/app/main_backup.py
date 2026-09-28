from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import math
import os

app = FastAPI(title="Maati AI Enterprise Suite", version="2.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join("models", "crop_rules.json")

def load_profiles():
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "rice": {"N": 80, "P": 40, "K": 40, "temp": 24.0, "humidity": 82.0, "ph": 6.5, "rainfall": 200.0},
        "wheat": {"N": 60, "P": 50, "K": 40, "temp": 18.5, "humidity": 58.0, "ph": 6.8, "rainfall": 80.0},
        "maize": {"N": 75, "P": 45, "K": 40, "temp": 25.0, "humidity": 65.0, "ph": 6.2, "rainfall": 100.0},
        "cotton": {"N": 120, "P": 45, "K": 35, "temp": 28.0, "humidity": 60.0, "ph": 7.2, "rainfall": 85.0},
        "jute": {"N": 80, "P": 40, "K": 40, "temp": 28.5, "humidity": 85.0, "ph": 6.8, "rainfall": 180.0},
        "chickpea": {"N": 40, "P": 65, "K": 80, "temp": 19.0, "humidity": 18.0, "ph": 7.0, "rainfall": 75.0}
    }

SURVEILLANCE_DATA = [
    {
        "id": "INC-101",
        "village": "Rampur Sector A",
        "crop": "Tomato",
        "disease": "Tomato Late Blight",
        "severity": "CRITICAL",
        "lat": 22.5726,
        "lng": 88.3639,
        "confidence": 94.2,
        "status": "PENDING"
    },
    {
        "id": "INC-102",
        "village": "Kalyani North",
        "crop": "Rice",
        "disease": "Rice Blast",
        "severity": "HIGH",
        "lat": 22.9751,
        "lng": 88.4345,
        "confidence": 76.5,
        "status": "NEEDS_EXPERT_REVIEW"
    },
    {
        "id": "INC-103",
        "village": "Barasat East",
        "crop": "Potato",
        "disease": "Early Blight",
        "severity": "MODERATE",
        "lat": 22.7236,
        "lng": 88.4817,
        "confidence": 91.0,
        "status": "RESOLVED"
    },
    {
        "id": "INC-104",
        "village": "Howrah Rural Belt",
        "crop": "Jute",
        "disease": "Stem Rot",
        "severity": "HIGH",
        "lat": 22.5958,
        "lng": 88.2636,
        "confidence": 88.5,
        "status": "NEEDS_EXPERT_REVIEW"
    }
]

class SoilInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class LoginInput(BaseModel):
    username: str
    password: str
    role: str

@app.get("/")
def home():
    profiles = load_profiles()
    return {"project": "Maati AI", "version": "2.5.0", "status": "Backend Active", "loaded_crop_profiles": len(profiles)}

@app.post("/api/v1/auth/login")
def login(creds: LoginInput):
    if creds.username.strip() and creds.password.strip():
        badge = "District Agriculture Officer" if creds.role == "officer" else "Verified Krishi Farmer"
        return {
            "status": "SUCCESS",
            "token": "maati_jwt_session_token_ok",
            "user": {
                "name": creds.username.strip(),
                "role": creds.role,
                "badge": badge
            }
        }
    raise HTTPException(status_code=400, detail="Invalid username or password.")

@app.post("/api/v1/recommend-crop")
def recommend_crop(data: SoilInput):
    profiles = load_profiles()
    weights = {"N": 1.0, "P": 1.0, "K": 1.0, "temp": 2.0, "humidity": 1.5, "ph": 5.0, "rainfall": 0.5}
    user_vals = {
        "N": data.N, "P": data.P, "K": data.K,
        "temp": data.temperature, "humidity": data.humidity,
        "ph": data.ph, "rainfall": data.rainfall
    }

    scores = []
    for crop, prof in profiles.items():
        dist = math.sqrt(sum(((user_vals[k] - prof[k]) * weights[k]) ** 2 for k in weights))
        conf = max(65.0, min(98.8, 100.0 - (dist * 0.12)))
        scores.append((crop, round(conf, 1), dist))

    scores.sort(key=lambda x: x[2])
    best_crop, best_conf, _ = scores[0]
    alternatives = [f"{c[0].capitalize()} ({c[1]}%)" for c in scores[1:4]]

    return {
        "crop": best_crop,
        "confidence": best_conf,
        "alternatives": alternatives,
        "status": "SUCCESS"
    }

@app.post("/api/v1/detect-disease")
async def detect_disease(file: UploadFile = File(...)):
    filename = file.filename.lower() if file.filename else ""
    if "rice" in filename:
        disease = "Rice Blast (Magnaporthe oryzae)"
        treatment = {
            "organic": "Seed treatment with Pseudomonas fluorescens @ 10g/kg. Avoid excess Nitrogen fertilizer.",
            "chemical": "Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5 ml/L.",
            "spray": "Spray in early morning calm wind. Do not spray if rainfall expected within 4 hours.",
            "audioText": "Dhaan me jhulsa rog paya gaya hai. Tricyclazole ka spray karein aur nitrogen khad kam karein."
        }
    elif "potato" in filename:
        disease = "Potato Early Blight (Alternaria solani)"
        treatment = {
            "organic": "Foliar spray with Trichoderma viride and remove infected bottom canopy leaves.",
            "chemical": "Chlorothalonil 75% WP @ 2.0g/L or Mancozeb 75% WP @ 2.5g/L.",
            "spray": "Spray after dew has dried up. Avoid night sprinkler irrigation.",
            "audioText": "Aloo me ageti jhulsa ke lakshan hain. Mancozeb ya Chlorothalonil ka chhidkaw karein."
        }
    else:
        disease = "Tomato Late Blight (Phytophthora infestans)"
        treatment = {
            "organic": "Neem oil azadirachtin 10,000 ppm @ 3ml/L or Copper oxychloride @ 2.5g/L.",
            "chemical": "Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L of water.",
            "spray": "Spray immediately under dry sunny conditions. Pre-harvest interval is 7 days.",
            "audioText": "Tamatar me pacheti jhulsa rog mila hai. Metalaxyl aur Mancozeb ka turant ghol bana kar chhidkein."
        }

    return {
        "disease": disease,
        "confidence": 94.6,
        "treatment": treatment
    }

@app.get("/api/v1/surveillance/hotspots")
def get_hotspots():
    pending = sum(1 for i in SURVEILLANCE_DATA if i["status"] != "RESOLVED")
    critical = sum(1 for i in SURVEILLANCE_DATA if i["severity"] == "CRITICAL")
    return {
        "status": "SUCCESS",
        "total_active_clusters": len(SURVEILLANCE_DATA),
        "pending_triages": pending,
        "high_risk_zones": critical,
        "incidents": SURVEILLANCE_DATA
    }

@app.post("/api/v1/surveillance/verify/{incident_id}")
def verify_incident(incident_id: str):
    for item in SURVEILLANCE_DATA:
        if item["id"] == incident_id:
            item["status"] = "RESOLVED"
            return {"status": "SUCCESS", "message": f"{incident_id} marked as resolved."}
    raise HTTPException(status_code=404, detail="Incident not found.")