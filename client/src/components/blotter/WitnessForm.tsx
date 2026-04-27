import React from 'react';
import type { BlotterWitness } from '../../types/index.js';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

const emptyWitness = (): BlotterWitness => ({ lastName: '', firstName: '', contactNumber: '', address: '', statement: '' });

interface WitnessFormProps {
  data: BlotterWitness[];
  onChange: (data: BlotterWitness[]) => void;
}

export default function WitnessForm({ data = [], onChange }: WitnessFormProps) {
  function add() { onChange([...data, emptyWitness()]); }
  function remove(idx: number) { onChange(data.filter((_, i) => i !== idx)); }
  function update(idx: number, field: string, value: string) {
    const updated = [...data];
    updated[idx] = { ...updated[idx]!, [field]: value };
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#003366]">Witnesses</h3>
        <button type="button" onClick={add} className="text-sm bg-[#003366] text-white px-3 py-1.5 rounded-lg hover:bg-[#002147] transition">
          + Add Witness
        </button>
      </div>
      {data.length === 0 && (
        <p className="text-gray-500 text-sm italic">No witnesses added. This is optional.</p>
      )}
      {data.map((w, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700 text-sm">Witness #{idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Last Name</label>
              <input className={inputClass} value={w.lastName || ''} onChange={e => update(idx, 'lastName', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>First Name</label>
              <input className={inputClass} value={w.firstName || ''} onChange={e => update(idx, 'firstName', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Contact Number</label>
              <input className={inputClass} value={w.contactNumber || ''} onChange={e => update(idx, 'contactNumber', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input className={inputClass} value={w.address || ''} onChange={e => update(idx, 'address', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Statement</label>
            <textarea className={inputClass} rows={3} value={w.statement || ''} onChange={e => update(idx, 'statement', e.target.value)} placeholder="Witness account..." />
          </div>
        </div>
      ))}
    </div>
  );
}
