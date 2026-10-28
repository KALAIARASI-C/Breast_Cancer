from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from backend.schemas.agent3_explainability import Agent3GradCamOutput
from backend.agents.agent3_gradcam import gradcam_service
from backend.orchestrator.pipeline import orchestrator

router = APIRouter(prefix="/api/explainability", tags=["Agent 3: Grad-CAM Explainability"])

class ExplainabilityRequest(BaseModel):
    analysis_id: str
    target_class: Optional[str] = "Malignant"
    target_layer: Optional[str] = "layer4"
    colormap: Optional[str] = "jet"
    alpha_blend: Optional[float] = 0.55

@router.post("/gradcam", response_model=Agent3GradCamOutput)
async def generate_gradcam_explanation(request: ExplainabilityRequest):
    """
    Dedicated endpoint for Agent 3 Grad-CAM Explainability.
    Allows dynamic exploration of target layer, colormap, and alpha blend.
    """
    record = orchestrator.get_record(request.analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis case not found.")

    bbox = None
    if record.agent1_detection and record.agent1_detection.bounding_boxes:
        b = record.agent1_detection.bounding_boxes[0]
        bbox = {"x_min": b.x_min, "y_min": b.y_min, "x_max": b.x_max, "y_max": b.y_max}

    confidence = 0.88
    if record.agent2_classification:
        confidence = record.agent2_classification.confidence

    # Re-run Grad-CAM engine with custom parameters
    engine = gradcam_service
    if request.colormap and request.colormap != engine.colormap:
        from backend.agents.agent3_gradcam import GradCamEngine
        engine = GradCamEngine(target_layer=request.target_layer or "layer4", colormap=request.colormap)

    result = engine.generate_explainability(
        analysis_id=request.analysis_id,
        image_path=record.original_image_path,
        target_class=request.target_class or "Malignant",
        target_class_confidence=confidence,
        detection_bbox=bbox,
        alpha_blend=request.alpha_blend if request.alpha_blend is not None else 0.55
    )

    # Update record
    record.agent3_explainability = result
    return result

@router.get("/{analysis_id}", response_model=Agent3GradCamOutput)
async def get_gradcam_output(analysis_id: str):
    """Fetches existing Agent 3 Grad-CAM explainability output for a case."""
    record = orchestrator.get_record(analysis_id)
    if not record or not record.agent3_explainability:
        raise HTTPException(status_code=404, detail="Grad-CAM output not found for this analysis.")
    return record.agent3_explainability
