import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, badge, accent = 'cyan' }) {
  const accentColors = {
    cyan: { text: '#22d3ee', border: 'rgba(6, 182, 212, 0.4)', bg: 'rgba(6, 182, 212, 0.1)' },
    rose: { text: '#f43f5e', border: 'rgba(244, 63, 94, 0.4)', bg: 'rgba(244, 63, 94, 0.1)' },
    emerald: { text: '#10b981', border: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.1)' },
    amber: { text: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.1)' },
  };

  const style = accentColors[accent] || accentColors.cyan;

  return (
    <div className="glass-card glass-card-interactive" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Bottom accent glow strip */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${style.text} 0%, transparent 100%)`
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: style.bg,
            border: `1px solid ${style.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={18} color={style.text} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
          {value}
        </span>
        {badge && (
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            backgroundColor: style.bg,
            color: style.text,
            border: `1px solid ${style.border}`
          }}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
