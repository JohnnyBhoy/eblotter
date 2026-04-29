import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import BlotterDetail from '../../components/blotter/BlotterDetail.js';
import ExportBar from '../../components/reports/ExportBar.js';
import api from '../../utils/api.js';
import { formatStatus } from '../../utils/formatters.js';
import axios from 'axios';
import type { Blotter, BlotterStatus } from '../../types/index.js';

const STATUSES: BlotterStatus[] = ['draft', 'recorded', 'under_mediation', 'settled', 'referred_to_pnp', 'closed'];

export default function BlotterView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blotter, setBlotter] = useState<Blotter | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Blotter>(`/blotters/${id}`)
      .then(r => setBlotter(r.data))
      .catch(() => setError('Blotter not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(status: string) {
    setUpdating(true);
    try {
      const res = await api.patch<Blotter>(`/blotters/${id}/status`, { status });
      setBlotter(res.data);
    } catch (err) {
      setError(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Failed to update status' : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return (
    <PageLayout>
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <span className="text-sm" style={{ color: '#475569' }}>Loading blotter…</span>
        </div>
      </div>
    </PageLayout>
  );

  if (error) return (
    <PageLayout>
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        {error}
      </div>
    </PageLayout>
  );

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-white">Blotter #{blotter?.blotterNumber}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>Status:</label>
            <select
              value={blotter?.status || ''}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updating}
              className="text-xs rounded-xl px-3 py-1.5 disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {STATUSES.map(s => <option key={s} value={s} style={{ background: '#0a1628' }}>{formatStatus(s)}</option>)}
            </select>
          </div>
          <Link
            to={`/barangay/blotters/${id}/edit`}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            Edit
          </Link>
          <ExportBar blotterId={id} />
        </div>
      </div>
      <BlotterDetail blotter={blotter} />
    </PageLayout>
  );
}
