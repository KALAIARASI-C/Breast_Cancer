# Breast CARE-MA — Agent 3 (Grad-CAM Explainability) Technical Specification

**Author & Module Lead:** Kalaiarasi C (Medical Imaging & Explainable AI Lead)  
**Assigned Service:** `backend/agents/agent3_gradcam.py`  
**API Endpoints:** `POST /api/explainability/gradcam`, `GET /api/explainability/{analysis_id}`  
**UI Interface:** `frontend/src/components/GradCamViewer.jsx` & `frontend/src/pages/Explainability.jsx`

---

## 1. Mathematical Formulation

Gradient-weighted Class Activation Mapping (Grad-CAM) generates a visual attribution map highlighting image regions that drive the decision for a particular class $c \in \{\text{Normal}, \text{Benign}, \text{Malignant}\}$.

### A. Neuron Importance Weights $\alpha_k^c$
Let $A^k$ denote the $k$-th feature activation map produced by convolutional layer $l$ (e.g., `layer4` of ResNet50), with spatial dimensions $U \times V$. For class score $Y^c$ prior to the softmax activation:

$$\alpha_k^c = \frac{1}{Z} \sum_{i=1}^U \sum_{j=1}^V \frac{\partial Y^c}{\partial A_{i,j}^k}$$

where $Z = U \times V$ represents the spatial dimensions of the feature map (global average pooling).

### B. Weighted Linear Combination & Rectification
The coarse Grad-CAM localization map $L_{\text{Grad-CAM}}^c$ is computed as:

$$L_{\text{Grad-CAM}}^c = \text{ReLU}\left( \sum_{k=1}^K \alpha_k^c A^k \right)$$

Applying the Rectified Linear Unit ($\text{ReLU}$) isolates features that have a positive influence on the target class $c$, disregarding features that correspond to alternative categories.

### C. Normalization & Bilinear Upsampling
The output $L_{\text{Grad-CAM}}^c$ is normalized to the unit interval $[0.0, 1.0]$:

$$H_{\text{norm}}(i, j) = \frac{L(i, j) - \min(L)}{\max(L) - \min(L) + \epsilon}, \quad \epsilon = 10^{-8}$$

The normalized 2D map is then upsampled to the original input MRI resolution $W \times H$ using bilinear interpolation:

$$\text{Heatmap}_{W \times H} = \text{BilinearUpsample}(H_{\text{norm}}, (W, H))$$

### D. Colormap Conversion & Anatomical Overlay
The grayscale heatmap is mapped through a pseudo-color spectrum (Default: `jet`; Options: `viridis`, `magma`, `turbo`) to produce an RGB array $\mathbf{C} \in \mathbb{R}^{W \times H \times 3}$.

The overlay is blended with original scan $\mathbf{I} \in \mathbb{R}^{W \times H \times 3}$ using parameter $\alpha \in [0.0, 1.0]$:

$$\mathbf{O} = (1.0 - \alpha) \cdot \mathbf{I} + \alpha \cdot \mathbf{C}$$

---

## 2. Quantitative Explainability Metrics

Agent 3 calculates three objective spatial metrics alongside the visual heatmap:
1. **Peak Activation Coordinate $(x_{\text{peak}}, y_{\text{peak}})$:** The exact pixel coordinate corresponding to $\max(H_{\text{norm}})$. Indicates primary focal attention.
2. **Coverage Ratio:** Fraction of breast volume pixels where $H_{\text{norm}} \ge 0.50$. Quantifies the extent of high-salience suspicion.
3. **IoU Concurrence with Agent 1:** Intersection over Union between the high-activation thresholded binary mask and Agent 1's bounding box:
   $$\text{IoU} = \frac{|\text{Mask}_{\ge 0.5} \cap \text{BBox}_{\text{Agent 1}}|}{|\text{Mask}_{\ge 0.5} \cup \text{BBox}_{\text{Agent 1}}|}$$

---

## 3. Pydantic Contract Schema

```python
class GradCamMetadata(BaseModel):
    target_layer: str                    # e.g., "layer4", "layer3"
    target_class: str                    # "Normal", "Benign", or "Malignant"
    target_class_confidence: float       # Model prediction probability
    peak_activation_coords: Coordinate   # {x: int, y: int}
    peak_intensity: float                # 1.0
    mean_intensity: float                # Average salience
    coverage_ratio: float                # Fraction of volume >= 0.5
    input_resolution: Tuple[int, int]    # (W, H)
    heatmap_resolution: Tuple[int, int]  # (W, H)
    colormap: str                        # "jet", "viridis", "magma", "turbo"
    alpha_blend: float                   # 0.55
    computation_engine: str              # Engine descriptor

class Agent3GradCamOutput(BaseAgentOutput):
    analysis_id: str
    agent_id: str = "agent_3"
    source_agent_ids: List[str]          # ["agent_1", "agent_2"]
    target_class: str
    original_image_url: str
    heatmap_url: str
    overlay_url: str
    model_identifier: str
    explanation_metadata: Optional[GradCamMetadata]
    attribution_interpretation: str
    target_box_overlap_iou: Optional[float]
```
