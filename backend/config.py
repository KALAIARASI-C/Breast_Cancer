import os
from pathlib import Path

# Base Paths
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent
STORAGE_DIR = BACKEND_DIR / "storage"
UPLOADS_DIR = STORAGE_DIR / "uploads"
HEATMAPS_DIR = STORAGE_DIR / "heatmaps"
REPORTS_DIR = STORAGE_DIR / "reports"

# Ensure all storage directories exist
for directory in (STORAGE_DIR, UPLOADS_DIR, HEATMAPS_DIR, REPORTS_DIR):
    directory.mkdir(parents=True, exist_ok=True)

# Server Config
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

# AI Model Configuration
MODEL_DIR = BACKEND_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
DEFAULT_RESNET_WEIGHTS = MODEL_DIR / "resnet50_breast_cancer.pth"
DEFAULT_YOLO_WEIGHTS = MODEL_DIR / "yolov8_tumor_detection.pt"

# Diagnostic Classes for Breast MRI
DIAGNOSTIC_CLASSES = ["Normal", "Benign", "Malignant"]
DEFAULT_TARGET_LAYER = "layer4" # ResNet standard last conv layer
