import React from 'react';
import { Activity, Shield, Sparkles, Plus, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isLiveBackend }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.9rem 2.25rem',
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Brand Logo */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        onClick={() => setActiveTab('dashboard')}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
        }}>
          <Activity size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Breast <span style={{ color: 'var(--primary)' }}>CARE-MA</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              FRONTEND & XAI UI
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Lead: Kalaiarasi C • React + Vite Frontend
          </span>
        </div>
      </div>

      {/* Center Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'new-analysis', label: 'New MRI Analysis' },
          { id: 'results', label: 'Analysis Results' },
          { id: 'explainability', label: 'Grad-CAM Explainability' },
          { id: 'reports', label: 'PDF Reports' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.target.style.color = 'var(--text-secondary)';
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Backend Status & CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Connection Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: isLiveBackend ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          color: isLiveBackend ? '#34d399' : '#fbbf24',
          border: `1px solid ${isLiveBackend ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isLiveBackend ? '#10b981' : '#f59e0b',
            display: 'inline-block',
            boxShadow: `0 0 8px ${isLiveBackend ? '#10b981' : '#f59e0b'}`
          }}></span>
          {isLiveBackend ? 'Live Backend Connected' : 'Mock Mode (Awaiting Teammate Backend)'}
        </div>

        {/* Start Analysis Button */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setActiveTab('new-analysis')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <Plus size={16} />
          <span>New Analysis</span>
        </button>
      </div>
    </header>
  );
}
