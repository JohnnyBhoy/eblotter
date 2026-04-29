import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import api from '../../utils/api.js';
import axios from 'axios';
import type { GeoDoc } from '../../types/index.js';

interface ProvinceDoc extends GeoDoc {
  regionName?: string;
}

export default function ProvinceManagement() {
  const [provinces, setProvinces] = useState<ProvinceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [psgcCode, setPsgcCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<ProvinceDoc[]>('/geography/provinces').then(r => setProvinces(r.data)).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post<ProvinceDoc>('/geography/provinces', { psgcCode });
      setProvinces(p => [...p, res.data]);
      setShowForm(false);
      setPsgcCode('');
    } catch (err) {
      setError(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Failed to register province' : 'Failed to register province');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#cbd5e1',
    fontSize: 13,
    padding: '8px 12px',
    outline: 'none',
    flex: 1,
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Province Management</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Registered provinces in the system</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={showForm
            ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
            : { background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }
          }
        >
          {showForm ? 'Cancel' : '+ Register Province'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Register Province via PSGC</h2>
          {error && <div className="mb-3 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>{error}</div>}
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div style={{ flex: 1 }}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#475569' }}>PSGC Code</label>
              <input style={inputStyle} value={psgcCode} onChange={e => setPsgcCode(e.target.value)} placeholder="e.g. 064500000" required />
            </div>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}>
              {submitting ? 'Registering…' : 'Register'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Province Name', 'PSGC Code', 'Region'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {provinces.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-sm" style={{ color: '#334155' }}>No provinces registered yet.</td></tr>
              ) : provinces.map((p, idx) => (
                <tr key={p._id}
                  style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'; }}
                >
                  <td className="px-4 py-3 font-semibold text-xs" style={{ color: '#60a5fa' }}>{p.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>{p.psgcCode}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{p.regionName || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}
