import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import BlotterDetail from '../../components/blotter/BlotterDetail.js';
import ExportBar from '../../components/reports/ExportBar.js';
import api from '../../utils/api.js';
import type { Blotter } from '../../types/index.js';

export default function MunicipalBlotterView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blotter, setBlotter] = useState<Blotter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Blotter>(`/blotters/${id}`).then(r => setBlotter(r.data)).catch(() => setError('Blotter not found')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLayout><div className="flex items-center justify-center py-20"><div className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" /></div></PageLayout>;
  if (error) return <PageLayout><div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>{error}</div></PageLayout>;

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>← Back</button>
          <h1 className="text-xl font-bold text-white">Blotter #{blotter?.blotterNumber}</h1>
        </div>
        <ExportBar blotterId={id} />
      </div>
      <BlotterDetail blotter={blotter} />
    </PageLayout>
  );
}
