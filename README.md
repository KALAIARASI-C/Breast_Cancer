# Breast CARE-MA: Multimodal Multi-Agent AI Framework

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](backend/)
[![Explainability](https://img.shields.io/badge/Agent%203-Grad--CAM%20XAI-cyan.svg)](backend/agents/agent3_gradcam.py)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An explainable multi-agent AI framework for multimodal breast cancer diagnostic decision support, combining breast MRI focal localization, deep morphologic classification, Grad-CAM visual feature attribution, biomedical RAG, and BI-RADS clinical scoring.

---

## 👥 Project Team & Allocation

| Member | Primary Role | Assigned Agents | Deliverables |
| :--- | :--- | :--- | :--- |
| **Kalaiarasi C** | Medical Imaging & Explainable AI Lead | **Agent 3 (Grad-CAM XAI)** & **Frontend** | Complete React + Vite App, Grad-CAM Engine, Overlays |
| **Partha Sarathy C** | Project Lead / System Architecture | Multi-Agent Orchestrator | Architecture, Integration, Deployment |
| **Atchaya M** | Detection & Classification AI Lead | **Agent 1** (Detection), **Agent 2** (Classification) | YOLOv8 lesion detection, ResNet50 classifier |
| **Hariharasudhan S** | Genomics, RAG & Reporting Lead | **Agent 4** (RAG), **Agent 5** (Risk), **Agent 6** (Reports) | Qdrant RAG, BI-RADS scoring, ReportLab PDF generation |

---

## 🔬 Multi-Agent Architecture

1. **Patient MRI Ingestion:** Validates axial breast MRI slices (DCE-MRI, T1w, T2w).
2. **Agent 1 — Tumor Detection (YOLOv8):** Localizes focal parenchymal masses and bounding coordinates.
3. **Agent 2 — Tumor Classification (ResNet50):** Computes probabilities for Normal, Benign, and Malignant categories.
4. **Agent 3 — Grad-CAM Explainability (My Lead):** Calculates gradient-weighted activation mapping on deep bottleneck layers (`layer4`), generates normalized heatmaps, aligned overlays, and evaluates IoU spatial concurrence with Agent 1.
5. **Agent 4 — Clinical Evidence Retrieval (RAG):** Grounded semantic retrieval from PubMed/PMC peer-reviewed studies.
6. **Agent 5 — Risk Assessment:** Computes composite oncologic risk score and assigns standardized BI-RADS category (1 to 5).
7. **Agent 6 — Explainable Report Generation:** Compiles an audit-ready PDF summary with embedded Grad-CAM overlays and human-in-the-loop sign-off.

---

## 🚀 Quick Start

### 1. Start FastAPI Backend
```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API docs at `http://127.0.0.1:8000/docs`.

### 2. Start React + Vite Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

---

## 🧪 Testing

```powershell
# Run Agent 3 Grad-CAM unit tests
python -m unittest backend/tests/test_agent3_gradcam.py

# Run API integration tests
python -m unittest backend/tests/test_api.py

# Build frontend production bundle
cd frontend && npm run build
```

---

## ⚖️ Clinical Safety Disclaimer

Breast CARE-MA is a research and educational decision-support prototype. It does not replace clinical judgment or provide autonomous diagnosis. All AI outputs must be validated by a certified radiologist or oncologist before clinical intervention.
