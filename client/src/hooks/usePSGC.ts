import psgcData from '../data/psgc.json';

interface PsgcEntry {
  code: string;
  name: string;
  regionCode?: string;
  provinceCode?: string;
  municipalityCode?: string;
}

interface PsgcData {
  regions: PsgcEntry[];
  provinces: PsgcEntry[];
  municipalities: PsgcEntry[];
  barangays: PsgcEntry[];
}

const data = psgcData as PsgcData;

export default function usePSGC() {
  function getRegions(): PsgcEntry[] {
    return data.regions;
  }

  function getProvinces(regionCode?: string): PsgcEntry[] {
    if (!regionCode) return data.provinces;
    return data.provinces.filter(p => p.regionCode === regionCode);
  }

  function getMunicipalities(provinceCode?: string): PsgcEntry[] {
    if (!provinceCode) return data.municipalities;
    return data.municipalities.filter(m => m.provinceCode === provinceCode);
  }

  function getBarangays(municipalityCode?: string): PsgcEntry[] {
    if (!municipalityCode) return data.barangays;
    return data.barangays.filter(b => b.municipalityCode === municipalityCode);
  }

  return { getRegions, getProvinces, getMunicipalities, getBarangays };
}
