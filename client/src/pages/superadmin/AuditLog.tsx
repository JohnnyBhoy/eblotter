import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import { formatDateTime } from '../../utils/formatters.js';
import api from '../../utils/api.js';
import type { AuditLog as AuditLogEntry } from '../../types/index.js';

const ACTION_COLORS: Record<string, string> = {
  CREATE_BLOTTER: 'bg-blue-100 text-blue-700',
  UPDATE_BLOTTER: 'bg-yellow-100 text-yellow-700',
  DELETE_BLOTTER: 'bg-red-100 text-red-700',
  UPDATE_STATUS: 'bg-purple-100 text-purple-700',
  CREATE_ACCOUNT: 'bg-green-100 text-green-700',
  UPDATE_ACCOUNT: 'bg-orange-100 text-orange-700',
  ACTIVATE_ACCOUNT: 'bg-green-100 text-green-700',
  DEACTIVATE_ACCOUNT: 'bg-red-100 text-red-700',
  DELETE_ACCOUNT: 'bg-red-100 text-red-700',
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

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Audit Log</h1>
        <span className="text-sm text-gray-500">{total} total entries</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={e => { e.preventDefault(); load(1); }} className="flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              placeholder="Search actions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="px-4 py-1.5 bg-[#003366] text-white rounded-lg text-sm">Search</button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performed By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    {total === 0 ? 'No audit log entries yet.' : 'No results for this search.'}
                  </td>
                </tr>
              ) : logs.map((log, idx) => (
                <tr key={log._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${ACTION_COLORS[log.action ?? ''] || 'bg-gray-100 text-gray-700'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {log.performedBy?.fullName || log.performedBy?.username || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{log.details || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{log.ipAddress || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{formatDateTime(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => load(page - 1)} disabled={page <= 1} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">‹ Prev</button>
              <button onClick={() => load(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">Next ›</button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
