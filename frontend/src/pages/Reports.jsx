import React from 'react';
import PdfReportViewer from '../components/PdfReportViewer';
import { FileText, Shield, Sparkles } from 'lucide-react';

export default function Reports({ currentAnalysis, setActiveTab }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary">
            <Sparkles size={12} /> Agent 6 Deliverable
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Audited Clinical Documentation
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', margin: 0, letterSpacing: '-0.02em' }}>
          Clinical Decision-Support PDF Report Center
        </h1>
        <p style={{ margin: '0.35rem 0 0 0', maxWidth: '750px' }}>
          Audit-ready diagnostic reports synthesizing multi-agent findings, Grad-CAM visual heatmaps, 
          biomedical RAG evidence, and BI-RADS clinical scoring for clinician sign-off.
        </p>
      </div>

      {/* Embedded PDF Viewer Component */}
      <PdfReportViewer analysisRecord={currentAnalysis} />
    </div>
  );
}
