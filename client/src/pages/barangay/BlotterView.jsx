import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import BlotterDetail from '../../components/blotter/BlotterDetail.jsx';
import ExportBar from '../../components/reports/ExportBar.jsx';
import api from '../../utils/api.js';
import { formatStatus } from '../../utils/formatters.js';

const STATUSES = ['draft', 'recorded', 'under_mediation', 'settled', 'referred_to_pnp', 'closed'];

export default function BlotterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blotter, setBlotter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/blotters/${id}`).then(r => setBlotter(r.data)).catch(() => setError('Blotter not found')).finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(status) {
    setUpdating(true);
    try {
      const res = await api.patch(`/blotters/${id}/status`, { status });
      setBlotter(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <PageLayout><div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div></PageLayout>;
  if (error) return <PageLayout><div className="text-red-600 p-4">{error}</div></PageLayout>;

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#003366] hover:text-[#002147] text-sm font-medium">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-[#003366]">Blotter #{blotter?.blotterNumber}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Status:</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              value={blotter?.status || ''}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updating}
            >
              {STATUSES.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
            </select>
          </div>
          <ExportBar blotterId={id} />
        </div>
      </div>
      <BlotterDetail blotter={blotter} />
    </PageLayout>
  );
}
