import uuid
import shutil
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from pydantic import BaseModel

from backend.config import UPLOADS_DIR
from backend.schemas import AnalysisRecord, ScanModality, AnalysisStatus
from backend.orchestrator.pipeline import orchestrator

router = APIRouter(prefix="/api/analysis", tags=["Analysis Pipeline"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".dcm", ".dicom", ".tif", ".tiff"}

@router.post("/upload", response_model=AnalysisRecord)
async def upload_mri(
    file: UploadFile = File(...),
    patient_id: str = Form(default="BRCA-PT-9012"),
    modality: str = Form(default="MRI_DCE"),
    run_immediate: bool = Form(default=True)
):
    """
    Uploads a patient MRI scan (PNG, JPG, DICOM) and registers a new analysis.
    If run_immediate is True, executes the full multi-agent pipeline (Agents 1-6).
    """
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    analysis_id = f"ANL-{uuid.uuid4().hex[:8].upper()}"
    save_filename = f"{analysis_id}_{file.filename}"
    save_path = UPLOADS_DIR / save_filename

    # Read and persist file
    try:
        content = await file.read()
        with open(save_path, "wb") as f:
            f.write(content)
        filesize = len(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save upload: {str(e)}")

    # Initialize analysis record in orchestrator
    record = orchestrator.initialize_analysis(
        analysis_id=analysis_id,
        patient_id=patient_id,
        image_path=str(save_path),
        filename=file.filename,
        filesize=filesize,
        modality=ScanModality.MRI_DCE
    )

    # Run complete multi-agent pipeline
    if run_immediate:
        record = orchestrator.run_pipeline(analysis_id)

    return record

@router.post("/{analysis_id}/run", response_model=AnalysisRecord)
async def trigger_pipeline(analysis_id: str):
    """Triggers multi-agent pipeline execution for an existing analysis."""
    record = orchestrator.get_record(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis case not found.")
    
    return orchestrator.run_pipeline(analysis_id)

@router.get("/{analysis_id}", response_model=AnalysisRecord)
async def get_analysis_status(analysis_id: str):
    """Fetches real-time status and output from all 6 agents for a specific analysis."""
    record = orchestrator.get_record(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis case not found.")
    return record

@router.get("", response_model=List[AnalysisRecord])
async def list_analyses():
    """Lists all recent patient MRI analyses."""
    return orchestrator.list_records()
