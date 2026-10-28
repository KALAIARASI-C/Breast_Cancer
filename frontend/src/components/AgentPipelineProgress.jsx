import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  Scan, 
  Target, 
  BookOpen, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';

export default function AgentPipelineProgress({ analysisRecord }) {
  const steps = [
    {
      num: 1,
      id: 'agent_1',
      title: 'Agent 1: Tumor Detection',
      model: 'YOLOv8-BreastMRI',
      lead: 'Atchaya',
      icon: Scan,
      data: analysisRecord?.agent1_detection,
      summary: analysisRecord?.agent1_detection 
        ? `${analysisRecord.agent1_detection.lesions_detected} lesion(s) localized (${analysisRecord.agent1_detection.lesion_area_percentage}% area)`
        : 'Awaiting image input',
      status: analysisRecord?.agent1_detection?.status || 'PENDING'
    },
    {
      num: 2,
      id: 'agent_2',
      title: 'Agent 2: Tumor Classification',
      model: 'ResNet50-Classifier',
      lead: 'Atchaya',
      icon: Target,
      data: analysisRecord?.agent2_classification,
      summary: analysisRecord?.agent2_classification
        ? `${analysisRecord.agent2_classification.predicted_class} (${(analysisRecord.agent2_classification.confidence * 100).toFixed(1)}%)`
        : 'Pending detection output',
      status: analysisRecord?.agent2_classification?.status || 'PENDING'
    },
    {
      num: 3,
      id: 'agent_3',
      title: 'Agent 3: Grad-CAM Explainability',
      model: 'Grad-CAM Feature Attribution',
      lead: 'Kalaiarasi (My Lead)',
      isMyLead: true,
      icon: Layers,
      data: analysisRecord?.agent3_explainability,
      summary: analysisRecord?.agent3_explainability?.explanation_metadata
        ? `Layer4 peak at (${analysisRecord.agent3_explainability.explanation_metadata.peak_activation_coords.x}, ${analysisRecord.agent3_explainability.explanation_metadata.peak_activation_coords.y})`
        : 'Pending classifier logits',
      status: analysisRecord?.agent3_explainability?.status || 'PENDING'
    },
    {
      num: 4,
      id: 'agent_4',
      title: 'Agent 4: Evidence Retrieval (RAG)',
      model: 'Qdrant / PubMed Corpus',
      lead: 'Hariharasudhan',
      icon: BookOpen,
      data: analysisRecord?.agent4_evidence,
      summary: analysisRecord?.agent4_evidence
        ? `${analysisRecord.agent4_evidence.evidence_count} citations linked`
        : 'Pending classification context',
      status: analysisRecord?.agent4_evidence?.status || 'PENDING'
    },
    {
      num: 5,
      id: 'agent_5',
      title: 'Agent 5: Risk Assessment',
      model: 'BI-RADS Classification Engine',
      lead: 'Hariharasudhan',
      icon: ShieldCheck,
      data: analysisRecord?.agent5_risk,
      summary: analysisRecord?.agent5_risk?.birads
        ? `${analysisRecord.agent5_risk.birads.category} (Score: ${analysisRecord.agent5_risk.composite_risk_score}/100)`
        : 'Pending multimodal synthesis',
      status: analysisRecord?.agent5_risk?.status || 'PENDING'
    },
    {
      num: 6,
      id: 'agent_6',
      title: 'Agent 6: Report Generation',
      model: 'ReportLab PDF Compiler',
      lead: 'Hariharasudhan',
      icon: FileCheck,
      data: analysisRecord?.agent6_report,
      summary: analysisRecord?.agent6_report
        ? `PDF compiled (${analysisRecord.agent6_report.report_id})`
        : 'Pending risk assessment',
      status: analysisRecord?.agent6_report?.status || 'PENDING'
    }
  ];

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
            6-Agent Collaborative Reasoning Pipeline
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Sequential multi-agent handoff with state validation and traceability
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Overall Progress:</span>
          <span className="badge badge-primary">
            {analysisRecord?.progress_percentage || 100}%
          </span>
        </div>
      </div>

      {/* Connected Grid of 6 Agents */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem'
      }}>
        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = s.status === 'COMPLETED';
          const isFailed = s.status === 'FAILED';

          return (
            <div
              key={s.num}
              style={{
                borderRadius: 'var(--radius-md)',
                backgroundColor: s.isMyLead 
                  ? 'rgba(6, 182, 212, 0.08)' 
                  : 'rgba(11, 19, 37, 0.6)',
                border: `1px solid ${s.isMyLead ? 'rgba(6, 182, 212, 0.4)' : isDone ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                padding: '0.9rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                position: 'relative',
                boxShadow: s.isMyLead ? '0 0 16px rgba(6, 182, 212, 0.15)' : 'none'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDone ? '#10b981' : 'var(--text-muted)'
                  }}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#ffffff', display: 'block' }}>
                      {s.title}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Lead: {s.lead}
                    </span>
                  </div>
                </div>

                {isDone ? (
                  <CheckCircle2 size={16} color="#10b981" />
                ) : isFailed ? (
                  <AlertCircle size={16} color="var(--malignant)" />
                ) : (
                  <Clock size={16} color="var(--text-muted)" />
                )}
              </div>

              {/* Summary line */}
              <p style={{ margin: 0, fontSize: '0.75rem', color: isDone ? '#e2e8f0' : 'var(--text-muted)', lineHeight: 1.3 }}>
                {s.summary}
              </p>

              {/* Footer info: latency and model */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.35rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{s.model}</span>
                {s.data?.execution_time_ms && (
                  <span style={{ color: 'var(--accent-cyan)' }}>
                    {s.data.execution_time_ms.toFixed(0)}ms
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
