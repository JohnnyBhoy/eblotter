import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.js';
import { formatDate } from '../../utils/formatters.js';
import type { Blotter } from '../../types/index.js';

interface BlotterCardProps {
  blotter: Blotter;
  basePath?: string;
}

export default function BlotterCard({ blotter, basePath = '' }: BlotterCardProps) {
  const name = blotter.complainant
    ? `${blotter.complainant.lastName}, ${blotter.complainant.firstName}`
    : '—';

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-200 hover:translate-y-[-2px]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.25)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(59,130,246,0.1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'; }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-bold text-xs" style={{ color: '#60a5fa' }}>{blotter.blotterNumber}</span>
        <StatusBadge status={blotter.status} />
      </div>
      <div className="text-sm font-semibold text-white mb-1">{blotter.incident?.type}</div>
      <div className="text-xs mb-0.5" style={{ color: '#64748b' }}>Complainant: {name}</div>
      <div className="text-xs mb-3" style={{ color: '#475569' }}>{formatDate(blotter.dateRecorded)}</div>
      <Link
        to={`${basePath}/${blotter._id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
        style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        View Details
      </Link>
    </div>
  );
}
