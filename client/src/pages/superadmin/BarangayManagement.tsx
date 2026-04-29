import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import api from '../../utils/api.js';
import axios from 'axios';
import type { GeoDoc } from '../../types/index.js';

interface BarangayDoc extends GeoDoc {
  municipality?: GeoDoc;
  province?: GeoDoc;
  punongBarangay?: string;
  barangaySecretary?: string;
  contactNumber?: string;
}

interface BarangayForm {
  psgcCode: string;
  municipalityDbId: string;
  provinceDbId: string;
  punongBarangay: string;
  barangaySecretary: string;
  contactNumber: string;
}

export default function BarangayManagement() {
  const [barangays, setBarangays] = useState<BarangayDoc[]>([]);
  const [provinces, setProvinces] = useState<GeoDoc[]>([]);
  const [municipalities, setMunicipalities] = useState<GeoDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BarangayForm>({ psgcCode: '', municipalityDbId: '', provinceDbId: '', punongBarangay: '', barangaySecretary: '', contactNumber: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<BarangayDoc[]>('/geography/barangays').then(r => r.data),
      api.get<GeoDoc[]>('/geography/provinces').then(r => r.data),
    ]).then(([brgys, provs]) => {
      setBarangays(brgys);
      setProvinces(provs);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (form.provinceDbId) {
      api.get<GeoDoc[]>('/geography/municipalities', { params: { provinceId: form.provinceDbId } }).then(r => setMunicipalities(r.data));
    }
  }, [form.provinceDbId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post<BarangayDoc>('/geography/barangays', form);
      setBarangays(b => [...b, res.data]);
      setShowForm(false);
      setForm({ psgcCode: '', municipalityDbId: '', provinceDbId: '', punongBarangay: '', barangaySecretary: '', contactNumber: '' });
    } catch (err) {
      setError(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Failed to register barangay' : 'Failed to register barangay');
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
          <h1 className="text-xl font-bold text-white">Barangay Management</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Registered barangays in the system</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={showForm
            ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
            : { background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }
          }
        >
          {showForm ? 'Cancel' : '+ Register Barangay'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Register New Barangay</h2>
          {error && <div className="mb-3 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>PSGC Code</label>
              <input style={inputStyle} value={form.psgcCode} onChange={e => setForm(f => ({ ...f, psgcCode: e.target.value }))} placeholder="e.g. 064501001" required />
            </div>
            <div>
              <label style={labelStyle}>Province</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.provinceDbId} onChange={e => setForm(f => ({ ...f, provinceDbId: e.target.value, municipalityDbId: '' }))} required>
                <option value="" style={{ background: '#0a1628' }}>Select Province</option>
                {provinces.map(p => <option key={p._id} value={p._id} style={{ background: '#0a1628' }}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Municipality</label>
              <select style={{ ...inputStyle, cursor: 'pointer', opacity: !form.provinceDbId ? 0.5 : 1 }} value={form.municipalityDbId} onChange={e => setForm(f => ({ ...f, municipalityDbId: e.target.value }))} required disabled={!form.provinceDbId}>
                <option value="" style={{ background: '#0a1628' }}>Select Municipality</option>
                {municipalities.map(m => <option key={m._id} value={m._id} style={{ background: '#0a1628' }}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Punong Barangay</label>
              <input style={inputStyle} value={form.punongBarangay} onChange={e => setForm(f => ({ ...f, punongBarangay: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Barangay Secretary</label>
              <input style={inputStyle} value={form.barangaySecretary} onChange={e => setForm(f => ({ ...f, barangaySecretary: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Contact Number</label>
              <input style={inputStyle} value={form.contactNumber} onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}
              >
                {submitting ? 'Registering…' : 'Register Barangay'}
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
                {['Barangay Name', 'PSGC Code', 'Municipality', 'Province', 'Punong Barangay'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {barangays.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: '#334155' }}>No barangays registered yet.</td></tr>
              ) : barangays.map((b, idx) => (
                <tr
                  key={b._id}
                  style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'; }}
                >
                  <td className="px-4 py-3 font-semibold text-xs" style={{ color: '#60a5fa' }}>{b.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>{b.psgcCode}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{b.municipality?.name || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{b.province?.name || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>{b.punongBarangay || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}
