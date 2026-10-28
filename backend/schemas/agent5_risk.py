from typing import List, Dict
from pydantic import BaseModel, Field
from backend.schemas.common import BaseAgentOutput

class BIRADSAssessment(BaseModel):
    category: str # "BI-RADS 1", "BI-RADS 2", "BI-RADS 3", "BI-RADS 4A", "BI-RADS 4B", "BI-RADS 4C", "BI-RADS 5"
    description: str
    malignancy_risk_percent: str

class RiskIndicator(BaseModel):
    indicator: str
    weight: float
    description: str

class Agent5RiskOutput(BaseAgentOutput):
    agent_id: str = "agent_5"
    birads: BIRADSAssessment
    composite_risk_score: float # 0.0 to 100.0
    risk_category: str # Low, Moderate, High, Highly Suspicious
    primary_risk_factors: List[RiskIndicator] = Field(default_factory=list)
    clinical_recommendation: str
    followup_interval_months: int = 6
