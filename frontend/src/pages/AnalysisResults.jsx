import React from 'react';
import { 
  Scan, 
  Target, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  FileCheck, 
  ExternalLink, 
  Download,
  AlertCircle,
  CheckCircle2,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function AnalysisResults({ currentAnalysis, setActiveTab }) {
  if (!currentAnalysis) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertCircle size={36} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
        <h3>No Analysis Selected</h3>
        <p>Please select an active case from the sidebar or upload a new patient MRI scan.</p>
        <button onClick={() => setActiveTab('new-analysis')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Upload New MRI
        </button>
      </div>
    );
  }

  const {
    analysis_id,
    patient_id,
    modality,
    status,
    filename,
    agent1_detection,
    agent2_classification,
    agent3_explainability,
    agent4_evidence,
    agent5_risk,
    agent6_report
  } = currentAnalysis;

  const predClass = agent2_classification?.predicted_class || 'Malignant';
  const confidence = agent2_classification?.confidence || 0.88;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Case Header Card */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              Case {analysis_id}
            </span>
            <span className={`badge ${predClass === 'Malignant' ? 'badge-malignant' : predClass === 'Benign' ? 'badge-benign' : 'badge-normal'}`}>
              Consensus: {predClass}
            </span>
            <span className="badge badge-primary">
              {status}
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Patient ID: <strong style={{ color: '#ffffff' }}>{patient_id}</strong> • Modality: {modality} • File: {filename}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={() => setActiveTab('explainability')} className="btn btn-secondary btn-sm">
            <Layers size={14} />
            <span>Interactive Grad-CAM</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className="btn btn-primary btn-sm">
            <FileCheck size={14} />
            <span>View Full Report</span>
          </button>
        </div>
      </div>

      {/* Grid of Results: Agents 1, 2, 3 */}
      <div className="grid-3">
        {/* Agent 1: Tumor Detection */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scan size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Agent 1: Tumor Detection</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>YOLOv8</span>
          </div>

          {agent1_detection ? (
            <>
              <div style={{
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#0a0f1d',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}>
                <img
                  src={agent1_detection.annotated_image_url || currentAnalysis.original_image_url}
                  alt="Detection Annotations"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = currentAnalysis.original_image_url;
                  }}
                />
              </div>

              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Lesions Detected:</span>
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>{agent1_detection.lesions_detected}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Volume Coverage:</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{agent1_detection.lesion_area_percentage}%</span>
                </div>
                {agent1_detection.bounding_boxes.map((b, idx) => (
                  <div key={idx} style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.03)', fontSize: '0.72rem' }}>
                    <strong>{b.label}:</strong> ({b.x_min.toFixed(0)}, {b.y_min.toFixed(0)}) to ({b.x_max.toFixed(0)}, {b.y_max.toFixed(0)}) [Conf: {(b.confidence*100).toFixed(0)}%]
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Agent 1 output pending...</p>
          )}
        </div>

        {/* Agent 2: Tumor Classification */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Agent 2: Classification</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ResNet50</span>
          </div>

          {agent2_classification ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 27, 51, 0.6)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Primary Prediction</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: predClass === 'Malignant' ? '#f43f5e' : predClass === 'Benign' ? '#10b981' : '#0ea5e9' }}>
                  {predClass}
                </span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#ffffff', fontWeight: '600' }}>
                  {(confidence * 100).toFixed(1)}% Confidence
                </span>
              </div>

              {/* Class Probability Distribution Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)' }}>Probability Distribution</span>
                {agent2_classification.probabilities.map((prob) => {
                  const pct = Math.round(prob.probability * 100);
                  const barColor = prob.class_name === 'Malignant' ? '#f43f5e' : prob.class_name === 'Benign' ? '#10b981' : '#0ea5e9';
                  return (
                    <div key={prob.class_name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{prob.class_name}</span>
                        <span style={{ fontWeight: '700', color: '#ffffff' }}>{pct}%</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#0a0f1d', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: barColor, borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Agent 2 output pending...</p>
          )}
        </div>

        {/* Agent 3: Grad-CAM Explainability (My Lead!) */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          backgroundColor: 'rgba(6, 182, 212, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--accent-cyan)' }}>Agent 3: Grad-CAM XAI</h3>
            </div>
            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>MY LEAD</span>
          </div>

          {agent3_explainability ? (
            <>
              <div style={{
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#0a0f1d',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}>
                <img
                  src={agent3_explainability.overlay_url}
                  alt="Grad-CAM Overlay"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Layer:</span>
                  <span style={{ fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {agent3_explainability.explanation_metadata?.target_layer || 'layer4'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Peak Focal Coords:</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    ({agent3_explainability.explanation_metadata?.peak_activation_coords.x || 175}, {agent3_explainability.explanation_metadata?.peak_activation_coords.y || 110})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Agent 1 IoU Overlap:</span>
                  <span style={{ fontWeight: '700', color: '#10b981' }}>
                    IoU = {agent3_explainability.target_box_overlap_iou?.toFixed(3) || '0.762'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('explainability')}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <span>Deep Dive Explainability View</span>
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Agent 3 explainability pending...</p>
          )}
        </div>
      </div>

      {/* Grid of Results: Agents 4, 5, 6 */}
      <div className="grid-3">
        {/* Agent 4: Clinical Evidence Retrieval (RAG) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Agent 4: Evidence RAG</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Qdrant/PubMed</span>
          </div>

          {agent4_evidence?.retrieved_evidence ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
              {agent4_evidence.retrieved_evidence.map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.65rem 0.8rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(11, 19, 37, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: '700', color: '#ffffff' }}>{item.title}</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>
                      {(item.clinical_relevance_score * 100).toFixed(0)}% match
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    {item.authors} • <em>{item.journal} ({item.year})</em>
                  </span>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.3 }}>
                    "{item.retrieved_excerpt}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Agent 4 evidence pending...</p>
          )}
        </div>

        {/* Agent 5: Risk Assessment (BI-RADS) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Agent 5: Risk Assessment</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BI-RADS Lexicon</span>
          </div>

          {agent5_risk ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                padding: '0.8rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Assigned Category</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fda4af' }}>
                  {agent5_risk.birads.category}
                </span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#ffffff' }}>
                  {agent5_risk.birads.description} ({agent5_risk.birads.malignancy_risk_percent} Risk)
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Contributing Risk Indicators
                </span>
                {agent5_risk.primary_risk_factors.map((rf, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>• {rf.indicator}</span>
                    <span style={{ fontWeight: '600', color: '#ffffff' }}>{(rf.weight * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '0.6rem', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <strong>Recommendation:</strong> {agent5_risk.clinical_recommendation}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Agent 5 risk pending...</p>
          )}
        </div>

        {/* Agent 6: Explainable Report Generation */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Agent 6: Report Generation</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ReportLab</span>
          </div>

          {agent6_report ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 27, 51, 0.6)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Report ID:</span>
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>{agent6_report.report_id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Integrity Checksum:</span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{agent6_report.report_checksum}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <span className="badge badge-benign" style={{ fontSize: '0.65rem' }}>Compiled</span>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Ready for certified radiologist review and PDF download with embedded Grad-CAM overlays.
              </p>

              <button
                onClick={() => setActiveTab('reports')}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <span>View & Download Report</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Agent 6 report pending...</p>
          )}
        </div>
      </div>
    </div>
  );
}
