import React from 'react';

const INCIDENT_TYPES = [
  'Physical Injury', 'Theft', 'Robbery', 'Estafa / Fraud',
  'Threat / Intimidation', 'Unjust Vexation', 'Trespassing',
  'Oral Defamation / Slander', 'Domestic Violence',
  'Drug-Related Incident', 'Noise Disturbance',
  'Property Damage', 'Missing Person', 'Other'
];

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

interface IncidentFormProps {
  data: IncidentData;
  onChange: (data: IncidentData) => void;
}

export default function IncidentForm({ data, onChange }: IncidentFormProps) {
  function update(field: string, value: unknown) {
    onChange({ ...data, [field]: value });
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#003366]">Incident Information</h3>
      <div>
        <label className={labelClass}>Incident Type *</label>
        <select className={inputClass} value={data.type || ''} onChange={e => update('type', e.target.value)} required>
          <option value="">Select incident type</option>
          {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {data.type === 'Other' && (
        <div>
          <label className={labelClass}>Specify Other Type *</label>
          <input className={inputClass} value={data.otherType || ''} onChange={e => update('otherType', e.target.value)} placeholder="Specify incident type" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date Occurred *</label>
          <input type="date" className={inputClass} value={data.dateOccurred || ''} onChange={e => update('dateOccurred', e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Time Occurred</label>
          <input type="time" className={inputClass} value={data.timeOccurred || ''} onChange={e => update('timeOccurred', e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Place Occurred *</label>
        <input className={inputClass} value={data.placeOccurred || ''} onChange={e => update('placeOccurred', e.target.value)} placeholder="Exact location of incident" required />
      </div>
      <div>
        <label className={labelClass}>Narrative *</label>
        <textarea className={inputClass} rows={5} value={data.narrative || ''} onChange={e => update('narrative', e.target.value)} placeholder="Detailed account of what happened..." required />
      </div>
      <div>
        <label className={labelClass}>Motive</label>
        <input className={inputClass} value={data.motive || ''} onChange={e => update('motive', e.target.value)} placeholder="Alleged motive (if known)" />
      </div>
      <div>
        <label className={labelClass}>Weapon or Object Used</label>
        <input className={inputClass} value={data.weaponOrObjectUsed || ''} onChange={e => update('weaponOrObjectUsed', e.target.value)} placeholder="e.g. fist, bladed weapon, none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isReferred" checked={data.isReferred || false} onChange={e => update('isReferred', e.target.checked)} className="rounded" />
        <label htmlFor="isReferred" className="text-sm text-gray-700">Referred to higher authority</label>
      </div>
      {data.isReferred && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Referred To</label>
            <input className={inputClass} value={data.referredTo || ''} onChange={e => update('referredTo', e.target.value)} placeholder="Office or agency" />
          </div>
          <div>
            <label className={labelClass}>Referral Date</label>
            <input type="date" className={inputClass} value={data.referredDate || ''} onChange={e => update('referredDate', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}
