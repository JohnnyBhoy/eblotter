import React from 'react';

interface StatsCardProps {
  label: string;
  value?: number | string | null;
  icon?: React.ReactNode;
  color?: string;
  sub?: string;
  glowColor?: string;
}

export default function StatsCard({ label, value, icon, glowColor = 'rgba(59,130,246,0.15)', sub }: StatsCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:translate-y-[-2px]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {icon && (
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: glowColor, border: `1px solid ${glowColor.replace('0.15', '0.3')}` }}
        >
          {icon}
        </div>
      )}
      <div>
        <div className="text-2xl font-bold text-white tracking-tight">{value ?? '—'}</div>
        <div className="text-xs font-medium uppercase tracking-wider mt-0.5" style={{ color: '#475569' }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: '#334155' }}>{sub}</div>}
      </div>
    </div>
  );
}
