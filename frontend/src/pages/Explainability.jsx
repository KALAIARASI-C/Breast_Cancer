import React from 'react';
import GradCamViewer from '../components/GradCamViewer';
import { 
  Layers, 
  HelpCircle, 
  Cpu, 
  ShieldAlert, 
  Sparkles, 
  Info,
  CheckCircle2,
  Code
} from 'lucide-react';

export default function Explainability({ currentAnalysis, onGradCamUpdated }) {
  const agent3 = currentAnalysis?.agent3_explainability;
  const meta = agent3?.explanation_metadata;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">
              <Sparkles size={12} /> Lead Responsibility: Kalaiarasi C
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Medical Imaging & Explainable AI Module
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', margin: 0, letterSpacing: '-0.02em' }}>
            Agent 3: Grad-CAM Explainability Deep-Dive
          </h1>
          <p style={{ margin: '0.35rem 0 0 0', maxWidth: '800px' }}>
            Class-discriminative localization mapping class-specific feature activations from deep convolutional 
            layers to verify spatial concurrence with suspected breast neoplastic lesions.
          </p>
        </div>

        {/* Case Badge */}
        <div style={{
          padding: '0.6rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(15, 27, 51, 0.7)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'right'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Current Case</span>
          <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
            {currentAnalysis?.analysis_id || 'ANL-DEMO001'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
            {currentAnalysis?.patient_id || 'BRCA-PT-8842'}
          </span>
        </div>
      </div>

      {/* Main Interactive Grad-CAM Viewer Component */}
      <GradCamViewer 
        analysisRecord={currentAnalysis}
        onGradCamUpdated={onGradCamUpdated}
      />

      {/* Mathematical & Architectural Framework Panel */}
      <div className="grid-2">
        {/* Mathematical Formulation */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Code size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Mathematical Formulation of Grad-CAM</h3>
          </div>
          
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Grad-CAM calculates the gradient of the score for target class <code style={{ color: 'var(--accent-cyan)' }}>c</code> with respect to feature activation maps <code style={{ color: 'var(--accent-cyan)' }}>A^k</code> of convolutional layer <code style={{ color: 'var(--accent-cyan)' }}>l</code>:
          </p>

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#050914',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: '#38bdf8',
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            <div><strong>1. Neuron Importance Weights:</strong></div>
            <div style={{ paddingLeft: '1rem', color: '#f8fafc' }}>
              α_k^c = (1 / Z) * Σ_i Σ_j (∂Y^c / ∂A_{`{i,j}`}^k)
            </div>
            <div style={{ marginTop: '0.5rem' }}><strong>2. ReLU Linear Combination:</strong></div>
            <div style={{ paddingLeft: '1rem', color: '#f8fafc' }}>
              L_GradCAM^c = ReLU( Σ_k α_k^c * A^k )
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Applying the Rectified Linear Unit (ReLU) ensures that only positive feature contributions 
            (features that increase confidence in the target class) are represented in the heatmap, filtering out negative influences.
          </p>
        </div>

        {/* Neural Network Layer Exploration */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Cpu size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Layer Receptive Field & Spatial Resolution</h3>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Feature map resolution decreases with depth while semantic abstraction increases. Comparison across ResNet50 stages:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.825rem' }}>layer4 (Recommended)</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Deepest bottleneck blocks • 2048 channels • High semantic abstraction
                </span>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Active</span>
            </div>

            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '0.825rem' }}>layer3</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Intermediate representation • 1024 channels • Captures regional morphologic borders
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Available</span>
            </div>

            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '0.825rem' }}>conv5 / early layers</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Shallow convolutional filters • Captures edge contrast and micro-calcification textures
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Medical Disclaimers */}
      <div style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(244, 63, 94, 0.06)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <ShieldAlert size={22} color="var(--malignant)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fda4af', display: 'block', marginBottom: '0.25rem' }}>
            Clinical Validation & Explainability Safety Notice
          </span>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#fecdd3', lineHeight: 1.4 }}>
            Grad-CAM heatmaps highlight regions of high visual attribution for the AI model's internal representations. 
            They do not establish ground-truth clinical diagnosis or histological malignancy independently. 
            All focal highlights must be correlated with dynamic kinetic curves and verified by a licensed radiologist or oncologist.
          </p>
        </div>
      </div>
    </div>
  );
}
