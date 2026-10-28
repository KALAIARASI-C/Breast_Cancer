from typing import List, Tuple, Optional, Dict, Any
from pydantic import BaseModel, Field
from backend.schemas.common import BaseAgentOutput

class Coordinate(BaseModel):
    x: int
    y: int

class GradCamMetadata(BaseModel):
    target_layer: str
    target_class: str
    target_class_confidence: float
    peak_activation_coords: Coordinate
    peak_intensity: float
    mean_intensity: float
    coverage_ratio: float # Fraction of ROI with activation > 0.5
    input_resolution: Tuple[int, int]
    heatmap_resolution: Tuple[int, int]
    colormap: str = "jet"
    alpha_blend: float = 0.5
    computation_engine: str = "PyTorch-GradCAM-v1.0"

class Agent3GradCamOutput(BaseAgentOutput):
    analysis_id: str
    agent_id: str = "agent_3"
    source_agent_ids: List[str] = Field(default_factory=lambda: ["agent_1", "agent_2"])
    target_class: str
    original_image_url: str
    heatmap_url: str
    overlay_url: str
    model_identifier: str = "ResNet50-Layer4-GradCAM"
    explanation_metadata: Optional[GradCamMetadata] = None
    attribution_interpretation: str = ""
    target_box_overlap_iou: Optional[float] = None
