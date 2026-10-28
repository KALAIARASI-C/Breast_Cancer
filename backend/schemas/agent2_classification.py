from typing import List, Dict
from pydantic import BaseModel, Field
from backend.schemas.common import BaseAgentOutput

class ClassProbability(BaseModel):
    class_name: str
    probability: float

class Agent2ClassificationOutput(BaseAgentOutput):
    agent_id: str = "agent_2"
    model_identifier: str = "ResNet50-BreastMRI-Classifier-v2.1"
    predicted_class: str
    confidence: float
    probabilities: List[ClassProbability] = Field(default_factory=list)
    raw_logits: Dict[str, float] = Field(default_factory=dict)
    feature_embedding_dim: int = 2048
