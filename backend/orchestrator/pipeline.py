"""
Breast CARE-MA - Multi-Agent Pipeline Orchestrator
Coordinates sequential execution of Agents 1 through 6 with robust state tracking.
"""

import time
import json
from pathlib import Path
from typing import Dict, Optional, List, Any
from datetime import datetime, timezone

from backend.schemas import (
    AnalysisRecord,
    AnalysisStatus,
    ScanModality,
    Agent1DetectionOutput,
    Agent2ClassificationOutput,
    Agent3GradCamOutput,
    Agent4EvidenceOutput,
    Agent5RiskOutput,
    Agent6ReportOutput
)
from backend.agents.agent1_detector import detection_service
from backend.agents.agent2_classifier import classification_service
from backend.agents.agent3_gradcam import gradcam_service
from backend.agents.agent4_evidence_rag import evidence_service
from backend.agents.agent5_risk_assessor import risk_service
from backend.agents.agent6_reporter import report_service

class MultiAgentPipelineOrchestrator:
    """
    Coordinates execution of Agents 1-6 according to Breast CARE-MA data contracts.
    """
    def __init__(self):
        # In-memory store for active analyses; also saved to disk cache
        self.records: Dict[str, AnalysisRecord] = {}

    def get_record(self, analysis_id: str) -> Optional[AnalysisRecord]:
        return self.records.get(analysis_id)

    def list_records(self) -> List[AnalysisRecord]:
        # Return sorted by created_at descending
        return sorted(self.records.values(), key=lambda r: r.created_at, reverse=True)

    def initialize_analysis(
        self,
        analysis_id: str,
        patient_id: str,
        image_path: str,
        filename: str,
        filesize: int,
        modality: ScanModality = ScanModality.GENERIC_MRI
    ) -> AnalysisRecord:
        record = AnalysisRecord(
            analysis_id=analysis_id,
            patient_id=patient_id,
            modality=modality,
            status=AnalysisStatus.PENDING,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            filename=filename,
            filesize_bytes=filesize,
            original_image_url=f"/storage/uploads/{Path(image_path).name}",
            original_image_path=image_path,
            active_agent="Agent 1 (Tumor Detection)",
            progress_percentage=10,
            timeline=[{
                "step": "Upload & Ingestion",
                "status": "COMPLETED",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "detail": f"Uploaded {filename} ({filesize} bytes)"
            }]
        )
        self.records[analysis_id] = record
        return record

    def run_pipeline(self, analysis_id: str) -> AnalysisRecord:
        record = self.records.get(analysis_id)
        if not record:
            raise ValueError(f"Analysis ID {analysis_id} not registered.")

        record.status = AnalysisStatus.PROCESSING

        try:
            # ----------------------------------------------------
            # Step 1: Agent 1 - Tumor Detection (Atchaya)
            # ----------------------------------------------------
            record.active_agent = "Agent 1 (Tumor Detection)"
            record.progress_percentage = 25
            
            agent1_res = detection_service.detect_lesions(analysis_id, record.original_image_path)
            record.agent1_detection = agent1_res
            record.timeline.append({
                "step": "Agent 1: Tumor Detection",
                "status": agent1_res.status.value,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "detail": f"Detected {agent1_res.lesions_detected} lesion(s) covering {agent1_res.lesion_area_percentage}% of volume."
            })

            # Extract first bounding box if found to pass to Agents 2 & 3
            first_bbox = None
            if agent1_res.bounding_boxes:
                b = agent1_res.bounding_boxes[0]
                first_bbox = {"x_min": b.x_min, "y_min": b.y_min, "x_max": b.x_max, "y_max": b.y_max}

            # ----------------------------------------------------
            # Step 2: Agent 2 - Tumor Classification (Atchaya)
            # ----------------------------------------------------
            record.active_agent = "Agent 2 (Tumor Classification)"
            record.progress_percentage = 45
            
            agent2_res = classification_service.classify_scan(
                analysis_id, record.original_image_path, first_bbox
            )
            record.agent2_classification = agent2_res
            record.timeline.append({
                "step": "Agent 2: Tumor Classification",
                "status": agent2_res.status.value,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "detail": f"Classified as {agent2_res.predicted_class} with {agent2_res.confidence*100:.1f}% confidence."
            })

            # ----------------------------------------------------
            # Step 3: Agent 3 - Grad-CAM Explainability (Kalaiarasi - Core Responsibility)
            # ----------------------------------------------------
            record.active_agent = "Agent 3 (Grad-CAM Explainability)"
            record.progress_percentage = 65
            
            agent3_res = gradcam_service.generate_explainability(
                analysis_id=analysis_id,
                image_path=record.original_image_path,
                target_class=agent2_res.predicted_class,
                target_class_confidence=agent2_res.confidence,
                detection_bbox=first_bbox,
                alpha_blend=0.55
            )
            record.agent3_explainability = agent3_res
            record.timeline.append({
                "step": "Agent 3: Grad-CAM Explainability",
                "status": agent3_res.status.value,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "detail": f"Grad-CAM generated: Peak coordinate ({agent3_res.explanation_metadata.peak_activation_coords.x if agent3_res.explanation_metadata else 'N/A'}, {agent3_res.explanation_metadata.peak_activation_coords.y if agent3_res.explanation_metadata else 'N/A'})."
            })

            # ----------------------------------------------------
            # Step 4: Agent 4 - Clinical Evidence Retrieval (Hariharasudhan)
            # ----------------------------------------------------
            record.active_agent = "Agent 4 (Clinical Evidence RAG)"
            record.progress_percentage = 80
            
            agent4_res = evidence_service.retrieve_evidence(
                predicted_class=agent2_res.predicted_class,
                confidence=agent2_res.confidence,
                lesions_detected=agent1_res.lesions_detected
            )
            record.agent4_evidence = agent4_res
            record.timeline.append({
                "step": "Agent 4: Evidence Retrieval (RAG)",
                "status": agent4_res.status.value,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "detail": f"Retrieved {agent4_res.evidence_count} peer-reviewed clinical citations."
            })

            # ----------------------------------------------------
            # Step 5: Agent 5 - Risk Assessment (Hariharasudhan)
            # ----------------------------------------------------
            record.active_agent = "Agent 5 (Risk Assessment)"
            record.progress_percentage = 90
            
            cov_ratio = agent3_res.explanation_metadata.coverage_ratio if agent3_res.explanation_metadata else 0.05
            agent5_res = risk_service.assess_risk(
                predicted_class=agent2_res.predicted_class,
                confidence=agent2_res.confidence,
                lesion_count=agent1_res.lesions_detected,
                coverage_ratio=cov_ratio
            )
            record.agent5_risk = agent5_res
            record.timeline.append({
                "step": "Agent 5: Risk Assessment",
                "status": agent5_res.status.value,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "detail": f"Assigned {agent5_res.birads.category} (Score: {agent5_res.composite_risk_score}/100)."
            })

            # ----------------------------------------------------
            # Step 6: Agent 6 - Explainable Report Generation (Hariharasudhan)
            # ----------------------------------------------------
            record.active_agent = "Agent 6 (Report Generation)"
            record.progress_percentage = 98
            
            agent6_res = report_service.generate_report(
                analysis_id=analysis_id,
                patient_id=record.patient_id,
                detection_data=agent1_res.model_dump(),
                classification_data=agent2_res.model_dump(),
                explainability_data=agent3_res.model_dump(),
                evidence_data=agent4_res.model_dump(),
                risk_data=agent5_res.model_dump()
            )
            record.agent6_report = agent6_res
            record.timeline.append({
                "step": "Agent 6: Report Generation",
                "status": agent6_res.status.value,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "detail": f"Compiled report PDF: {agent6_res.pdf_report_url}"
            })

            # Finalize Status
            record.status = AnalysisStatus.COMPLETED
            record.progress_percentage = 100
            record.active_agent = "Completed"
            record.updated_at = datetime.now(timezone.utc)

        except Exception as e:
            record.status = AnalysisStatus.FAILED
            record.errors.append(str(e))
            record.timeline.append({
                "step": "Pipeline Execution Error",
                "status": "FAILED",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "detail": str(e)
            })

        return record

orchestrator = MultiAgentPipelineOrchestrator()
