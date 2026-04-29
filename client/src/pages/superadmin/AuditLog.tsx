import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import { formatDateTime } from '../../utils/formatters.js';
import api from '../../utils/api.js';
import type { AuditLog as AuditLogEntry } from '../../types/index.js';

const ACTION_STYLES: Record<string, React.CSSProperties> = {
  CREATE_BLOTTER: { background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' },
  UPDATE_BLOTTER: { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d' },
  DELETE_BLOTTER: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' },
  UPDATE_STATUS: { background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c4b5fd' },
  CREATE_ACCOUNT: { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' },
  UPDATE_ACCOUNT: { background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', color: '#fdba74' },
  ACTIVATE_ACCOUNT: { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' },
  DEACTIVATE_ACCOUNT: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' },
  DELETE_ACCOUNT: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' },
};

interface AuditLogResponse {
  logs: AuditLogEntry[];
  total: number;
  totalPages: number;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  function load(p = 1, q = search) {
    setLoading(true);
    const params: Record<string, unknown> = { page: p, limit: 25 };
    if (q) params['search'] = q;
    api.get<AuditLogResponse>('/audit', { params }).then(r => {
      setLogs(r.data.logs || []);
      setTotal(r.data.total || 0);
      setTotalPages(r.data.totalPages || 1);
      setPage(p);
    }).catch(() => {
      setLogs([]);
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(1); }, []);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#cbd5e1',
    fontSize: 13,
    padding: '7px 12px',
    outline: 'none',
    flex: 1,
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Audit Log</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{total} total entries</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <form onSubmit={e => { e.preventDefault(); load(1); }} className="flex gap-2">
            <input
              style={inputStyle}
              placeholder="Search actions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'rgba(37,99,235,0.8)', border: '1px solid rgba(59,130,246,0.4)' }}
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Action', 'Performed By', 'Details', 'IP Address', 'Date/Time'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm" style={{ color: '#334155' }}>
                    {total === 0 ? 'No audit log entries yet.' : 'No results for this search.'}
                  </td>
                </tr>
              ) : logs.map((log, idx) => (
                <tr
                  key={log._id || idx}
                  style={{
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'; }}
                >
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold" style={ACTION_STYLES[log.action ?? ''] || { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-white">
                    {log.performedBy?.fullName || log.performedBy?.username || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: '#94a3b8' }}>{log.details || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#475569' }}>{log.ipAddress || '—'}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#64748b' }}>{formatDateTime(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-xs" style={{ color: '#475569' }}>Page {page} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => load(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs rounded-lg disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
              >
                ‹ Prev
              </button>
              <button
                onClick={() => load(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs rounded-lg disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
