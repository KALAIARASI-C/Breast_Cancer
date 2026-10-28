/**
 * Breast CARE-MA — Curated Clinical Mock Fixtures
 * For offline development and fallback demonstration.
 * All records strictly conform to the 6-agent Pydantic schemas.
 */

export const MOCK_ANALYSES = [
  {
    analysis_id: "ANL-DEMO001",
    patient_id: "BRCA-PT-8842",
    modality: "MRI_DCE",
    status: "COMPLETED",
    created_at: "2026-10-28T14:30:00Z",
    updated_at: "2026-10-28T14:31:12Z",
    filename: "sample_breast_mri_dce.png",
    filesize_bytes: 482104,
    original_image_url: "/storage/uploads/sample_breast_mri_dce.png",
    original_image_path: "storage/uploads/sample_breast_mri_dce.png",
    progress_percentage: 100,
    active_agent: "Completed",
    timeline: [
      { step: "Upload & Ingestion", status: "COMPLETED", timestamp: "2026-10-28T14:30:02Z", detail: "Validated DCE-MRI slice (320x320)" },
      { step: "Agent 1: Tumor Detection", status: "COMPLETED", timestamp: "2026-10-28T14:30:15Z", detail: "Detected 1 focal lesion (IoU candidate)" },
      { step: "Agent 2: Tumor Classification", status: "COMPLETED", timestamp: "2026-10-28T14:30:30Z", detail: "Predicted Malignant (88.0% confidence)" },
      { step: "Agent 3: Grad-CAM Explainability", status: "COMPLETED", timestamp: "2026-10-28T14:30:45Z", detail: "Focal Layer4 activation at (175, 110)" },
      { step: "Agent 4: Evidence Retrieval (RAG)", status: "COMPLETED", timestamp: "2026-10-28T14:30:58Z", detail: "Retrieved 3 grounded PubMed/PMC citations" },
      { step: "Agent 5: Risk Assessment", status: "COMPLETED", timestamp: "2026-10-28T14:31:05Z", detail: "Assigned BI-RADS 5 (High Suspicion)" },
      { step: "Agent 6: Report Generation", status: "COMPLETED", timestamp: "2026-10-28T14:31:12Z", detail: "Generated PDF report with embedded heatmaps" }
    ],
    agent1_detection: {
      agent_id: "agent_1",
      status: "COMPLETED",
      model_identifier: "YOLOv8-BreastMRI-v1.0",
      lesions_detected: 1,
      bounding_boxes: [
        { x_min: 145, y_min: 82, x_max: 205, y_max: 138, confidence: 0.89, label: "Suspected Infiltrative Mass" }
      ],
      annotated_image_url: "/storage/uploads/annotated_detection_ANL-DEMO001.png",
      lesion_area_percentage: 3.84,
      execution_time_ms: 182.4
    },
    agent2_classification: {
      agent_id: "agent_2",
      status: "COMPLETED",
      model_identifier: "ResNet50-BreastMRI-Classifier-v2.1",
      predicted_class: "Malignant",
      confidence: 0.88,
      probabilities: [
        { class_name: "Normal", probability: 0.03 },
        { class_name: "Benign", probability: 0.09 },
        { class_name: "Malignant", probability: 0.88 }
      ],
      raw_logits: { Normal: -3.50, Benign: -2.40, Malignant: 1.95 },
      execution_time_ms: 310.2
    },
    agent3_explainability: {
      analysis_id: "ANL-DEMO001",
      agent_id: "agent_3",
      status: "COMPLETED",
      source_agent_ids: ["agent_1", "agent_2"],
      target_class: "Malignant",
      original_image_url: "/storage/uploads/sample_breast_mri_dce.png",
      heatmap_url: "/storage/heatmaps/gradcam_heatmap_ANL-DEMO001.png",
      overlay_url: "/storage/heatmaps/gradcam_overlay_ANL-DEMO001.png",
      model_identifier: "ResNet50-Layer4-GradCAM",
      attribution_interpretation: "Grad-CAM visual attribution concentrated in malignant feature space with peak activation at coordinate (175, 110). The high-salience region covers 4.20% of the slice, exhibiting strong spatial concurrence with Agent 1 detection (IoU=0.762).",
      target_box_overlap_iou: 0.762,
      execution_time_ms: 245.8,
      explanation_metadata: {
        target_layer: "layer4",
        target_class: "Malignant",
        target_class_confidence: 0.88,
        peak_activation_coords: { x: 175, y: 110 },
        peak_intensity: 1.0,
        mean_intensity: 0.184,
        coverage_ratio: 0.042,
        input_resolution: [320, 320],
        heatmap_resolution: [320, 320],
        colormap: "jet",
        alpha_blend: 0.55,
        computation_engine: "PyTorch-GradCAM-v1.0"
      }
    },
    agent4_evidence: {
      agent_id: "agent_4",
      status: "COMPLETED",
      retrieval_system: "Qdrant-Hybrid-Biomedical-RAG",
      evidence_count: 3,
      query_terms: [
        "breast dynamic contrast-enhanced MRI malignant morphology",
        "BI-RADS kinetic curve plateau and washout",
        "focal parenchymal enhancement neoplastic differentiation"
      ],
      retrieved_evidence: [
        {
          source_id: "PMC-7892144",
          title: "Dynamic Contrast-Enhanced MRI in Breast Cancer: Predictive Accuracy and Kinetic Features",
          authors: "Kuhl, C.K. et al.",
          journal: "Radiology (RSNA)",
          year: 2023,
          doi_or_url: "https://doi.org/10.1148/radiol.202320145",
          retrieved_excerpt: "Rapid early peak signal enhancement followed by delayed washout or persistent plateau kinetics is 89.4% sensitive for malignant ductal lesions on 3T breast MRI.",
          clinical_relevance_score: 0.96,
          evidence_type: "Prospective Clinical Trial"
        },
        {
          source_id: "PUBMED-34190822",
          title: "Explainable Deep Learning with Grad-CAM for DCE-MRI Lesion Localization in Neoadjuvant Settings",
          authors: "Zhang, L., Morris, E.A. et al.",
          journal: "Journal of Magnetic Resonance Imaging",
          year: 2024,
          doi_or_url: "https://doi.org/10.1002/jmri.28911",
          retrieved_excerpt: "High Grad-CAM spatial activation on ResNet convolutional feature maps strongly correlates with histologically confirmed invasive boundaries (mean IoU 0.74).",
          clinical_relevance_score: 0.93,
          evidence_type: "Peer-Reviewed Multi-Center Study"
        },
        {
          source_id: "NCCN-BC-2024",
          title: "NCCN Clinical Practice Guidelines in Oncology: Breast Cancer Screening and Diagnosis",
          authors: "National Comprehensive Cancer Network Panel",
          journal: "NCCN Clinical Practice Guidelines",
          year: 2024,
          doi_or_url: "https://www.nccn.org/guidelines/breast-cancer",
          retrieved_excerpt: "For mass lesions presenting with irregular margins and non-circumscribed rim enhancement, core needle biopsy under ultrasound or MRI guidance is indicated (Category 2A).",
          clinical_relevance_score: 0.98,
          evidence_type: "Clinical Practice Guideline"
        }
      ],
      knowledge_graph_links: ["Neo4j:Gene:BRCA1", "Neo4j:Entity:InvasiveDuctalCarcinoma"],
      execution_time_ms: 412.0
    },
    agent5_risk: {
      agent_id: "agent_5",
      status: "COMPLETED",
      birads: {
        category: "BI-RADS 5",
        description: "Highly Suggestive of Malignancy",
        malignancy_risk_percent: "> 95%"
      },
      composite_risk_score: 92.5,
      risk_category: "High Suspicion",
      primary_risk_factors: [
        { indicator: "Focal Parenchymal Enhancement", weight: 0.40, description: "Significant focal contrast enhancement in upper outer quadrant" },
        { indicator: "Morphologic Margin Spiculation", weight: 0.35, description: "Irregular infiltrative border pattern" },
        { indicator: "Grad-CAM Spatial Concurrence", weight: 0.25, description: "High model attribution localized to primary lesion" }
      ],
      clinical_recommendation: "Histopathological verification recommended via image-guided core needle biopsy. Multidisciplinary tumor board consultation indicated.",
      followup_interval_months: 1,
      execution_time_ms: 120.5
    },
    agent6_report: {
      agent_id: "agent_6",
      status: "COMPLETED",
      report_id: "REP-DEMO001",
      case_id: "ANL-DEMO001",
      pdf_report_url: "/storage/reports/BreastCARE_Report_ANL-DEMO001.pdf",
      summary: {
        case_id: "ANL-DEMO001",
        patient_id: "BRCA-PT-8842",
        imaging_finding: "Suspicious focal lesion with rapid enhancement",
        model_prediction: "Malignant",
        confidence_display: "88.0%",
        birads_category: "BI-RADS 5",
        explainability_summary: "Grad-CAM salience concentrated at coordinates (175, 110) with IoU 0.762 concurrence.",
        evidence_grounding_status: "Verified across RSNA and NCCN guideline citations",
        recommended_action: "Core needle biopsy under MRI guidance",
        requires_clinical_review: true
      },
      generated_at: "2026-10-28 14:31:12 UTC",
      report_checksum: "a8f9c2d1e04b7712",
      execution_time_ms: 580.2
    }
  }
];

export const MOCK_DASHBOARD_STATS = {
  totalScansAnalyzed: 142,
  malignancyDetectionRate: "18.3%",
  meanGradCamIoU: "0.784",
  clinicalAuditCompliance: "100%",
  averagePipelineLatency: "1.8s",
  activeAgentsCount: 6
};
