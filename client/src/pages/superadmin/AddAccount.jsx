import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import api from '../../utils/api.js';

export default function AddAccount() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('barangay');
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [scopeId, setScopeId] = useState({ provinceId: '', municipalityId: '', barangayId: '' });
  const [form, setForm] = useState({ fullName: '', username: '', email: '', contactNumber: '', password: '', confirmPassword: '', position: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/geography/provinces').then(r => setProvinces(r.data));
  }, []);

  useEffect(() => {
    if (scopeId.provinceId) {
      api.get('/geography/municipalities', { params: { provinceId: scopeId.provinceId } }).then(r => setMunicipalities(r.data));
    }
  }, [scopeId.provinceId]);

  useEffect(() => {
    if (scopeId.municipalityId) {
      api.get('/geography/barangays', { params: { municipalityId: scopeId.municipalityId } }).then(r => setBarangays(r.data));
    }
  }, [scopeId.municipalityId]);

  async function submit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/users', {
        ...form,
        role,
        barangayId: role === 'barangay' ? scopeId.barangayId : undefined,
        municipalityId: ['municipal', 'barangay'].includes(role) ? scopeId.municipalityId : undefined,
        provinceId: scopeId.provinceId
      });
      navigate('/superadmin/accounts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-[#003366] text-sm font-medium">← Back</button>
          <h1 className="text-2xl font-bold text-[#003366]">Add New Account</h1>
        </div>

        <div className="flex gap-3 mb-6">
          {['Select Role & Scope', 'Account Details'].map((s, i) => (
            <div key={s} className={`flex items-center gap-2 ${i <= step ? 'text-[#003366]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                i < step ? 'bg-[#003366] border-[#003366] text-white' : i === step ? 'border-[#003366] text-[#003366]' : 'border-gray-300'
              }`}>{i + 1}</div>
              <span className="text-sm">{s}</span>
              {i < 1 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {step === 0 ? (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Account Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {['barangay', 'municipal', 'provincial'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setRole(r); setScopeId({ provinceId: '', municipalityId: '', barangayId: '' }); }}
                      className={`py-2 px-4 rounded-lg border-2 text-sm font-medium capitalize transition ${
                        role === r ? 'border-[#003366] bg-[#003366] text-white' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Province</label>
                <select className={inputClass} value={scopeId.provinceId} onChange={e => setScopeId(s => ({ ...s, provinceId: e.target.value, municipalityId: '', barangayId: '' }))}>
                  <option value="">Select Province</option>
                  {provinces.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              {(role === 'municipal' || role === 'barangay') && (
                <div>
                  <label className={labelClass}>Municipality</label>
                  <select className={inputClass} value={scopeId.municipalityId} onChange={e => setScopeId(s => ({ ...s, municipalityId: e.target.value, barangayId: '' }))} disabled={!scopeId.provinceId}>
                    <option value="">Select Municipality</option>
                    {municipalities.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </div>
              )}
              {role === 'barangay' && (
                <div>
                  <label className={labelClass}>Barangay</label>
                  <select className={inputClass} value={scopeId.barangayId} onChange={e => setScopeId(s => ({ ...s, barangayId: e.target.value }))} disabled={!scopeId.municipalityId}>
                    <option value="">Select Barangay</option>
                    {barangays.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!scopeId.provinceId) { setError('Please select a province'); return; }
                  if ((role === 'municipal' || role === 'barangay') && !scopeId.municipalityId) { setError('Please select a municipality'); return; }
                  if (role === 'barangay' && !scopeId.barangayId) { setError('Please select a barangay'); return; }
                  setError('');
                  setStep(1);
                }}
                className="w-full mt-2 bg-[#003366] text-white py-2.5 rounded-lg font-semibold hover:bg-[#002147] transition"
              >
                Next →
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input className={inputClass} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
                </div>
                <div>
                  <label className={labelClass}>Username *</label>
                  <input className={inputClass} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" className={inputClass} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <input className={inputClass} value={form.contactNumber} onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Position / Designation</label>
                  <input className={inputClass} value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} placeholder="e.g. Barangay Secretary" />
                </div>
                <div>
                  <label className={labelClass}>Password *</label>
                  <input type="password" className={inputClass} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Confirm Password *</label>
                  <input type="password" className={inputClass} value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(0)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">← Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#003366] text-white py-2.5 rounded-lg font-semibold hover:bg-[#002147] transition disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
