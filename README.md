# Breast CARE-MA — Frontend & Grad-CAM Explainability UI

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg)](frontend/)
[![Lead](https://img.shields.io/badge/Module%20Lead-Kalaiarasi%20C-cyan.svg)](frontend/)
[![Focus](https://img.shields.io/badge/Focus-Explainability%20%26%20Dashboard%20UI-green.svg)](frontend/)

This repository contains the official **React + Vite Frontend Application** and **Agent 3 Grad-CAM Explainability Visualization UI** for the B.Tech final-year project: **Breast CARE-MA (Multimodal Multi-Agent AI Decision Support Framework)**.

---

## 👥 Team Work Allocation & Ownership

| Member | Primary Role | Owned Modules / Services | Individual Scope |
| :--- | :--- | :--- | :--- |
| **Kalaiarasi C** *(Current Workspace)* | Medical Imaging & Explainable AI Lead | **Frontend Application & Agent 3 Grad-CAM UI** | React + Vite UI, Dashboard, MRI Ingestion, Results UI, Grad-CAM Visualizer, PDF Viewer |
| **Partha Sarathy C** | Project Lead / System Architecture | **FastAPI Backend & Orchestrator** | Backend API, Database schema, Multi-agent orchestration, Docker deployment |
| **Atchaya M** | Detection & Classification AI Lead | **Agents 1 & 2** | YOLOv8 tumor detection model & ResNet50 tumor classification model |
| **Hariharasudhan S** | Genomics, RAG & Reporting Lead | **Agents 4, 5 & 6** | Qdrant biomedical RAG, BI-RADS risk assessment, ReportLab PDF report generation |

---

## 💻 Kalaiarasi's Individual Responsibilities

1. **Dashboard & Navigation UI:** Executive overview, project KPIs, multi-agent pipeline tracker, recent patient analyses.
2. **Patient MRI Ingestion Portal:** Drag-and-drop file upload with format validation (DICOM, PNG, JPG), patient ID entry, and pulse sequence selection.
3. **Multi-Agent Results UI:** Visual breakdown of findings across Agents 1 through 6.
4. **Agent 3 Grad-CAM Explainability Visualizer:**
   - Dual-view and overlay blend mode with live alpha slider ($0.0 \to 1.0$).
   - Colormap switching (`jet`, `viridis`, `magma`, `turbo`).
   - Zoom and pan controls ($1\times, 1.25\times, 1.5\times, 2.0\times$).
   - Peak coordinate crosshairs $(X, Y)$ and normalized intensity legend bar ($0.0 \to 1.0$).
   - IoU spatial concurrence metric with Agent 1's detection bounding box.
   - Distinct labeling between mock test data and live model outputs.
5. **Clinical PDF Report Viewer:** Embedded PDF preview, download action, and radiologist verification sign-off block.
6. **Modular API Client:** Configured with `VITE_API_BASE_URL` to connect to Partha's FastAPI backend when active, with automatic fallback to clearly labelled mock data.

---

## 🚀 Running the Frontend Locally

```powershell
# Navigate into the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔗 Teammate Integration Contracts

When Partha, Atchaya, and Hariharasudhan deploy the backend and models, the frontend seamlessly connects via standard reverse proxy or `VITE_API_BASE_URL`. Full interface schemas are documented in:
📄 [docs/TEAMMATE_CONTRACTS.md](docs/TEAMMATE_CONTRACTS.md)

---

## ⚖️ Clinical Safety Notice

Breast CARE-MA is a research decision-support prototype. It does not replace professional clinical judgment or make autonomous diagnoses. All AI-assisted findings must be verified by a certified clinician.
