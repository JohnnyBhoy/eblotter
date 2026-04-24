import React from 'react';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

const emptyRespondent = () => ({
  lastName: '', firstName: '', middleName: '',
  sex: '', age: '', address: { barangay: '', municipality: '', province: 'Antique' },
  contactNumber: '', relationshipToComplainant: '', isKnown: true
});

export default function RespondentForm({ data = [], onChange }) {
  function add() {
    onChange([...data, emptyRespondent()]);
  }

  function remove(idx) {
    onChange(data.filter((_, i) => i !== idx));
  }

  function update(idx, field, value) {
    const updated = [...data];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  }

  function updateAddress(idx, field, value) {
    const updated = [...data];
    updated[idx] = { ...updated[idx], address: { ...(updated[idx].address || {}), [field]: value } };
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#003366]">Respondents</h3>
        <button type="button" onClick={add} className="text-sm bg-[#003366] text-white px-3 py-1.5 rounded-lg hover:bg-[#002147] transition">
          + Add Respondent
        </button>
      </div>
      {data.length === 0 && (
        <p className="text-gray-500 text-sm italic">No respondents added yet. Click "Add Respondent" to add one.</p>
      )}
      {data.map((r, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700 text-sm">Respondent #{idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id={`known-${idx}`} checked={r.isKnown !== false} onChange={e => update(idx, 'isKnown', e.target.checked)} />
            <label htmlFor={`known-${idx}`} className="text-sm text-gray-700">Identity known</label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Last Name</label>
              <input className={inputClass} value={r.lastName || ''} onChange={e => update(idx, 'lastName', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>First Name</label>
              <input className={inputClass} value={r.firstName || ''} onChange={e => update(idx, 'firstName', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Middle Name</label>
              <input className={inputClass} value={r.middleName || ''} onChange={e => update(idx, 'middleName', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Sex</label>
              <select className={inputClass} value={r.sex || ''} onChange={e => update(idx, 'sex', e.target.value)}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Age</label>
              <input type="number" className={inputClass} value={r.age || ''} onChange={e => update(idx, 'age', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Contact Number</label>
              <input className={inputClass} value={r.contactNumber || ''} onChange={e => update(idx, 'contactNumber', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Relationship to Complainant</label>
            <input className={inputClass} value={r.relationshipToComplainant || ''} onChange={e => update(idx, 'relationshipToComplainant', e.target.value)} placeholder="Neighbor, Relative, etc." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Barangay</label>
              <input className={inputClass} value={r.address?.barangay || ''} onChange={e => updateAddress(idx, 'barangay', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Municipality</label>
              <input className={inputClass} value={r.address?.municipality || ''} onChange={e => updateAddress(idx, 'municipality', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Province</label>
              <input className={inputClass} value={r.address?.province || 'Antique'} onChange={e => updateAddress(idx, 'province', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
