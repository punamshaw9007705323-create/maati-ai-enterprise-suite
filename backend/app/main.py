from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

import base64
import hashlib
import hmac
import io
import json
import os
import re

from datetime import datetime, timezone, timedelta


# ============================================================
# APPLICATION
# ============================================================

APP_VERSION = "3.1.0"

app = FastAPI(
    title="Maati AI Enterprise Suite",
    version=APP_VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============================================================
# CROP RECOMMENDATION
# ============================================================

CROP_PROFILES = {
    "rice": {
        "N": (80, 120),
        "P": (35, 60),
        "K": (35, 60),
        "temperature": (22, 30),
        "humidity": (70, 90),
        "ph": (5.5, 7.0),
        "rainfall": (150, 300)
    },
    "maize": {
        "N": (60, 100),
        "P": (35, 60),
        "K": (30, 60),
        "temperature": (20, 30),
        "humidity": (50, 75),
        "ph": (5.5, 7.5),
        "rainfall": (60, 150)
    },
    "cotton": {
        "N": (60, 100),
        "P": (30, 60),
        "K": (30, 60),
        "temperature": (24, 35),
        "humidity": (45, 65),
        "ph": (5.5, 8.0),
        "rainfall": (50, 120)
    },
    "jute": {
        "N": (60, 100),
        "P": (30, 55),
        "K": (35, 65),
        "temperature": (24, 35),
        "humidity": (70, 90),
        "ph": (5.0, 7.5),
        "rainfall": (150, 300)
    },
    "wheat": {
        "N": (50, 90),
        "P": (30, 55),
        "K": (25, 55),
        "temperature": (15, 25),
        "humidity": (40, 65),
        "ph": (6.0, 7.5),
        "rainfall": (40, 100)
    }
}


CROP_WEIGHTS = {
    "N": 1.0,
    "P": 0.8,
    "K": 0.8,
    "temperature": 1.2,
    "humidity": 1.0,
    "ph": 1.0,
    "rainfall": 1.3
}


class CropRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


def range_score(value, minimum, maximum):
    if minimum <= value <= maximum:
        return 100.0

    if value < minimum:
        distance = minimum - value
    else:
        distance = value - maximum

    range_size = max(maximum - minimum, 1)
    penalty = (distance / range_size) * 100

    return max(0.0, 100.0 - penalty)


@app.post("/api/v1/recommend-crop")
def recommend_crop(req: CropRequest):

    values = req.model_dump()

    crop_scores = []

    for crop, profile in CROP_PROFILES.items():

        weighted_score = 0.0
        total_weight = 0.0

        for field, value in values.items():

            minimum, maximum = profile[field]

            score = range_score(
                value,
                minimum,
                maximum
            )

            weight = CROP_WEIGHTS.get(field, 1.0)

            weighted_score += score * weight
            total_weight += weight

        final_score = (
            weighted_score / total_weight
            if total_weight
            else 0
        )

        crop_scores.append(
            (
                crop,
                round(final_score, 1)
            )
        )

    crop_scores.sort(
        key=lambda item: item[1],
        reverse=True
    )

    recommended = crop_scores[0]

    alternatives = [
        {
            "crop": crop.title(),
            "confidence": confidence
        }
        for crop, confidence in crop_scores[1:4]
    ]

    return {
        "status": "SUCCESS",
        "recommended_crop": recommended[0].title(),
        "confidence": recommended[1],
        "alternatives": alternatives
    }


# ============================================================
# DISEASE DETECTION MODEL
# ============================================================

_model = None
_processor = None
_model_error = None

MODEL_ID = os.getenv(
    "MAATI_DISEASE_MODEL",
    "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
)


def load_model():

    global _model
    global _processor
    global _model_error

    if _model is not None:
        return _model, _processor

    if _model_error:
        return None, None

    try:

        from transformers import (
            AutoImageProcessor,
            AutoModelForImageClassification
        )

        _processor = AutoImageProcessor.from_pretrained(
            MODEL_ID
        )

        _model = AutoModelForImageClassification.from_pretrained(
            MODEL_ID
        )

        _model.eval()

        return _model, _processor

    except Exception as exc:

        _model_error = str(exc)

        return None, None


def clean_label(label):

    label = re.sub(
        r"^\d+\s*[-:]?\s*",
        "",
        str(label)
    )

    return label.replace(
        "_",
        " "
    ).strip()


def map_label(label):

    text = clean_label(label)
    lower = text.lower()

    crop = "Unknown"

    crop_mapping = [
        ("tomato", "Tomato"),
        ("potato", "Potato"),
        ("rice", "Rice"),
        ("wheat", "Wheat"),
        ("apple", "Apple"),
        ("grape", "Grape"),
        ("corn", "Corn"),
        ("maize", "Maize"),
        ("squash", "Squash"),
        ("pepper", "Pepper")
    ]

    for keyword, crop_name in crop_mapping:

        if keyword in lower:
            crop = crop_name
            break

    return (
        crop,
        text,
        "See agricultural expert for pathogen confirmation"
    )


def advisory_for(disease):

    disease_lower = disease.lower()

    if "healthy" in disease_lower:

        return {
            "organic": (
                "No treatment required. Continue balanced "
                "nutrition and regular field scouting."
            ),
            "chemical": (
                "No pesticide application is indicated "
                "from this screening result."
            ),
            "advisory": (
                "Continue monitoring and rescan if lesions, "
                "spots, rust or mildew appear."
            )
        }

    if "blast" in disease_lower:

        return {
            "organic": (
                "Remove heavily infected tissue where practical "
                "and maintain balanced nitrogen nutrition."
            ),
            "chemical": (
                "Use only a locally registered fungicide "
                "according to its label and local agricultural guidance."
            ),
            "advisory": (
                "Avoid prolonged leaf wetness and monitor new "
                "leaves after humid or rainy periods."
            )
        }

    if "rust" in disease_lower:

        return {
            "organic": (
                "Remove severely affected leaves where practical "
                "and maintain crop hygiene."
            ),
            "chemical": (
                "Use a locally registered rust fungicide "
                "according to the product label."
            ),
            "advisory": (
                "Scout new growth frequently during cool, "
                "humid weather."
            )
        }

    if "mildew" in disease_lower:

        return {
            "organic": (
                "Improve airflow and remove severely "
                "affected foliage."
            ),
            "chemical": (
                "Use a locally registered mildew fungicide "
                "according to its product label."
            ),
            "advisory": (
                "Avoid unnecessary leaf wetness and monitor "
                "dense canopy areas."
            )
        }

    if "blight" in disease_lower:

        return {
            "organic": (
                "Remove severely affected plant material, "
                "improve field sanitation and air circulation."
            ),
            "chemical": (
                "Use a locally registered disease-control "
                "product according to its label."
            ),
            "advisory": (
                "Monitor surrounding plants because blight "
                "can spread rapidly under favorable conditions."
            )
        }

    return {
        "organic": (
            "Remove severely affected plant material, "
            "improve air circulation and maintain field hygiene."
        ),
        "chemical": (
            "Use a locally registered disease-control product "
            "according to the label and local agricultural guidance."
        ),
        "advisory": (
            "Rescan after treatment and confirm uncertain "
            "cases with an agronomist."
        )
    }


@app.post("/api/v1/detect-disease")
async def detect_disease(
    file: UploadFile = File(...)
):

    if (
        not file.content_type
        or not file.content_type.startswith("image/")
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    raw = await file.read()

    if not raw:

        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    try:

        image = Image.open(
            io.BytesIO(raw)
        ).convert("RGB")

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=f"Invalid image: {exc}"
        )

    model, processor = load_model()

    if model is None:

        return {
            "status": "MODEL_UNAVAILABLE",
            "message": (
                "The disease model could not be loaded. "
                "Install the ML dependencies and allow the "
                "model to download on first run."
            ),
            "filename": file.filename
        }

    try:

        import torch

        inputs = processor(
            images=image,
            return_tensors="pt"
        )

        with torch.no_grad():

            outputs = model(**inputs)

            logits = outputs.logits

            probabilities = torch.softmax(
                logits,
                dim=-1
            )[0]

            index = int(
                torch.argmax(probabilities).item()
            )

            confidence = float(
                probabilities[index].item() * 100
            )

        label = model.config.id2label.get(
            index,
            str(index)
        )

        crop, disease, pathogen = map_label(
            label
        )

        advisory = advisory_for(
            disease
        )

        return {
            "status": "SUCCESS",
            "crop": crop,
            "disease": disease,
            "pathogen": pathogen,
            "confidence": round(
                confidence,
                1
            ),
            "description": (
                f"Model classification: "
                f"{clean_label(label)}. "
                "This is an AI screening result and "
                "should be field-verified for uncertain cases."
            ),
            "symptoms": [],
            "treatment": advisory,
            "model": MODEL_ID,
            "filename": file.filename
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Disease inference failed: {exc}"
        )


# ============================================================
# AUTHENTICATION
# ============================================================

AUTH_SECRET = os.getenv(
    "MAATI_AUTH_SECRET",
    "maati-ai-change-this-secret-in-production"
)

AUTH_TOKEN_HOURS = int(
    os.getenv(
        "MAATI_AUTH_TOKEN_HOURS",
        "12"
    )
)


AUTH_USERS = {

    "admin": {
        "username": os.getenv(
            "MAATI_ADMIN_USERNAME",
            "admin"
        ),
        "password": os.getenv(
            "MAATI_ADMIN_PASSWORD",
            "admin123"
        ),
        "role": "admin",
        "name": "Maati AI Administrator",
        "badge": "Platform Administrator"
    },

    "farmer": {
        "username": os.getenv(
            "MAATI_FARMER_USERNAME",
            "farmer"
        ),
        "password": os.getenv(
            "MAATI_FARMER_PASSWORD",
            "farmer123"
        ),
        "role": "farmer",
        "name": "Registered Farmer",
        "badge": "Registered Krishi Farmer"
    }
}


class LoginRequest(BaseModel):

    username: str
    password: str
    role: str


def create_session_token(
    username,
    role
):

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(
            hours=AUTH_TOKEN_HOURS
        )
    ).timestamp()

    payload = {
        "username": username,
        "role": role,
        "exp": int(expires_at)
    }

    payload_text = json.dumps(
        payload,
        separators=(",", ":"),
        sort_keys=True
    )

    encoded_payload = (
        base64.urlsafe_b64encode(
            payload_text.encode("utf-8")
        )
        .decode("utf-8")
        .rstrip("=")
    )

    signature = hmac.new(
        AUTH_SECRET.encode("utf-8"),
        encoded_payload.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    return (
        f"{encoded_payload}.{signature}"
    )


def verify_session_token(token):

    if not token:
        return None

    try:

        parts = token.split(
            ".",
            1
        )

        if len(parts) != 2:
            return None

        encoded_payload, signature = parts

        expected_signature = hmac.new(
            AUTH_SECRET.encode("utf-8"),
            encoded_payload.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(
            signature,
            expected_signature
        ):
            return None

        padding = "=" * (
            4 - len(encoded_payload) % 4
        )

        payload_text = (
            base64.urlsafe_b64decode(
                encoded_payload + padding
            )
            .decode("utf-8")
        )

        payload = json.loads(
            payload_text
        )

        if int(
            payload.get("exp", 0)
        ) < int(
            datetime.now(
                timezone.utc
            ).timestamp()
        ):
            return None

        return payload

    except Exception:

        return None


@app.post("/api/v1/auth/login")
def login(
    payload: LoginRequest
):

    username = payload.username.strip()

    password = payload.password

    role = payload.role.strip().lower()

    if role not in AUTH_USERS:

        raise HTTPException(
            status_code=401,
            detail="Invalid account role."
        )

    account = AUTH_USERS[role]

    username_matches = hmac.compare_digest(
        username,
        account["username"]
    )

    password_matches = hmac.compare_digest(
        password,
        account["password"]
    )

    if (
        not username_matches
        or not password_matches
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    token = create_session_token(
        account["username"],
        account["role"]
    )

    return {

        "status": "SUCCESS",

        "message": (
            "Authentication successful."
        ),

        "token": token,

        "user": {

            "username": account["username"],

            "name": account["name"],

            "role": account["role"],

            "badge": account["badge"]
        },

        "expires_in_hours": AUTH_TOKEN_HOURS
    }


def require_authenticated_user(
    authorization: str = Header(
        default=""
    )
):

    if not authorization.startswith(
        "Bearer "
    ):

        raise HTTPException(
            status_code=401,
            detail="Authentication required."
        )

    token = authorization.replace(
        "Bearer ",
        "",
        1
    ).strip()

    session = verify_session_token(
        token
    )

    if not session:

        raise HTTPException(
            status_code=401,
            detail=(
                "Invalid or expired "
                "authentication token."
            )
        )

    return session


def require_admin(
    authorization: str = Header(
        default=""
    )
):

    session = require_authenticated_user(
        authorization
    )

    if session.get("role") != "admin":

        raise HTTPException(
            status_code=403,
            detail="Administrator access required."
        )

    return session


# ============================================================
# NATIONAL AGRO SURVEILLANCE
# ============================================================

INCIDENTS = [

    {
        "id": "INC-101",
        "state": "West Bengal",
        "village": "Kolkata & 24 Parganas Belt",
        "crop": "Tomato",
        "disease": "Late Blight",
        "severity": "CRITICAL",
        "confidence": 94.2,
        "lat": 22.5726,
        "lng": 88.3639,
        "status": "PENDING",
        "time": "8 mins ago",
        "remedy": (
            "Mancozeb 75% WP according to "
            "local label guidance"
        )
    },

    {
        "id": "INC-102",
        "state": "Punjab",
        "village": "Ludhiana Agro Zone",
        "crop": "Wheat",
        "disease": "Yellow Rust",
        "severity": "CRITICAL",
        "confidence": 95.8,
        "lat": 30.9010,
        "lng": 75.8573,
        "status": "PENDING",
        "time": "15 mins ago",
        "remedy": (
            "Propiconazole according to "
            "local label guidance"
        )
    },

    {
        "id": "INC-103",
        "state": "Maharashtra",
        "village": "Nashik Onion Belt",
        "crop": "Onion",
        "disease": "Purple Blotch",
        "severity": "HIGH",
        "confidence": 89.2,
        "lat": 19.9975,
        "lng": 73.7898,
        "status": "PENDING",
        "time": "32 mins ago",
        "remedy": (
            "Difenoconazole according to "
            "local label guidance"
        )
    },

    {
        "id": "INC-104",
        "state": "Karnataka",
        "village": "Mandya Cauvery Basin",
        "crop": "Paddy (Rice)",
        "disease": "Bacterial Leaf Blight",
        "severity": "HIGH",
        "confidence": 91.5,
        "lat": 12.5244,
        "lng": 76.8958,
        "status": "PENDING",
        "time": "45 mins ago",
        "remedy": (
            "Follow state agriculture advisory "
            "for bacterial leaf blight"
        )
    }
]


@app.get(
    "/api/v1/surveillance/hotspots"
)
def hotspots():

    return {

        "status": "SUCCESS",

        "incidents": INCIDENTS,

        "updated_at": (
            datetime.now(
                timezone.utc
            ).isoformat()
        )
    }


@app.post(
    "/api/v1/surveillance/verify/{incident_id}"
)
def verify(

    incident_id: str,

    authorization: str = Header(
        default=""
    )

):

    require_admin(
        authorization
    )

    for item in INCIDENTS:

        if item["id"] == incident_id:

            item["status"] = "RESOLVED"

            item["verified_at"] = (
                datetime.now(
                    timezone.utc
                ).isoformat()
            )

            return {

                "status": "SUCCESS",

                "incident_id": incident_id,

                "new_status": "RESOLVED"
            }

    raise HTTPException(
        status_code=404,
        detail="Incident not found"
    )


# ============================================================
# ROOT / HEALTH
# ============================================================

@app.get("/")
def root():

    return {

        "project": "Maati AI",

        "version": APP_VERSION,

        "status": "Backend Active",

        "loaded_crop_profiles": len(
            CROP_PROFILES
        ),

        "disease_model": MODEL_ID,

        "authentication": "Enabled",

        "roles": [
            "admin",
            "farmer"
        ]
    }


@app.get("/health")
def health():

    return {

        "status": "OK",

        "service": "Maati AI API",

        "version": APP_VERSION
    }