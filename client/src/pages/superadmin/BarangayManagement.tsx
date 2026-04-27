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

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]';

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Barangay Management</h1>
        <button onClick={() => setShowForm(f => !f)} className="bg-[#003366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002147] transition">
          {showForm ? 'Cancel' : '+ Register Barangay'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Register New Barangay</h2>
          {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PSGC Code</label>
              <input className={inputClass} value={form.psgcCode} onChange={e => setForm(f => ({ ...f, psgcCode: e.target.value }))} placeholder="e.g. 064501001" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select className={inputClass} value={form.provinceDbId} onChange={e => setForm(f => ({ ...f, provinceDbId: e.target.value, municipalityDbId: '' }))} required>
                <option value="">Select Province</option>
                {provinces.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
              <select className={inputClass} value={form.municipalityDbId} onChange={e => setForm(f => ({ ...f, municipalityDbId: e.target.value }))} required disabled={!form.provinceDbId}>
                <option value="">Select Municipality</option>
                {municipalities.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Punong Barangay</label>
              <input className={inputClass} value={form.punongBarangay} onChange={e => setForm(f => ({ ...f, punongBarangay: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barangay Secretary</label>
              <input className={inputClass} value={form.barangaySecretary} onChange={e => setForm(f => ({ ...f, barangaySecretary: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input className={inputClass} value={form.contactNumber} onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <button type="submit" disabled={submitting} className="bg-[#003366] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#002147] transition disabled:opacity-50">
                {submitting ? 'Registering...' : 'Register Barangay'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-[#003366] text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Barangay Name</th>
                <th className="px-4 py-3 text-left">PSGC Code</th>
                <th className="px-4 py-3 text-left">Municipality</th>
                <th className="px-4 py-3 text-left">Province</th>
                <th className="px-4 py-3 text-left">Punong Barangay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {barangays.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No barangays registered yet.</td></tr>
              ) : barangays.map((b, idx) => (
                <tr key={b._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-[#003366]">{b.name}</td>
                  <td className="px-4 py-3 text-gray-500">{b.psgcCode}</td>
                  <td className="px-4 py-3">{b.municipality?.name || '—'}</td>
                  <td className="px-4 py-3">{b.province?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{b.punongBarangay || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}
