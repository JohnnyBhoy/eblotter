import React from 'react';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function ComplainantForm({ data, onChange }) {
  function update(field, value) {
    onChange({ ...data, [field]: value });
  }
  function updateAddress(field, value) {
    onChange({ ...data, address: { ...(data.address || {}), [field]: value } });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#003366]">Complainant Information</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Last Name *</label>
          <input className={inputClass} value={data.lastName || ''} onChange={e => update('lastName', e.target.value)} placeholder="Dela Cruz" required />
        </div>
        <div>
          <label className={labelClass}>First Name *</label>
          <input className={inputClass} value={data.firstName || ''} onChange={e => update('firstName', e.target.value)} placeholder="Juan" required />
        </div>
        <div>
          <label className={labelClass}>Middle Name</label>
          <input className={inputClass} value={data.middleName || ''} onChange={e => update('middleName', e.target.value)} placeholder="Santos" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Suffix</label>
          <input className={inputClass} value={data.suffix || ''} onChange={e => update('suffix', e.target.value)} placeholder="Jr., Sr., III" />
        </div>
        <div>
          <label className={labelClass}>Sex</label>
          <select className={inputClass} value={data.sex || ''} onChange={e => update('sex', e.target.value)}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Birth Date</label>
          <input type="date" className={inputClass} value={data.birthDate || ''} onChange={e => update('birthDate', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Age</label>
          <input type="number" className={inputClass} value={data.age || ''} onChange={e => update('age', e.target.value)} placeholder="25" />
        </div>
        <div>
          <label className={labelClass}>Civil Status</label>
          <select className={inputClass} value={data.civilStatus || ''} onChange={e => update('civilStatus', e.target.value)}>
            <option value="">Select</option>
            {['Single', 'Married', 'Widowed', 'Separated', 'Annulled'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Nationality</label>
          <input className={inputClass} value={data.nationality || 'Filipino'} onChange={e => update('nationality', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Occupation</label>
          <input className={inputClass} value={data.occupation || ''} onChange={e => update('occupation', e.target.value)} placeholder="Farmer, Teacher, etc." />
        </div>
        <div>
          <label className={labelClass}>Contact Number</label>
          <input className={inputClass} value={data.contactNumber || ''} onChange={e => update('contactNumber', e.target.value)} placeholder="09XXXXXXXXX" />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>House No. / Lot</label>
            <input className={inputClass} value={data.address?.houseNo || ''} onChange={e => updateAddress('houseNo', e.target.value)} placeholder="123" />
          </div>
          <div>
            <label className={labelClass}>Street</label>
            <input className={inputClass} value={data.address?.street || ''} onChange={e => updateAddress('street', e.target.value)} placeholder="Rizal Street" />
          </div>
          <div>
            <label className={labelClass}>Barangay</label>
            <input className={inputClass} value={data.address?.barangay || ''} onChange={e => updateAddress('barangay', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Municipality</label>
            <input className={inputClass} value={data.address?.municipality || ''} onChange={e => updateAddress('municipality', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Province</label>
            <input className={inputClass} value={data.address?.province || 'Antique'} onChange={e => updateAddress('province', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Zip Code</label>
            <input className={inputClass} value={data.address?.zipCode || ''} onChange={e => updateAddress('zipCode', e.target.value)} placeholder="5700" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>ID Type</label>
          <select className={inputClass} value={data.idType || ''} onChange={e => update('idType', e.target.value)}>
            <option value="">None / Not presented</option>
            {['PhilSys ID', 'Driver\'s License', 'Passport', 'SSS/GSIS', 'Voter\'s ID', 'Barangay ID', 'Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>ID Number</label>
          <input className={inputClass} value={data.idNumber || ''} onChange={e => update('idNumber', e.target.value)} placeholder="ID number" />
        </div>
      </div>
    </div>
  );
}
