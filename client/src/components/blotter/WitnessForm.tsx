import React from 'react';
import type { BlotterWitness } from '../../types/index.js';

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
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; };
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; };

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
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#8b5cf6,#6d28d9)' }} />
          <h3 className="text-sm font-bold text-white">Witnesses</h3>
        </div>
        <button
          type="button"
          onClick={add}
          className="text-xs px-3 py-1.5 rounded-xl font-semibold text-white"
          style={{ background: 'rgba(37,99,235,0.7)', border: '1px solid rgba(59,130,246,0.4)' }}
        >
          + Add Witness
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-xs italic" style={{ color: '#475569' }}>No witnesses added. This is optional.</p>
      )}

      {data.map((w, idx) => (
        <div
          key={idx}
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Witness #{idx + 1}</span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label style={lStyle}>Last Name</label><input style={iStyle} value={w.lastName || ''} onChange={e => update(idx, 'lastName', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={lStyle}>First Name</label><input style={iStyle} value={w.firstName || ''} onChange={e => update(idx, 'firstName', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label style={lStyle}>Contact Number</label><input style={iStyle} value={w.contactNumber || ''} onChange={e => update(idx, 'contactNumber', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={lStyle}>Address</label><input style={iStyle} value={w.address || ''} onChange={e => update(idx, 'address', e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          </div>
          <div>
            <label style={lStyle}>Statement</label>
            <textarea style={{ ...iStyle, resize: 'vertical' }} rows={3} value={w.statement || ''} onChange={e => update(idx, 'statement', e.target.value)} placeholder="Witness account..." onFocus={onFocus} onBlur={onBlur} />
          </div>
        </div>
      ))}
    </div>
  );
}
