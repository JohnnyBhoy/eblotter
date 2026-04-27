import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import IncidentForm from '../../components/blotter/IncidentForm.js';
import ComplainantForm from '../../components/blotter/ComplainantForm.js';
import RespondentForm from '../../components/blotter/RespondentForm.js';
import WitnessForm from '../../components/blotter/WitnessForm.js';
import api from '../../utils/api.js';
import axios from 'axios';
import type { Blotter, BlotterPerson, BlotterWitness } from '../../types/index.js';

const STEPS = ['Incident', 'Complainant', 'Respondents', 'Witnesses & Submit'];

interface IncidentData {
  type: string;
  otherType?: string;
  dateOccurred: string;
  timeOccurred?: string;
  placeOccurred: string;
  narrative: string;
  motive?: string;
  weaponOrObjectUsed?: string;
  isReferred?: boolean;
  referredTo?: string;
  referredDate?: string;
}

export default function EditBlotter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [incident, setIncident] = useState<IncidentData>({ type: '', dateOccurred: '', placeOccurred: '', narrative: '' });
  const [complainant, setComplainant] = useState<BlotterPerson>({ lastName: '', firstName: '', address: {} });
  const [respondents, setRespondents] = useState<BlotterPerson[]>([]);
  const [witnesses, setWitnesses] = useState<BlotterWitness[]>([]);
  const [reliefRequested, setReliefRequested] = useState('');
  const [recordedBy, setRecordedBy] = useState({ name: '', position: 'Barangay Official' });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Blotter>(`/blotters/${id}`)
      .then(r => {
        const b = r.data;
        setIncident({
          type: b.incident?.type ?? '',
          otherType: b.incident?.otherType,
          dateOccurred: b.incident?.dateOccurred
            ? new Date(b.incident.dateOccurred).toISOString().split('T')[0]
            : '',
          timeOccurred: b.incident?.timeOccurred,
          placeOccurred: b.incident?.placeOccurred ?? '',
          narrative: b.incident?.narrative ?? '',
          motive: b.incident?.motive,
          weaponOrObjectUsed: b.incident?.weaponOrObjectUsed,
          isReferred: b.incident?.isReferred,
          referredTo: b.incident?.referredTo,
          referredDate: b.incident?.referredDate
            ? new Date(b.incident.referredDate).toISOString().split('T')[0]
            : undefined,
        });
        setComplainant(b.complainant ?? { lastName: '', firstName: '', address: {} });
        setRespondents(b.respondents ?? []);
        setWitnesses(b.witnesses ?? []);
        setReliefRequested(b.reliefRequested ?? '');
        setRecordedBy({
          name: b.recordedBy?.name ?? '',
          position: b.recordedBy?.position ?? 'Barangay Official',
        });
      })
      .catch(() => setLoadError('Could not load blotter for editing.'))
      .finally(() => setLoadingData(false));
  }, [id]);

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
      await api.put(`/blotters/${id}`, {
        incident,
        complainant,
        respondents,
        witnesses,
        reliefRequested,
        recordedBy,
      });
      navigate(`/barangay/blotters/${id}`);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ?? 'Failed to update blotter'
          : 'Failed to update blotter'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <PageLayout>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (loadError) {
    return (
      <PageLayout>
        <div className="text-red-600 p-4">{loadError}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-[#003366] text-sm font-medium">← Back</button>
        <h1 className="text-2xl font-bold text-[#003366]">Edit Blotter</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-[#003366]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  i < step ? 'bg-[#003366] border-[#003366] text-white'
                  : i === step ? 'border-[#003366] text-[#003366]'
                  : 'border-gray-300 text-gray-400'
                }`}>{i + 1}</div>
                <span className="text-sm font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-[#003366]' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          {step === 0 && <IncidentForm data={incident} onChange={setIncident} />}
          {step === 1 && <ComplainantForm data={complainant} onChange={setComplainant} />}
          {step === 2 && <RespondentForm data={respondents} onChange={setRespondents} />}
          {step === 3 && (
            <div>
              <WitnessForm data={witnesses} onChange={setWitnesses} />
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relief Requested</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    rows={3}
                    value={reliefRequested}
                    onChange={e => setReliefRequested(e.target.value)}
                    placeholder="What relief or action does the complainant seek?"
                  />
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Recorded By</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                        value={recordedBy.name}
                        onChange={e => setRecordedBy(r => ({ ...r, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                        value={recordedBy.position}
                        onChange={e => setRecordedBy(r => ({ ...r, position: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            {step > 0 ? (
              <button type="button" onClick={back} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm">
                ← Back
              </button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="px-5 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002147] transition text-sm">
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002147] transition text-sm disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
