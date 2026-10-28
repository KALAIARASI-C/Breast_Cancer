import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  ActivitySquare, 
  Layers, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentAnalysis, analyses, onSelectAnalysis }) {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'new-analysis', label: 'New MRI Ingestion', icon: UploadCloud },
    { id: 'results', label: 'Multi-Agent Results', icon: ActivitySquare },
    { id: 'explainability', label: 'Grad-CAM Explainability', icon: Layers, highlight: true },
    { id: 'reports', label: 'Clinical PDF Reports', icon: FileText },
  ];

  const agentBadges = [
    { num: '1', name: 'Tumor Detection', model: 'YOLOv8', lead: 'Atchaya' },
    { num: '2', name: 'Classification', model: 'ResNet50', lead: 'Atchaya' },
    { num: '3', name: 'Grad-CAM XAI', model: 'Grad-CAM', lead: 'Kalaiarasi', active: true },
    { num: '4', name: 'Evidence RAG', model: 'Qdrant/PubMed', lead: 'Hariharasudhan' },
    { num: '5', name: 'Risk Scoring', model: 'BI-RADS', lead: 'Hariharasudhan' },
    { num: '6', name: 'Report Generation', model: 'ReportLab', lead: 'Hariharasudhan' },
  ];

  return (
    <aside style={{
      width: '280px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 1rem',
      flexShrink: 0,
      gap: '1.5rem',
      userSelect: 'none'
    }}>
      {/* Active Case Selector */}
      <div style={{
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(15, 27, 51, 0.8)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
            Active Case
          </span>
          <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
            {currentAnalysis?.status || 'Active'}
          </span>
        </div>

        <select
          value={currentAnalysis?.analysis_id || ''}
          onChange={(e) => onSelectAnalysis(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: '#0a0f1d',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-focus)',
            borderRadius: '6px',
            padding: '0.4rem 0.5rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {analyses.map(a => (
            <option key={a.analysis_id} value={a.analysis_id}>
              {a.analysis_id} ({a.patient_id})
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.45rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>Target: {currentAnalysis?.agent2_classification?.predicted_class || 'Malignant'}</span>
          <span>Conf: {currentAnalysis?.agent2_classification ? `${(currentAnalysis.agent2_classification.confidence*100).toFixed(0)}%` : '88%'}</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em', paddingLeft: '0.5rem', marginBottom: '0.2rem' }}>
          Navigation
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.05) 100%)' 
                  : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.highlight && (
                <span style={{
                  fontSize: '0.6rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(6, 182, 212, 0.2)',
                  color: 'var(--accent-cyan)',
                  fontWeight: '700'
                }}>
                  MY LEAD
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 6-Agent Ecosystem Architecture Summary */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingLeft: '0.5rem' }}>
          <Cpu size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
            Multi-Agent Pipeline
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {agentBadges.map((a) => (
            <div
              key={a.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                backgroundColor: a.active ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${a.active ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
                fontSize: '0.72rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  backgroundColor: a.active ? 'var(--primary)' : '#1e293b',
                  color: a.active ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.65rem'
                }}>
                  A{a.num}
                </span>
                <span style={{ color: a.active ? '#ffffff' : 'var(--text-secondary)', fontWeight: a.active ? '600' : '500' }}>
                  {a.name}
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {a.model}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice Footer */}
      <div style={{
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(244, 63, 94, 0.06)',
        border: '1px solid rgba(244, 63, 94, 0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem'
      }}>
        <ShieldAlert size={16} color="var(--malignant)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '0.68rem', color: '#fda4af', lineHeight: 1.3 }}>
          Decision-support prototype only. Findings must be confirmed by a licensed clinician.
        </span>
      </div>
    </aside>
  );
}
