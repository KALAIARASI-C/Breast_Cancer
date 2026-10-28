# Breast CARE-MA — Teammate Collaboration Contracts & Unresolved Dependencies

**Author:** Kalaiarasi C (Medical Imaging & Explainable AI Lead)  
**Modules Delivered:** React + Vite Frontend & Agent 3 (Grad-CAM Explainability Service)

This document establishes the official data contracts, shared interfaces, and action items for teammates to integrate their trained models and services into the Breast CARE-MA pipeline.

---

## 1. Teammate Work Allocation & Delivery Status

| Member | Primary Role | Assigned Agents | Integration Status | Next Required Teammate Action |
| :--- | :--- | :--- | :--- | :--- |
| **Atchaya M** | Imaging Models (Detection & Classification) | **Agent 1** (Detection)<br/>**Agent 2** (Classification) | Adapter & schema defined (`agent1_detector.py`, `agent2_classifier.py`) | Deliver trained YOLOv8 weights (`.pt`) and ResNet50 checkpoint (`.pth`). |
| **Kalaiarasi C** | Imaging XAI & Frontend Lead | **Agent 3** (Grad-CAM Explainability)<br/>**Frontend** (React + Vite) | **100% Implemented & Tested** (`agent3_gradcam.py`, React UI) | Maintain Grad-CAM hooks and UI visualizer. |
| **Hariharasudhan S**| Genomics, RAG & Reporting Lead | **Agent 4** (Evidence RAG)<br/>**Agent 5** (Risk Engine)<br/>**Agent 6** (Report Generation) | Adapters, schema, & ReportLab PDF generator defined | Provide Qdrant collection URL and local Ollama model prompt template. |
| **Partha Sarathy C**| Project Lead / Orchestration | **Multi-Agent Pipeline Orchestrator** | Orchestrator pipeline active (`backend/orchestrator/pipeline.py`) | Integrate LangGraph state transitions and database persistence (Supabase / PostgreSQL). |

---

## 2. Unresolved Dependencies Requiring Teammate Input

Before final university project review, the following dependencies must be provided by the responsible teammates:

### A. For Atchaya M (Agents 1 & 2):
1. **YOLOv8 Model Weights:**
   - Destination Path: `backend/models/yolov8_tumor_detection.pt`
   - Expected Input: Axial slice RGB image $(W \times H \times 3)$
   - Expected Output: List of bounding boxes $[x_{\min}, y_{\min}, x_{\max}, y_{\max}]$, confidence score $\ge 0.50$.
2. **ResNet50 / EfficientNet Checkpoint:**
   - Destination Path: `backend/models/resnet50_breast_cancer.pth`
   - Preprocessing Rules: Normalization with ImageNet mean `[0.485, 0.456, 0.406]` and std `[0.229, 0.224, 0.225]`.
   - Prediction Classes: Must index `[0: "Normal", 1: "Benign", 2: "Malignant"]`.

### B. For Hariharasudhan S (Agents 4 & 5):
1. **Qdrant Vector Database Host:**
   - Default environment variable: `QDRANT_HOST=localhost:6333`
   - Biomedical collection name: `breast_cancer_literature`
2. **Ollama Llama 3 Prompt:**
   - Model tag: `llama3:8b-instruct-q4_0`
   - Role: Synthesize narrative findings from Agent 4 citations for insertion into Agent 6 report.

### C. For Partha Sarathy C (System Lead):
1. **PostgreSQL / Supabase Schema:**
   - Table: `patient_analyses`
   - Primary Key: `analysis_id VARCHAR(32)`
   - Schema mapping: Ready to map 1-to-1 with `AnalysisRecord` Pydantic model (`backend/schemas/__init__.py`).

---

## 3. Collaboration Data Contracts

### Agent 1 to Agent 3 Handoff:
- **Contract:** If Agent 1 identifies bounding boxes, Agent 3 uses the primary box coordinates to evaluate spatial concurrence ($\text{IoU}$).
- **Fall-back rule:** If Agent 1 detects zero lesions, Agent 3 performs whole-parenchyma gradient projection without failing.

### Agent 2 to Agent 3 Handoff:
- **Contract:** Agent 3 calculates Grad-CAM for the class predicted by Agent 2 (`predicted_class`), extracting gradients for the backpropagated logit.
- **Dynamic switch:** The frontend allows the user to re-evaluate Grad-CAM against an alternate class (e.g., comparing "Malignant" vs "Benign" attention).
