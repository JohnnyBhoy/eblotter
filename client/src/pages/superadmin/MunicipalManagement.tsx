import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import api from '../../utils/api.js';
import axios from 'axios';
import type { GeoDoc } from '../../types/index.js';

interface MunicipalityDoc extends GeoDoc {
  province?: GeoDoc;
}

interface MunicipalForm {
  psgcCode: string;
  provinceDbId: string;
}

export default function MunicipalManagement() {
  const [municipalities, setMunicipalities] = useState<MunicipalityDoc[]>([]);
  const [provinces, setProvinces] = useState<GeoDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MunicipalForm>({ psgcCode: '', provinceDbId: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<MunicipalityDoc[]>('/geography/municipalities').then(r => r.data),
      api.get<GeoDoc[]>('/geography/provinces').then(r => r.data),
    ]).then(([muns, provs]) => {
      setMunicipalities(muns);
      setProvinces(provs);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post<MunicipalityDoc>('/geography/municipalities', form);
      setMunicipalities(m => [...m, res.data]);
      setShowForm(false);
      setForm({ psgcCode: '', provinceDbId: '' });
    } catch (err) {
      setError(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Failed to register municipality' : 'Failed to register municipality');
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
    width: '100%',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: 6 };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Municipality Management</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Registered municipalities in the system</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={showForm
            ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
            : { background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }
          }
        >
          {showForm ? 'Cancel' : '+ Register Municipality'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Register New Municipality</h2>
          {error && <div className="mb-3 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>PSGC Code</label>
              <input style={inputStyle} value={form.psgcCode} onChange={e => setForm(f => ({ ...f, psgcCode: e.target.value }))} placeholder="e.g. 064501000" required />
            </div>
            <div>
              <label style={labelStyle}>Province</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.provinceDbId} onChange={e => setForm(f => ({ ...f, provinceDbId: e.target.value }))} required>
                <option value="" style={{ background: '#0a1628' }}>Select Province</option>
                {provinces.map(p => <option key={p._id} value={p._id} style={{ background: '#0a1628' }}>{p.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}>
                {submitting ? 'Registering…' : 'Register Municipality'}
              </button>
            </div>
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
                {['Municipality Name', 'PSGC Code', 'Province'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {municipalities.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-sm" style={{ color: '#334155' }}>No municipalities registered yet.</td></tr>
              ) : municipalities.map((m, idx) => (
                <tr key={m._id}
                  style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'; }}
                >
                  <td className="px-4 py-3 font-semibold text-xs" style={{ color: '#60a5fa' }}>{m.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>{m.psgcCode}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{m.province?.name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}
