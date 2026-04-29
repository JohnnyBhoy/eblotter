import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import api from '../../utils/api.js';
import axios from 'axios';
import type { GeoDoc, UserRole } from '../../types/index.js';

type ScopeRole = 'barangay' | 'municipal' | 'provincial';

interface ScopeId {
  provinceId: string;
  municipalityId: string;
  barangayId: string;
}

interface AccountForm {
  fullName: string;
  username: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  position: string;
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#cbd5e1',
  fontSize: 13,
  padding: '9px 12px',
  outline: 'none',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#475569',
  marginBottom: 6,
};

export default function AddAccount() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<ScopeRole>('barangay');
  const [provinces, setProvinces] = useState<GeoDoc[]>([]);
  const [municipalities, setMunicipalities] = useState<GeoDoc[]>([]);
  const [barangays, setBarangays] = useState<GeoDoc[]>([]);
  const [scopeId, setScopeId] = useState<ScopeId>({ provinceId: '', municipalityId: '', barangayId: '' });
  const [form, setForm] = useState<AccountForm>({ fullName: '', username: '', email: '', contactNumber: '', password: '', confirmPassword: '', position: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<GeoDoc[]>('/geography/provinces').then(r => setProvinces(r.data));
  }, []);

  useEffect(() => {
    if (scopeId.provinceId) {
      api.get<GeoDoc[]>('/geography/municipalities', { params: { provinceId: scopeId.provinceId } }).then(r => setMunicipalities(r.data));
    }
  }, [scopeId.provinceId]);

  useEffect(() => {
    if (scopeId.municipalityId) {
      api.get<GeoDoc[]>('/geography/barangays', { params: { municipalityId: scopeId.municipalityId } }).then(r => setBarangays(r.data));
    }
  }, [scopeId.municipalityId]);

  async function submit(e: React.FormEvent) {
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
        municipalityId: (['municipal', 'barangay'] as ScopeRole[]).includes(role) ? scopeId.municipalityId : undefined,
        provinceId: scopeId.provinceId
      });
      navigate('/superadmin/accounts');
    } catch (err) {
      setError(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Failed to create account' : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  const STEPS = ['Select Role & Scope', 'Account Details'];

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Add New Account</h1>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Create a new system user</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={i < step
                  ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7' }
                  : i === step
                    ? { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.5)', color: '#93c5fd' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#475569' }
                }
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium" style={{ color: i <= step ? '#cbd5e1' : '#475569' }}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-6 h-px mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>{error}</div>}

        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {step === 0 ? (
            <div className="space-y-4">
              <div>
                <label style={labelStyle}>Account Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['barangay', 'municipal', 'provincial'] as ScopeRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setRole(r); setScopeId({ provinceId: '', municipalityId: '', barangayId: '' }); }}
                      className="py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all"
                      style={role === r
                        ? { background: 'rgba(37,99,235,0.8)', border: '1px solid rgba(59,130,246,0.5)', color: '#fff', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }
                      }
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Province</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={scopeId.provinceId} onChange={e => setScopeId(s => ({ ...s, provinceId: e.target.value, municipalityId: '', barangayId: '' }))}>
                  <option value="" style={{ background: '#0a1628' }}>Select Province</option>
                  {provinces.map(p => <option key={p._id} value={p._id} style={{ background: '#0a1628' }}>{p.name}</option>)}
                </select>
              </div>
              {(role === 'municipal' || role === 'barangay') && (
                <div>
                  <label style={labelStyle}>Municipality</label>
                  <select style={{ ...inputStyle, cursor: 'pointer', opacity: !scopeId.provinceId ? 0.5 : 1 }} value={scopeId.municipalityId} onChange={e => setScopeId(s => ({ ...s, municipalityId: e.target.value, barangayId: '' }))} disabled={!scopeId.provinceId}>
                    <option value="" style={{ background: '#0a1628' }}>Select Municipality</option>
                    {municipalities.map(m => <option key={m._id} value={m._id} style={{ background: '#0a1628' }}>{m.name}</option>)}
                  </select>
                </div>
              )}
              {role === 'barangay' && (
                <div>
                  <label style={labelStyle}>Barangay</label>
                  <select style={{ ...inputStyle, cursor: 'pointer', opacity: !scopeId.municipalityId ? 0.5 : 1 }} value={scopeId.barangayId} onChange={e => setScopeId(s => ({ ...s, barangayId: e.target.value }))} disabled={!scopeId.municipalityId}>
                    <option value="" style={{ background: '#0a1628' }}>Select Barangay</option>
                    {barangays.map(b => <option key={b._id} value={b._id} style={{ background: '#0a1628' }}>{b.name}</option>)}
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
                className="w-full mt-2 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}
              >
                Next →
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name *', key: 'fullName', type: 'text', required: true },
                  { label: 'Username *', key: 'username', type: 'text', required: true },
                  { label: 'Email', key: 'email', type: 'email', required: false },
                  { label: 'Contact Number', key: 'contactNumber', type: 'text', required: false },
                  { label: 'Position / Designation', key: 'position', type: 'text', required: false },
                  { label: 'Password *', key: 'password', type: 'password', required: true },
                ].map(({ label, key, type, required }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type={type}
                      style={inputStyle}
                      value={form[key as keyof AccountForm]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      required={required}
                      minLength={key === 'password' ? 8 : undefined}
                      onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label style={labelStyle}>Confirm Password *</label>
                  <input
                    type="password"
                    style={inputStyle}
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    required
                    onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', background: 'transparent' }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}
                >
                  {loading ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
