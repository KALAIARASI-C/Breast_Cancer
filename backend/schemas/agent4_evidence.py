from typing import List, Optional
from pydantic import BaseModel, Field
from backend.schemas.common import BaseAgentOutput

class ClinicalEvidenceItem(BaseModel):
    source_id: str
    title: str
    authors: str
    journal: str
    year: int
    doi_or_url: Optional[str] = None
    retrieved_excerpt: str
    clinical_relevance_score: float
    evidence_type: str = "Peer-Reviewed Study" # or Guideline, Meta-Analysis

class Agent4EvidenceOutput(BaseAgentOutput):
    agent_id: str = "agent_4"
    retrieval_system: str = "Qdrant-Hybrid-Biomedical-RAG"
    evidence_count: int = 0
    query_terms: List[str] = Field(default_factory=list)
    retrieved_evidence: List[ClinicalEvidenceItem] = Field(default_factory=list)
    knowledge_graph_links: List[str] = Field(default_factory=list)
