import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.js';
import { formatDate } from '../../utils/formatters.js';
import type { Blotter } from '../../types/index.js';

const INCIDENT_TYPES = [
  'Physical Injury', 'Theft', 'Robbery', 'Estafa / Fraud',
  'Threat / Intimidation', 'Unjust Vexation', 'Trespassing',
  'Oral Defamation / Slander', 'Domestic Violence',
  'Drug-Related Incident', 'Noise Disturbance',
  'Property Damage', 'Missing Person', 'Other'
];

const STATUSES = ['draft', 'recorded', 'under_mediation', 'settled', 'referred_to_pnp', 'closed'];

export interface FilterParams {
  search?: string;
  status?: string;
  incidentType?: string;
  page?: number;
  [key: string]: unknown;
}

interface BlotterTableProps {
  blotters?: Blotter[];
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onFilterChange?: (params: FilterParams) => void;
  viewPath?: string;
  readOnly?: boolean;
  onEdit?: (blotter: Blotter) => void;
}

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#cbd5e1',
  fontSize: 13,
  padding: '7px 12px',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none' as const,
};

export default function BlotterTable({
  blotters = [], total = 0, page = 1, totalPages = 1,
  onPageChange, onFilterChange, viewPath = '', readOnly = false, onEdit,
}: BlotterTableProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [incidentType, setIncidentType] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onFilterChange?.({ search, status, incidentType, page: 1 });
  }

  function handleFilter(key: string, value: string) {
    const next: FilterParams = { search, status, incidentType, [key]: value, page: 1 };
    if (key === 'status') setStatus(value);
    if (key === 'incidentType') setIncidentType(value);
    onFilterChange?.(next);
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-56">
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Search blotter no., complainant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'rgba(37,99,235,0.8)', border: '1px solid rgba(59,130,246,0.4)' }}
          >
            Search
          </button>
        </form>
        <select
          style={selectStyle}
          value={status}
          onChange={e => handleFilter('status', e.target.value)}
        >
          <option value="" style={{ background: '#0a1628' }}>All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s} style={{ background: '#0a1628' }}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select
          style={selectStyle}
          value={incidentType}
          onChange={e => handleFilter('incidentType', e.target.value)}
        >
          <option value="" style={{ background: '#0a1628' }}>All Types</option>
          {INCIDENT_TYPES.map(t => <option key={t} value={t} style={{ background: '#0a1628' }}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Blotter No.', 'Barangay', 'Incident Type', 'Complainant', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blotters.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: '#334155' }}>
                  <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-30">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                    No blotters found.
                  </div>
                </td>
              </tr>
            ) : blotters.map((b, idx) => (
              <tr
                key={b._id}
                style={{
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'; }}
              >
                <td className="px-4 py-3 font-semibold text-xs" style={{ color: '#60a5fa' }}>{b.blotterNumber}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{b.barangay?.name ?? 'N/A'}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#cbd5e1' }}>{b.incident?.type}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#cbd5e1' }}>
                  {b.complainant ? `${b.complainant.lastName}, ${b.complainant.firstName}` : 'N/A'}
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#64748b' }}>{formatDate(b.dateRecorded)}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {viewPath && (
                      <Link
                        to={`${viewPath}/${b._id}`}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                        style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                      >
                        View
                      </Link>
                    )}
                    {!readOnly && onEdit && (
                      <button
                        onClick={() => onEdit(b)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                        style={{ color: '#fb923c', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs" style={{ color: '#475569' }}>Showing {blotters.length} of {total} records</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs rounded-lg transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              ‹ Prev
            </button>
            <span className="px-3 py-1.5 text-xs rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs rounded-lg transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
