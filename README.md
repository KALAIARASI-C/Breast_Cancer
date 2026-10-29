# Breast CARE-MA — Frontend & Grad-CAM Explainability UI

**React + Vite Frontend Application** and **Agent 3 Grad-CAM Explainability Visualization UI** for the B.Tech final-year project: **Breast CARE-MA (Multimodal Multi-Agent AI Decision Support Framework)**.

## Team Work Allocation & Ownership

| Member | Primary Role | Owned Modules / Services | Individual Scope |
|---|---|---|---|
| **Kalaiarasi C** | Medical Imaging & Explainable AI Lead | Frontend Application & Agent 3 Grad-CAM UI | React + Vite UI, dashboard, image ingestion, results UI, Grad-CAM visualizer, PDF viewer |
| **Partha Sarathy C** | Project Lead / System Architecture | FastAPI Backend & Orchestrator | Backend API, database schema, multi-agent orchestration, Docker deployment |
| **Atchaya M** | Detection & Classification AI Lead | Agents 1 & 2 | YOLOv8 tumor detection and tumor classification |
| **Hariharasudhan S** | RAG & Reporting Lead | Agents 4, 5 & 6 | Biomedical RAG, risk assessment, report generation |

## Kalaiarasi's Individual Responsibilities

1. **Dashboard & Navigation UI:** Project KPIs, multi-agent pipeline tracker and recent patient analyses.
2. **Medical Image Ingestion Portal:** Drag-and-drop image upload, format validation, patient ID entry and image selection.
3. **Multi-Agent Results UI:** Visual presentation of findings from Agents 1–6.
4. **Agent 3 Grad-CAM Explainability Visualizer:**
   - Original image, heatmap and overlay views.
   - Overlay opacity slider.
   - Colormap selection.
   - Zoom and pan controls.
   - Peak-coordinate visualization and intensity legend.
   - Spatial comparison with Agent 1 detection boxes when supported by the API.
   - Clear labeling of mock data versus live model outputs.
5. **Clinical PDF Report Viewer:** Embedded preview, download and clinician verification section.
6. **Modular API Client:** Uses `VITE_API_BASE_URL` to connect to the FastAPI backend, with clearly labeled mock-data fallback.

## Running the Frontend Locally

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Teammate Integration Contracts

The frontend integrates with the backend through `VITE_API_BASE_URL`. Interface details are documented in:

`docs/TEAMMATE_CONTRACTS.md`

## Clinical Safety Notice

Breast CARE-MA is a research decision-support prototype. It does not replace professional clinical judgment or provide autonomous diagnoses. AI-assisted findings must be reviewed by a qualified clinician.
