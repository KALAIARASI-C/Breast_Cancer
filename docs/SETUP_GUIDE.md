# Breast CARE-MA — Setup & Execution Guide

This guide walks through running both the FastAPI backend and the React + Vite frontend on Windows.

---

## 1. Prerequisites

- **Python:** 3.10+ (Current system: Python 3.14.7)
- **Node.js:** v20+ (Current system: Node v26.5.0, npm 11.17.0)

---

## 2. Running the FastAPI Backend

Open a terminal in the root directory:

```powershell
# Navigate to the workspace root
cd c:\Users\kalai\OneDrive\Desktop\Breast_Cancer

# Install Python dependencies
python -m pip install -r backend/requirements.txt

# Run the FastAPI server with reload
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend server will start at:
- **API Base:** `http://127.0.0.1:8000`
- **Swagger Interactive Docs:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/api/health`

---

## 3. Running the React + Vite Frontend

In a second terminal:

```powershell
# Navigate to the frontend directory
cd c:\Users\kalai\OneDrive\Desktop\Breast_Cancer\frontend

# Install dependencies (already installed)
npm install

# Start Vite dev server
npm run dev
```

The frontend will start at:
- **Web App URL:** `http://localhost:5173`

The Vite development server is pre-configured with reverse-proxy rules forwarding `/api` and `/storage` calls directly to the FastAPI server on port 8000.

---

## 4. Running the Automated Test Suites

To verify Agent 3 Grad-CAM and the API endpoints:

```powershell
# Run Agent 3 unit tests
python -m unittest backend/tests/test_agent3_gradcam.py

# Run API integration tests
python -m unittest backend/tests/test_api.py

# Run Frontend build verification
cd frontend
npm run build
```
