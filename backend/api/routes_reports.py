import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from backend.config import REPORTS_DIR
from backend.orchestrator.pipeline import orchestrator
from backend.schemas.agent6_report import Agent6ReportOutput

router = APIRouter(prefix="/api/reports", tags=["Agent 6: Reports"])

@router.get("/{analysis_id}", response_model=Agent6ReportOutput)
async def get_report_metadata(analysis_id: str):
    """Fetches Agent 6 report metadata and structured summary."""
    record = orchestrator.get_record(analysis_id)
    if not record or not record.agent6_report:
        raise HTTPException(status_code=404, detail="Report not generated for this analysis.")
    return record.agent6_report

@router.get("/{analysis_id}/pdf")
async def download_report_pdf(analysis_id: str):
    """Downloads the generated clinical decision support PDF report."""
    record = orchestrator.get_record(analysis_id)
    pdf_filename = f"BreastCARE_Report_{analysis_id}.pdf"
    pdf_path = REPORTS_DIR / pdf_filename

    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail=f"Report PDF file '{pdf_filename}' not found.")

    return FileResponse(
        path=str(pdf_path),
        filename=pdf_filename,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename={pdf_filename}"}
    )
