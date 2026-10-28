from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from backend.schemas.common import BaseAgentOutput

class DecisionSupportSummary(BaseModel):
    case_id: str
    patient_id: str
    imaging_finding: str
    model_prediction: str
    confidence_display: str
    birads_category: str
    explainability_summary: str
    evidence_grounding_status: str
    recommended_action: str
    requires_clinical_review: bool = True

class Agent6ReportOutput(BaseAgentOutput):
    agent_id: str = "agent_6"
    report_id: str
    case_id: str
    pdf_report_url: str
    summary: DecisionSupportSummary
    narrative_sections: Dict[str, str] = Field(default_factory=dict)
    generated_at: str
    report_checksum: str
