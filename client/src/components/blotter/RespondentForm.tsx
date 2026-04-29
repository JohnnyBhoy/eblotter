import React from 'react';
import type { BlotterPerson, BlotterAddress } from '../../types/index.js';

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
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; };
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; };

type RespondentData = BlotterPerson & { address?: BlotterAddress };

const emptyRespondent = (): RespondentData => ({
  lastName: '', firstName: '', middleName: '',
  sex: '', age: undefined,
  address: { barangay: '', municipality: '', province: 'Antique' },
  contactNumber: '', relationshipToComplainant: '', isKnown: true
});

interface RespondentFormProps {
  data: RespondentData[];
  onChange: (data: RespondentData[]) => void;
}

export default function RespondentForm({ data = [], onChange }: RespondentFormProps) {
  function add() { onChange([...data, emptyRespondent()]); }
  function remove(idx: number) { onChange(data.filter((_, i) => i !== idx)); }
  function update(idx: number, field: string, value: unknown) {
    const updated = [...data];
    updated[idx] = { ...updated[idx]!, [field]: value };
    onChange(updated);
  }
  function updateAddress(idx: number, field: string, value: string) {
    const updated = [...data];
    updated[idx] = { ...updated[idx]!, address: { ...(updated[idx]!.address ?? {}), [field]: value } };
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#f59e0b,#d97706)' }} />
          <h3 className="text-sm font-bold text-white">Respondents</h3>
        </div>
        <button
          type="button"
          onClick={add}
          className="text-xs px-3 py-1.5 rounded-xl font-semibold text-white"
          style={{ background: 'rgba(37,99,235,0.7)', border: '1px solid rgba(59,130,246,0.4)' }}
        >
          + Add Respondent
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-xs italic" style={{ color: '#475569' }}>No respondents added yet. Click "Add Respondent" to add one.</p>
      )}

      {data.map((r, idx) => (
        <div
          key={idx}
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Respondent #{idx + 1}</span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              Remove
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id={`known-${idx}`} checked={r.isKnown !== false} onChange={e => update(idx, 'isKnown', e.target.checked)} style={{ accentColor: '#3b82f6' }} />
            <label htmlFor={`known-${idx}`} className="text-xs" style={{ color: '#94a3b8' }}>Identity known</label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label style={lStyle}>Last Name</label><input style={iStyle} value={r.lastName || ''} onChange={e => update(idx, 'lastName', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={lStyle}>First Name</label><input style={iStyle} value={r.firstName || ''} onChange={e => update(idx, 'firstName', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={lStyle}>Middle Name</label><input style={iStyle} value={r.middleName || ''} onChange={e => update(idx, 'middleName', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label style={lStyle}>Sex</label>
              <select style={{ ...iStyle, cursor: 'pointer' }} value={r.sex || ''} onChange={e => update(idx, 'sex', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                <option value="" style={{ background: '#0a1628' }}>Select</option>
                {['Male', 'Female', 'Other'].map(s => <option key={s} style={{ background: '#0a1628' }}>{s}</option>)}
              </select>
            </div>
            <div><label style={lStyle}>Age</label><input type="number" style={iStyle} value={r.age ?? ''} onChange={e => update(idx, 'age', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={lStyle}>Contact Number</label><input style={iStyle} value={r.contactNumber || ''} onChange={e => update(idx, 'contactNumber', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          </div>
          <div><label style={lStyle}>Relationship to Complainant</label><input style={iStyle} value={r.relationshipToComplainant || ''} onChange={e => update(idx, 'relationshipToComplainant', e.target.value)} placeholder="Neighbor, Relative, etc." onFocus={onFocus} onBlur={onBlur} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label style={lStyle}>Barangay</label><input style={iStyle} value={r.address?.barangay || ''} onChange={e => updateAddress(idx, 'barangay', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={lStyle}>Municipality</label><input style={iStyle} value={r.address?.municipality || ''} onChange={e => updateAddress(idx, 'municipality', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={lStyle}>Province</label><input style={iStyle} value={r.address?.province || 'Antique'} onChange={e => updateAddress(idx, 'province', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
