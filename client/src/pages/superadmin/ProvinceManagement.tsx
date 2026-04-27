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

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Province Management</h1>
        <button onClick={() => setShowForm(f => !f)} className="bg-[#003366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002147] transition">
          {showForm ? 'Cancel' : '+ Register Province'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Register Province via PSGC</h2>
          {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">PSGC Code</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                value={psgcCode}
                onChange={e => setPsgcCode(e.target.value)}
                placeholder="e.g. 064500000"
                required
              />
            </div>
            <button type="submit" disabled={submitting} className="bg-[#003366] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#002147] transition disabled:opacity-50">
              {submitting ? 'Registering...' : 'Register'}
            </button>
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
                <th className="px-4 py-3 text-left">Province Name</th>
                <th className="px-4 py-3 text-left">PSGC Code</th>
                <th className="px-4 py-3 text-left">Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {provinces.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No provinces registered yet.</td></tr>
              ) : provinces.map((p, idx) => (
                <tr key={p._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-[#003366]">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.psgcCode}</td>
                  <td className="px-4 py-3">{p.regionName || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}
