import React from 'react';
import MriUploader from '../components/MriUploader';
import { Shield, Sparkles, CheckCircle2, Cpu } from 'lucide-react';

export default function NewAnalysis({ onAnalysisCreated }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Upload Component */}
      <MriUploader onAnalysisCreated={onAnalysisCreated} />

      {/* Protocol & Clinical Guidelines Info Card */}
      <div className="glass-card" style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} color="var(--primary)" />
          Diagnostic Data Integrity & Multimodal Protocol
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            <span style={{ fontWeight: '700', color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}>
              1. Accepted Image Modalities
            </span>
            <span>Dynamic Contrast-Enhanced MRI (DCE-MRI), T1-weighted, T2-weighted fat-suppressed cross-sections in DICOM or PNG format.</span>
          </div>
          <div>
            <span style={{ fontWeight: '700', color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}>
              2. Agent 3 Grad-CAM Attributions
            </span>
            <span>Feature activation is calculated directly on convolutional layers to verify spatial concurrence with suspected lesions.</span>
          </div>
          <div>
            <span style={{ fontWeight: '700', color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}>
              3. Privacy & HIPAA Compliance
            </span>
            <span>All uploads are processed locally on the secure backend. Patient identifiable headers are stripped during ingestion.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
