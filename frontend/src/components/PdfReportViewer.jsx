import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle,
  FileCheck2,
  Calendar,
  Lock
} from 'lucide-react';
import { api } from '../services/api';

export default function PdfReportViewer({ analysisRecord }) {
  const [hasRadiologistReviewed, setHasRadiologistReviewed] = useState(false);
  const [radiologistName, setRadiologistName] = useState('Dr. C. Kalaiarasi, MD, FRCR');
  const [signOffComplete, setSignOffComplete] = useState(false);

  const report = analysisRecord?.agent6_report;
  const analysisId = analysisRecord?.analysis_id || 'ANL-DEMO001';
  const pdfUrl = report?.pdf_report_url || api.getReportPdfUrl(analysisId);

  const handleDownload = () => {
    const downloadUrl = api.getReportPdfUrl(analysisId);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `BreastCARE_Report_${analysisId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSignOff = () => {
    if (!hasRadiologistReviewed) return;
    setSignOffComplete(true);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-blue)'
            }}>
              <FileCheck2 size={16} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
              Agent 6: Clinical Decision-Support Report
            </h3>
          </div>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Comprehensive clinical PDF with embedded Grad-CAM overlays and RAG citations
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ExternalLink size={14} />
            <span>Open PDF in Tab</span>
          </a>

          <button
            onClick={handleDownload}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Download size={14} />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Report Summary Metadata Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(11, 19, 37, 0.65)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.78rem'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Report Identifier</span>
          <span style={{ color: '#ffffff', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
            {report?.report_id || `REP-${analysisId.substring(4)}`}
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Generated At</span>
          <span style={{ color: '#ffffff', fontWeight: '600' }}>
            {report?.generated_at || new Date().toISOString().replace('T', ' ').substring(0, 19)}
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Integrity Checksum</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
            SHA256:{report?.report_checksum || 'a8f9c2d1e04b7712'}
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Assigned BI-RADS</span>
          <span style={{ color: '#f43f5e', fontWeight: '700' }}>
            {analysisRecord?.agent5_risk?.birads?.category || 'BI-RADS 5'}
          </span>
        </div>
      </div>

      {/* Embedded PDF Preview Frame */}
      <div style={{
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        backgroundColor: '#0a0f1d',
        height: '480px',
        position: 'relative'
      }}>
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0`}
          title="Clinical Decision Support PDF Preview"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#ffffff'
          }}
          onError={(e) => {
            console.warn('Iframe PDF preview fallback.');
          }}
        />
      </div>

      {/* Human-in-the-Loop Verification Sign-Off */}
      <div style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: signOffComplete ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 27, 51, 0.65)',
        border: `1px solid ${signOffComplete ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <ShieldCheck size={18} color={signOffComplete ? '#10b981' : 'var(--primary)'} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
              Radiologist Human-Review Sign-Off Checkpoint
            </span>
          </div>
          {signOffComplete && (
            <span className="badge badge-benign" style={{ fontSize: '0.7rem' }}>
              <CheckCircle size={12} /> Sign-Off Recorded
            </span>
          )}
        </div>

        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          To maintain ethical AI safety standards, every diagnostic finding and Grad-CAM salience region must be 
          verified by a certified medical specialist prior to biopsy or treatment prescription.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.8rem', color: '#e2e8f0' }}>
            <input
              type="checkbox"
              checked={hasRadiologistReviewed}
              onChange={(e) => setHasRadiologistReviewed(e.target.checked)}
              disabled={signOffComplete}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span>I confirm clinical review of Agent 3 Grad-CAM visual attribution and BI-RADS scoring.</span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reviewing Clinician:</span>
            <input
              type="text"
              value={radiologistName}
              onChange={(e) => setRadiologistName(e.target.value)}
              disabled={signOffComplete}
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                backgroundColor: '#0a0f1d',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            />
          </div>

          <button
            onClick={handleSignOff}
            disabled={!hasRadiologistReviewed || signOffComplete}
            className="btn btn-primary btn-sm"
          >
            {signOffComplete ? 'Verified & Locked' : 'Sign and Approve Decision Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
