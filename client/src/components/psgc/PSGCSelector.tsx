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

  const selectClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]';

  return (
    <div className="space-y-3">
      {levels.includes('region') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <select className={selectClass} value={region} onChange={handleRegion}>
            <option value="">Select Region</option>
            {getRegions().map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
          </select>
        </div>
      )}
      {levels.includes('province') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
          <select className={selectClass} value={province} onChange={handleProvince}
            disabled={levels.includes('region') && !region}>
            <option value="">Select Province</option>
            {getProvinces(region).map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
          </select>
        </div>
      )}
      {levels.includes('municipality') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
          <select className={selectClass} value={municipality} onChange={handleMunicipality} disabled={!province}>
            <option value="">Select Municipality</option>
            {getMunicipalities(province).map(m => <option key={m.code} value={m.code}>{m.name}</option>)}
          </select>
        </div>
      )}
      {levels.includes('barangay') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
          <select className={selectClass} value={barangay}
            onChange={e => setBarangay(e.target.value)} disabled={!municipality}>
            <option value="">Select Barangay</option>
            {getBarangays(municipality).map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
