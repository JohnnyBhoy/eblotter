import React, { useState } from 'react';
import IncidentForm from './IncidentForm.js';
import ComplainantForm from './ComplainantForm.js';
import RespondentForm from './RespondentForm.js';
import WitnessForm from './WitnessForm.js';
import api from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import axios from 'axios';
import type { BlotterPerson, BlotterWitness } from '../../types/index.js';

const STEPS = ['Incident', 'Complainant', 'Respondents', 'Witnesses & Submit'];

export default function BlotterForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [incident, setIncident] = useState({ type: '', dateOccurred: '', placeOccurred: '', narrative: '' });
  const [complainant, setComplainant] = useState<BlotterPerson>({ lastName: '', firstName: '', address: {} });
  const [respondents, setRespondents] = useState<BlotterPerson[]>([]);
  const [witnesses, setWitnesses] = useState<BlotterWitness[]>([]);
  const [reliefRequested, setReliefRequested] = useState('');
  const [recordedBy, setRecordedBy] = useState({ name: user?.fullName ?? '', position: 'Barangay Official' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateStep(): string | null {
    if (step === 0) {
      if (!incident.type) return 'Incident type is required';
      if (!incident.dateOccurred) return 'Date occurred is required';
      if (!incident.placeOccurred) return 'Place occurred is required';
      if (!incident.narrative) return 'Narrative is required';
    }
    if (step === 1) {
      if (!complainant.lastName) return 'Complainant last name is required';
      if (!complainant.firstName) return 'Complainant first name is required';
    }
    return null;
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setStep(s => s + 1);
  }

  function back() {
    setError(null);
    setStep(s => s - 1);
  }

  async function submit(e: React.MouseEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/blotters', { incident, complainant, respondents, witnesses, reliefRequested, recordedBy, status: 'recorded' });
      navigate('/barangay/blotters');
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Failed to create blotter'
        : 'Failed to create blotter';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const iStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#cbd5e1',
    fontSize: 13,
    padding: '8px 12px',
    outline: 'none',
  };
  const lStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: '#64748b', marginBottom: 5,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i <= step ? 'text-blue-400' : 'text-slate-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                i < step ? 'bg-blue-500 border-blue-500 text-white'
                : i === step ? 'border-blue-400 text-blue-400'
                : 'border-slate-600 text-slate-600'
              }`}>{i + 1}</div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-blue-500' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>{error}</div>
        )}
        {step === 0 && <IncidentForm data={incident} onChange={setIncident} />}
        {step === 1 && <ComplainantForm data={complainant} onChange={setComplainant} />}
        {step === 2 && <RespondentForm data={respondents} onChange={setRespondents} />}
        {step === 3 && (
          <div>
            <WitnessForm data={witnesses} onChange={setWitnesses} />
            <div className="mt-6 space-y-4">
              <div>
                <label style={lStyle}>Relief Requested</label>
                <textarea
                  style={{ ...iStyle, resize: 'vertical' }}
                  rows={3}
                  value={reliefRequested}
                  onChange={e => setReliefRequested(e.target.value)}
                  placeholder="What relief or action does the complainant seek?"
                />
              </div>
              <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 className="text-sm font-semibold text-white mb-3">Recorded By</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={lStyle}>Name</label>
                    <input
                      style={iStyle}
                      value={recordedBy.name}
                      onChange={e => setRecordedBy(r => ({ ...r, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={lStyle}>Position</label>
                    <input
                      style={iStyle}
                      value={recordedBy.position}
                      onChange={e => setRecordedBy(r => ({ ...r, position: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {step > 0 ? (
            <button type="button" onClick={back} className="px-5 py-2 rounded-lg text-sm font-medium transition" style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              ← Back
            </button>
          ) : <div />}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="px-5 py-2 rounded-lg text-white text-sm font-medium transition" style={{ background: 'rgba(37,99,235,0.8)', border: '1px solid rgba(59,130,246,0.4)' }}>
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="px-6 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition"
              style={{ background: 'rgba(37,99,235,0.8)', border: '1px solid rgba(59,130,246,0.4)' }}
            >
              {submitting ? 'Submitting...' : 'Submit Blotter'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
