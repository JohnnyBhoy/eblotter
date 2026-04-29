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
  color: '#475569', marginBottom: 5,
};
const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = 'rgba(59,130,246,0.5)';
  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.08)';
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
  e.target.style.boxShadow = 'none';
};

export default function IncidentForm({ data, onChange }: IncidentFormProps) {
  function update(field: string, value: unknown) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#3b82f6,#1d4ed8)' }} />
        <h3 className="text-sm font-bold text-white">Incident Information</h3>
      </div>
      <div>
        <label style={lStyle}>Incident Type *</label>
        <select style={{ ...iStyle, cursor: 'pointer' }} value={data.type || ''} onChange={e => update('type', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} required>
          <option value="" style={{ background: '#0a1628' }}>Select incident type</option>
          {INCIDENT_TYPES.map(t => <option key={t} value={t} style={{ background: '#0a1628' }}>{t}</option>)}
        </select>
      </div>
      {data.type === 'Other' && (
        <div>
          <label style={lStyle}>Specify Other Type *</label>
          <input style={iStyle} value={data.otherType || ''} onChange={e => update('otherType', e.target.value)} placeholder="Specify incident type" onFocus={focusStyle} onBlur={blurStyle} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={lStyle}>Date Occurred *</label>
          <input type="date" style={{ ...iStyle, colorScheme: 'dark' }} value={data.dateOccurred || ''} onChange={e => update('dateOccurred', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} required />
        </div>
        <div>
          <label style={lStyle}>Time Occurred</label>
          <input type="time" style={{ ...iStyle, colorScheme: 'dark' }} value={data.timeOccurred || ''} onChange={e => update('timeOccurred', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
        </div>
      </div>
      <div>
        <label style={lStyle}>Place Occurred *</label>
        <input style={iStyle} value={data.placeOccurred || ''} onChange={e => update('placeOccurred', e.target.value)} placeholder="Exact location of incident" onFocus={focusStyle} onBlur={blurStyle} required />
      </div>
      <div>
        <label style={lStyle}>Narrative *</label>
        <textarea style={{ ...iStyle, resize: 'vertical' }} rows={5} value={data.narrative || ''} onChange={e => update('narrative', e.target.value)} placeholder="Detailed account of what happened..." onFocus={focusStyle} onBlur={blurStyle} required />
      </div>
      <div>
        <label style={lStyle}>Motive</label>
        <input style={iStyle} value={data.motive || ''} onChange={e => update('motive', e.target.value)} placeholder="Alleged motive (if known)" onFocus={focusStyle} onBlur={blurStyle} />
      </div>
      <div>
        <label style={lStyle}>Weapon or Object Used</label>
        <input style={iStyle} value={data.weaponOrObjectUsed || ''} onChange={e => update('weaponOrObjectUsed', e.target.value)} placeholder="e.g. fist, bladed weapon, none" onFocus={focusStyle} onBlur={blurStyle} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isReferred" checked={data.isReferred || false} onChange={e => update('isReferred', e.target.checked)}
          className="rounded" style={{ accentColor: '#3b82f6' }} />
        <label htmlFor="isReferred" className="text-sm" style={{ color: '#94a3b8' }}>Referred to higher authority</label>
      </div>
      {data.isReferred && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={lStyle}>Referred To</label>
            <input style={iStyle} value={data.referredTo || ''} onChange={e => update('referredTo', e.target.value)} placeholder="Office or agency" onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <div>
            <label style={lStyle}>Referral Date</label>
            <input type="date" style={{ ...iStyle, colorScheme: 'dark' }} value={data.referredDate || ''} onChange={e => update('referredDate', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
        </div>
      )}
    </div>
  );
}
