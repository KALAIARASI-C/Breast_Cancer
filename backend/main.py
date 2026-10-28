import os
import shutil
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config import (
    CORS_ORIGINS,
    STORAGE_DIR,
    UPLOADS_DIR,
    HEATMAPS_DIR,
    REPORTS_DIR,
    API_HOST,
    API_PORT
)
from backend.api.routes_analysis import router as analysis_router
from backend.api.routes_explainability import router as explainability_router
from backend.api.routes_reports import router as reports_router
from backend.orchestrator.pipeline import orchestrator
from backend.schemas.common import ScanModality

def seed_demo_case():
    """Seeds reference analysis case (ANL-DEMO001) for immediate UI review and testing."""
    for d in [STORAGE_DIR, UPLOADS_DIR, HEATMAPS_DIR, REPORTS_DIR]:
        d.mkdir(parents=True, exist_ok=True)

    demo_id = "ANL-DEMO001"
    demo_img_path = UPLOADS_DIR / "sample_breast_mri_dce.png"
    if not demo_img_path.exists():
        import numpy as np
        from PIL import Image
        arr = np.zeros((320, 320), dtype=np.uint8)
        y, x = np.ogrid[:320, :320]
        mask = ((x - 160)**2 + (y - 120)**2) < 130**2
        arr[mask] = 60
        parenchyma = ((x - 160)**2 + (y - 130)**2) < 85**2
        arr[parenchyma] = 110
        lesion = ((x - 175)**2 + (y - 110)**2) < 26**2
        arr[lesion] = 235
        Image.fromarray(arr).save(demo_img_path)

    if not orchestrator.get_record(demo_id):
        orchestrator.initialize_analysis(
            analysis_id=demo_id,
            patient_id="BRCA-PT-8842",
            image_path=str(demo_img_path),
            filename="sample_breast_mri_dce.png",
            filesize=os.path.getsize(demo_img_path),
            modality=ScanModality.MRI_DCE
        )
        orchestrator.run_pipeline(demo_id)
        print(f"[Breast CARE-MA] Seeded reference analysis case: {demo_id}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_demo_case()
    yield

app = FastAPI(
    title="Breast CARE-MA — Multi-Agent Clinical Decision Support API",
    description="Backend orchestration service for breast MRI tumor detection, classification, Grad-CAM explainability, and report generation.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Storage Directories
app.mount("/storage/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
app.mount("/storage/heatmaps", StaticFiles(directory=str(HEATMAPS_DIR)), name="heatmaps")
app.mount("/storage/reports", StaticFiles(directory=str(REPORTS_DIR)), name="reports")

# Include Routers
app.include_router(analysis_router)
app.include_router(explainability_router)
app.include_router(reports_router)

@app.get("/api/health")
async def health_check():
    """System health check & agent availability endpoint."""
    return {
        "status": "online",
        "system": "Breast CARE-MA Multi-Agent Decision Support",
        "version": "1.0.0",
        "agents": {
            "agent_1_detection": "active (YOLOv8)",
            "agent_2_classification": "active (ResNet50)",
            "agent_3_gradcam": "active (Grad-CAM Engine)",
            "agent_4_evidence_rag": "active (Biomedical RAG)",
            "agent_5_risk": "active (BI-RADS Assessor)",
            "agent_6_reports": "active (ReportLab Generator)"
        },
        "storage": {
            "uploads": str(UPLOADS_DIR),
            "heatmaps": str(HEATMAPS_DIR),
            "reports": str(REPORTS_DIR)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=API_HOST, port=API_PORT, reload=True)
