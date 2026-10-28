import io
import unittest
from fastapi.testclient import TestClient
from PIL import Image
import numpy as np

from backend.main import app, seed_demo_case
from backend.schemas.common import AnalysisStatus

class TestBreastCareMAApi(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        seed_demo_case()
        cls.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("agent_3_gradcam", data["agents"])

    def test_mri_upload_and_pipeline_execution(self):
        # Generate synthetic MRI test image
        img_arr = np.zeros((200, 200), dtype=np.uint8)
        img_arr[40:160, 40:160] = 80
        img_arr[90:120, 90:120] = 220
        buf = io.BytesIO()
        Image.fromarray(img_arr).save(buf, format="PNG")
        buf.seek(0)

        files = {"file": ("test_mri_scan.png", buf, "image/png")}
        data = {
            "patient_id": "TEST-PT-001",
            "modality": "MRI_DCE",
            "run_immediate": "true"
        }

        response = self.client.post("/api/analysis/upload", data=data, files=files)
        self.assertEqual(response.status_code, 200)
        res_data = response.json()

        analysis_id = res_data["analysis_id"]
        self.assertTrue(analysis_id.startswith("ANL-"))
        self.assertEqual(res_data["status"], AnalysisStatus.COMPLETED.value)
        
        # Verify Agent 1 output
        self.assertIsNotNone(res_data["agent1_detection"])
        self.assertGreater(res_data["agent1_detection"]["lesions_detected"], 0)

        # Verify Agent 2 output
        self.assertIsNotNone(res_data["agent2_classification"])
        self.assertIn(res_data["agent2_classification"]["predicted_class"], ["Normal", "Benign", "Malignant"])

        # Verify Agent 3 output (Our core responsibility)
        self.assertIsNotNone(res_data["agent3_explainability"])
        agent3 = res_data["agent3_explainability"]
        self.assertEqual(agent3["agent_id"], "agent_3")
        self.assertTrue(agent3["heatmap_url"].endswith(".png"))
        self.assertTrue(agent3["overlay_url"].endswith(".png"))
        self.assertIsNotNone(agent3["explanation_metadata"])
        self.assertIn("peak_activation_coords", agent3["explanation_metadata"])

        # Verify Agent 4 output
        self.assertIsNotNone(res_data["agent4_evidence"])
        self.assertGreater(len(res_data["agent4_evidence"]["retrieved_evidence"]), 0)

        # Verify Agent 5 output
        self.assertIsNotNone(res_data["agent5_risk"])
        self.assertIn("BI-RADS", res_data["agent5_risk"]["birads"]["category"])

        # Verify Agent 6 output
        self.assertIsNotNone(res_data["agent6_report"])
        self.assertTrue(res_data["agent6_report"]["pdf_report_url"].endswith(".pdf"))

    def test_explainability_endpoint_custom_params(self):
        # Test with the demo analysis case
        payload = {
            "analysis_id": "ANL-DEMO001",
            "target_class": "Malignant",
            "target_layer": "layer4",
            "colormap": "magma",
            "alpha_blend": 0.6
        }
        response = self.client.post("/api/explainability/gradcam", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["agent_id"], "agent_3")
        self.assertEqual(data["explanation_metadata"]["colormap"], "magma")

    def test_pdf_report_download(self):
        response = self.client.get("/api/reports/ANL-DEMO001/pdf")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("content-type"), "application/pdf")
        self.assertGreater(len(response.content), 1000)

if __name__ == "__main__":
    unittest.main()
