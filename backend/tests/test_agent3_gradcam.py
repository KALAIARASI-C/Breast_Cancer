import os
import unittest
import numpy as np
from PIL import Image
from pathlib import Path

from backend.agents.agent3_gradcam import GradCamEngine
from backend.schemas.common import AnalysisStatus
from backend.config import UPLOADS_DIR, HEATMAPS_DIR

class TestAgent3GradCam(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create a test synthetic breast MRI image (grayscale with a focal lesion)
        cls.test_img_path = str(UPLOADS_DIR / "test_mri_slice.png")
        img_arr = np.zeros((256, 256), dtype=np.uint8)
        # Background tissue
        img_arr[30:220, 40:210] = 70
        # Focal suspicious lesion
        img_arr[100:140, 110:150] = 210
        Image.fromarray(img_arr).save(cls.test_img_path)
        cls.engine = GradCamEngine(target_layer="layer4", colormap="jet")

    def test_image_loading_and_normalization(self):
        pil_img, img_np = self.engine.load_image(self.test_img_path)
        self.assertEqual(img_np.shape, (256, 256, 3))
        self.assertGreaterEqual(img_np.min(), 0.0)
        self.assertLessEqual(img_np.max(), 1.0)

    def test_gradcam_generation_success(self):
        output = self.engine.generate_explainability(
            analysis_id="test-case-001",
            image_path=self.test_img_path,
            target_class="Malignant",
            target_class_confidence=0.92,
            detection_bbox={"x_min": 100, "y_min": 90, "x_max": 160, "y_max": 150},
            alpha_blend=0.5
        )

        self.assertEqual(output.status, AnalysisStatus.COMPLETED)
        self.assertEqual(output.agent_id, "agent_3")
        self.assertEqual(output.target_class, "Malignant")
        self.assertIsNotNone(output.explanation_metadata)
        
        meta = output.explanation_metadata
        self.assertEqual(meta.target_layer, "layer4")
        self.assertEqual(meta.input_resolution, (256, 256))
        self.assertGreaterEqual(meta.peak_intensity, 0.95)
        self.assertGreater(meta.coverage_ratio, 0.0)
        self.assertLess(meta.coverage_ratio, 1.0)

        # Verify saved heatmap and overlay files exist on disk
        heatmap_file = HEATMAPS_DIR / "gradcam_heatmap_test-case-001.png"
        overlay_file = HEATMAPS_DIR / "gradcam_overlay_test-case-001.png"
        self.assertTrue(heatmap_file.exists())
        self.assertTrue(overlay_file.exists())

        # Verify dimensions match original
        h_img = Image.open(heatmap_file)
        o_img = Image.open(overlay_file)
        self.assertEqual(h_img.size, (256, 256))
        self.assertEqual(o_img.size, (256, 256))

    def test_invalid_image_path_handling(self):
        output = self.engine.generate_explainability(
            analysis_id="test-fail-001",
            image_path="non_existent_image.png",
            target_class="Benign"
        )
        self.assertEqual(output.status, AnalysisStatus.FAILED)
        self.assertIn("failed", output.error_details.lower())

if __name__ == "__main__":
    unittest.main()
