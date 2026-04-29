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
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = 'rgba(59,130,246,0.5)';
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
};

interface ComplainantFormProps {
  data: BlotterPerson & { address?: BlotterAddress };
  onChange: (data: BlotterPerson) => void;
}

export default function ComplainantForm({ data, onChange }: ComplainantFormProps) {
  function update(field: string, value: unknown) {
    onChange({ ...data, [field]: value } as BlotterPerson);
  }
  function updateAddress(field: string, value: string) {
    onChange({ ...data, address: { ...(data.address ?? {}), [field]: value } } as BlotterPerson);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#10b981,#059669)' }} />
        <h3 className="text-sm font-bold text-white">Complainant Information</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div><label style={lStyle}>Last Name *</label><input style={iStyle} value={data.lastName || ''} onChange={e => update('lastName', e.target.value)} placeholder="Dela Cruz" required onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={lStyle}>First Name *</label><input style={iStyle} value={data.firstName || ''} onChange={e => update('firstName', e.target.value)} placeholder="Juan" required onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={lStyle}>Middle Name</label><input style={iStyle} value={data.middleName || ''} onChange={e => update('middleName', e.target.value)} placeholder="Santos" onFocus={onFocus} onBlur={onBlur} /></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div><label style={lStyle}>Suffix</label><input style={iStyle} value={data.suffix || ''} onChange={e => update('suffix', e.target.value)} placeholder="Jr., Sr., III" onFocus={onFocus} onBlur={onBlur} /></div>
        <div>
          <label style={lStyle}>Sex</label>
          <select style={{ ...iStyle, cursor: 'pointer' }} value={data.sex || ''} onChange={e => update('sex', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
            <option value="" style={{ background: '#0a1628' }}>Select</option>
            {['Male', 'Female', 'Other'].map(s => <option key={s} style={{ background: '#0a1628' }}>{s}</option>)}
          </select>
        </div>
        <div><label style={lStyle}>Birth Date</label><input type="date" style={{ ...iStyle, colorScheme: 'dark' }} value={data.birthDate || ''} onChange={e => update('birthDate', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div><label style={lStyle}>Age</label><input type="number" style={iStyle} value={data.age ?? ''} onChange={e => update('age', e.target.value)} placeholder="25" onFocus={onFocus} onBlur={onBlur} /></div>
        <div>
          <label style={lStyle}>Civil Status</label>
          <select style={{ ...iStyle, cursor: 'pointer' }} value={data.civilStatus || ''} onChange={e => update('civilStatus', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
            <option value="" style={{ background: '#0a1628' }}>Select</option>
            {['Single', 'Married', 'Widowed', 'Separated', 'Annulled'].map(s => <option key={s} style={{ background: '#0a1628' }}>{s}</option>)}
          </select>
        </div>
        <div><label style={lStyle}>Nationality</label><input style={iStyle} value={data.nationality || 'Filipino'} onChange={e => update('nationality', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label style={lStyle}>Occupation</label><input style={iStyle} value={data.occupation || ''} onChange={e => update('occupation', e.target.value)} placeholder="Farmer, Teacher, etc." onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={lStyle}>Contact Number</label><input style={iStyle} value={data.contactNumber || ''} onChange={e => update('contactNumber', e.target.value)} placeholder="09XXXXXXXXX" onFocus={onFocus} onBlur={onBlur} /></div>
      </div>

      <div className="pt-1">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#334155' }}>Address</p>
        <div className="grid grid-cols-2 gap-4">
          <div><label style={lStyle}>House No. / Lot</label><input style={iStyle} value={data.address?.houseNo || ''} onChange={e => updateAddress('houseNo', e.target.value)} placeholder="123" onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={lStyle}>Street</label><input style={iStyle} value={data.address?.street || ''} onChange={e => updateAddress('street', e.target.value)} placeholder="Rizal Street" onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={lStyle}>Barangay</label><input style={iStyle} value={data.address?.barangay || ''} onChange={e => updateAddress('barangay', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={lStyle}>Municipality</label><input style={iStyle} value={data.address?.municipality || ''} onChange={e => updateAddress('municipality', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={lStyle}>Province</label><input style={iStyle} value={data.address?.province || 'Antique'} onChange={e => updateAddress('province', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={lStyle}>Zip Code</label><input style={iStyle} value={data.address?.zipCode || ''} onChange={e => updateAddress('zipCode', e.target.value)} placeholder="5700" onFocus={onFocus} onBlur={onBlur} /></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={lStyle}>ID Type</label>
          <select style={{ ...iStyle, cursor: 'pointer' }} value={data.idType || ''} onChange={e => update('idType', e.target.value)} onFocus={onFocus} onBlur={onBlur}>
            <option value="" style={{ background: '#0a1628' }}>None / Not presented</option>
            {["PhilSys ID", "Driver's License", "Passport", "SSS/GSIS", "Voter's ID", "Barangay ID", "Other"].map(t => (
              <option key={t} value={t} style={{ background: '#0a1628' }}>{t}</option>
            ))}
          </select>
        </div>
        <div><label style={lStyle}>ID Number</label><input style={iStyle} value={data.idNumber || ''} onChange={e => update('idNumber', e.target.value)} placeholder="ID number" onFocus={onFocus} onBlur={onBlur} /></div>
      </div>
    </div>
  );
}
