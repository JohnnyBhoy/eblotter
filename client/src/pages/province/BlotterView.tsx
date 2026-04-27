import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import BlotterDetail from '../../components/blotter/BlotterDetail.js';
import ExportBar from '../../components/reports/ExportBar.js';
import api from '../../utils/api.js';
import type { Blotter } from '../../types/index.js';

export default function ProvinceBlotterView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blotter, setBlotter] = useState<Blotter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Blotter>(`/blotters/${id}`).then(r => setBlotter(r.data)).catch(() => setError('Blotter not found')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLayout><div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div></PageLayout>;
  if (error) return <PageLayout><div className="text-red-600 p-4">{error}</div></PageLayout>;

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#003366] text-sm font-medium">← Back</button>
          <h1 className="text-2xl font-bold text-[#003366]">Blotter #{blotter?.blotterNumber}</h1>
        </div>
        <ExportBar blotterId={id} />
      </div>
      <BlotterDetail blotter={blotter} />
    </PageLayout>
  );
}
