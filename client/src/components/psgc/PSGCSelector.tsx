import React, { useState, useEffect } from 'react';
import usePSGC from '../../hooks/usePSGC.js';

interface PSGCSelectorValue {
  region?: string;
  province?: string;
  municipality?: string;
  barangay?: string;
}

type PSGCLevel = 'region' | 'province' | 'municipality' | 'barangay';

interface PSGCSelectorProps {
  value?: PSGCSelectorValue;
  onChange: (value: PSGCSelectorValue) => void;
  levels?: PSGCLevel[];
}

export default function PSGCSelector({
  value = {},
  onChange,
  levels = ['region', 'province', 'municipality', 'barangay']
}: PSGCSelectorProps) {
  const { getRegions, getProvinces, getMunicipalities, getBarangays } = usePSGC();
  const [region, setRegion] = useState(value.region ?? '');
  const [province, setProvince] = useState(value.province ?? '');
  const [municipality, setMunicipality] = useState(value.municipality ?? '');
  const [barangay, setBarangay] = useState(value.barangay ?? '');

  useEffect(() => {
    onChange({ region, province, municipality, barangay });
  }, [region, province, municipality, barangay]);

  function handleRegion(e: React.ChangeEvent<HTMLSelectElement>) {
    setRegion(e.target.value);
    setProvince('');
    setMunicipality('');
    setBarangay('');
  }

  function handleProvince(e: React.ChangeEvent<HTMLSelectElement>) {
    setProvince(e.target.value);
    setMunicipality('');
    setBarangay('');
  }

  function handleMunicipality(e: React.ChangeEvent<HTMLSelectElement>) {
    setMunicipality(e.target.value);
    setBarangay('');
  }

  const sStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#cbd5e1',
    fontSize: 13,
    padding: '8px 12px',
    outline: 'none',
    cursor: 'pointer',
  };
  const lStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: '#475569', marginBottom: 5,
  };
  const onFocus = (e: React.FocusEvent<HTMLSelectElement>) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; };
  const onBlur = (e: React.FocusEvent<HTMLSelectElement>) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; };
  const optStyle = { background: '#0a1628' };

  return (
    <div className="space-y-3">
      {levels.includes('region') && (
        <div>
          <label style={lStyle}>Region</label>
          <select style={sStyle} value={region} onChange={handleRegion} onFocus={onFocus} onBlur={onBlur}>
            <option value="" style={optStyle}>Select Region</option>
            {getRegions().map(r => <option key={r.code} value={r.code} style={optStyle}>{r.name}</option>)}
          </select>
        </div>
      )}
      {levels.includes('province') && (
        <div>
          <label style={lStyle}>Province</label>
          <select style={{ ...sStyle, opacity: levels.includes('region') && !region ? 0.5 : 1 }} value={province} onChange={handleProvince}
            disabled={levels.includes('region') && !region} onFocus={onFocus} onBlur={onBlur}>
            <option value="" style={optStyle}>Select Province</option>
            {getProvinces(region).map(p => <option key={p.code} value={p.code} style={optStyle}>{p.name}</option>)}
          </select>
        </div>
      )}
      {levels.includes('municipality') && (
        <div>
          <label style={lStyle}>Municipality</label>
          <select style={{ ...sStyle, opacity: !province ? 0.5 : 1 }} value={municipality} onChange={handleMunicipality} disabled={!province} onFocus={onFocus} onBlur={onBlur}>
            <option value="" style={optStyle}>Select Municipality</option>
            {getMunicipalities(province).map(m => <option key={m.code} value={m.code} style={optStyle}>{m.name}</option>)}
          </select>
        </div>
      )}
      {levels.includes('barangay') && (
        <div>
          <label style={lStyle}>Barangay</label>
          <select style={{ ...sStyle, opacity: !municipality ? 0.5 : 1 }} value={barangay}
            onChange={e => setBarangay(e.target.value)} disabled={!municipality} onFocus={onFocus} onBlur={onBlur}>
            <option value="" style={optStyle}>Select Barangay</option>
            {getBarangays(municipality).map(b => <option key={b.code} value={b.code} style={optStyle}>{b.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
