from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class AnalysisStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class ScanModality(str, Enum):
    MRI_T1 = "MRI_T1"
    MRI_T2 = "MRI_T2"
    MRI_DCE = "MRI_DCE"
    GENERIC_MRI = "GENERIC_MRI"

class BaseAgentOutput(BaseModel):
    agent_id: str
    status: AnalysisStatus = AnalysisStatus.COMPLETED
    execution_time_ms: float = 0.0
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    warnings: List[str] = Field(default_factory=list)
    error_details: Optional[str] = None
