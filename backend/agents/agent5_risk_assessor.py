"""
Breast CARE-MA - Agent 5: Risk Assessment Service
Teammate Responsibility: Hariharasudhan S
Interface & Integration Adapter by: Kalaiarasi C
"""

import time
from typing import List, Optional
from backend.schemas.agent5_risk import Agent5RiskOutput, BIRADSAssessment, RiskIndicator
from backend.schemas.common import AnalysisStatus

class RiskAssessmentService:
    """
    Interface for Agent 5 (BI-RADS & Composite Oncologic Risk Engine).
    Synthesizes multi-agent predictions into structured clinical risk categories.
    """
    def __init__(self):
        pass

    def assess_risk(
        self,
        predicted_class: str,
        confidence: float,
        lesion_count: int = 1,
        coverage_ratio: float = 0.05
    ) -> Agent5RiskOutput:
        start_time = time.time()
        
        if predicted_class == "Malignant":
            if confidence > 0.85 or coverage_ratio > 0.08:
                birads = BIRADSAssessment(
                    category="BI-RADS 5",
                    description="Highly Suggestive of Malignancy",
                    malignancy_risk_percent="> 95%"
                )
                score = 92.5
                tier = "High Suspicion"
                recommendation = "Histopathological verification recommended via image-guided core needle biopsy. Multidisciplinary tumor board consultation indicated."
                interval = 1
            else:
                birads = BIRADSAssessment(
                    category="BI-RADS 4B",
                    description="Suspicious Abnormality (Moderate Suspicion)",
                    malignancy_risk_percent="10% - 50%"
                )
                score = 64.0
                tier = "Moderate Suspicion"
                recommendation = "Tissue biopsy recommended. Correlate with targeted second-look ultrasound."
                interval = 3

            indicators = [
                RiskIndicator(indicator="Focal Parenchymal Enhancement", weight=0.40, description="Significant focal intensity contrast detected in breast parenchyma"),
                RiskIndicator(indicator="Morphologic Margin Spiculation", weight=0.35, description="Irregular border features consistent with infiltrative ductal margins"),
                RiskIndicator(indicator="Grad-CAM Spatial Concurrence", weight=0.25, description="High model attribution localized to focal enhancing lesion")
            ]

        elif predicted_class == "Benign":
            birads = BIRADSAssessment(
                category="BI-RADS 2",
                description="Benign Finding",
                malignancy_risk_percent="~ 0%"
            )
            score = 15.0
            tier = "Low Risk"
            recommendation = "Routine clinical screening recommended at standard age-appropriate intervals."
            interval = 12
            indicators = [
                RiskIndicator(indicator="Circumscribed Margins", weight=0.50, description="Smooth well-defined borders characteristic of fibroadenomatous lesions"),
                RiskIndicator(indicator="Homogeneous Contrast Uptake", weight=0.50, description="Uniform non-infiltrative vascular kinetic profile")
            ]
        else:
            birads = BIRADSAssessment(
                category="BI-RADS 1",
                description="Negative Examination",
                malignancy_risk_percent="0%"
            )
            score = 2.0
            tier = "Normal"
            recommendation = "Maintain regular annual mammographic / MRI screening as per national guidelines."
            interval = 12
            indicators = [
                RiskIndicator(indicator="Symmetric Fibroglandular Tissue", weight=1.0, description="No suspicious focal mass or abnormal architectural distortion identified")
            ]

        exec_time = (time.time() - start_time) * 1000.0

        return Agent5RiskOutput(
            agent_id="agent_5",
            status=AnalysisStatus.COMPLETED,
            birads=birads,
            composite_risk_score=score,
            risk_category=tier,
            primary_risk_factors=indicators,
            clinical_recommendation=recommendation,
            followup_interval_months=interval,
            execution_time_ms=exec_time
        )

risk_service = RiskAssessmentService()
