from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

from backend.schemas.common import AnalysisStatus, ScanModality, BaseAgentOutput
from backend.schemas.agent1_detection import Agent1DetectionOutput, BoundingBox
from backend.schemas.agent2_classification import Agent2ClassificationOutput, ClassProbability
from backend.schemas.agent3_explainability import Agent3GradCamOutput, GradCamMetadata, Coordinate
from backend.schemas.agent4_evidence import Agent4EvidenceOutput, ClinicalEvidenceItem
from backend.schemas.agent5_risk import Agent5RiskOutput, BIRADSAssessment, RiskIndicator
from backend.schemas.agent6_report import Agent6ReportOutput, DecisionSupportSummary

class AnalysisRecord(BaseModel):
    analysis_id: str
    patient_id: str
    modality: ScanModality = ScanModality.GENERIC_MRI
    status: AnalysisStatus = AnalysisStatus.PENDING
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Image Information
    filename: str
    filesize_bytes: int
    original_image_url: str
    original_image_path: str
    
    # 6-Agent Pipeline Results
    agent1_detection: Optional[Agent1DetectionOutput] = None
    agent2_classification: Optional[Agent2ClassificationOutput] = None
    agent3_explainability: Optional[Agent3GradCamOutput] = None
    agent4_evidence: Optional[Agent4EvidenceOutput] = None
    agent5_risk: Optional[Agent5RiskOutput] = None
    agent6_report: Optional[Agent6ReportOutput] = None
    
    # Orchestrator & State Tracking
    active_agent: Optional[str] = None
    progress_percentage: int = 0
    timeline: List[Dict[str, Any]] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)

__all__ = [
    "AnalysisStatus",
    "ScanModality",
    "BaseAgentOutput",
    "BoundingBox",
    "Agent1DetectionOutput",
    "ClassProbability",
    "Agent2ClassificationOutput",
    "Coordinate",
    "GradCamMetadata",
    "Agent3GradCamOutput",
    "ClinicalEvidenceItem",
    "Agent4EvidenceOutput",
    "BIRADSAssessment",
    "RiskIndicator",
    "Agent5RiskOutput",
    "DecisionSupportSummary",
    "Agent6ReportOutput",
    "AnalysisRecord"
]
