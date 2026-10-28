from typing import List, Optional
from pydantic import BaseModel, Field
from backend.schemas.common import BaseAgentOutput

class BoundingBox(BaseModel):
    x_min: float
    y_min: float
    x_max: float
    y_max: float
    confidence: float
    label: str = "Suspected Lesion"

class Agent1DetectionOutput(BaseAgentOutput):
    agent_id: str = "agent_1"
    model_identifier: str = "YOLOv8-BreastMRI-v1.0"
    lesions_detected: int = 0
    bounding_boxes: List[BoundingBox] = Field(default_factory=list)
    annotated_image_url: Optional[str] = None
    lesion_area_percentage: float = 0.0
