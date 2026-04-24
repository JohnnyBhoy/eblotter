import psgcData from '../data/psgc.json';

export default function usePSGC() {
  function getRegions() {
    return psgcData.regions;
  }

  function getProvinces(regionCode) {
    if (!regionCode) return psgcData.provinces;
    return psgcData.provinces.filter(p => p.regionCode === regionCode);
  }

  function getMunicipalities(provinceCode) {
    if (!provinceCode) return psgcData.municipalities;
    return psgcData.municipalities.filter(m => m.provinceCode === provinceCode);
  }

  function getBarangays(municipalityCode) {
    if (!municipalityCode) return psgcData.barangays;
    return psgcData.barangays.filter(b => b.municipalityCode === municipalityCode);
  }

  return { getRegions, getProvinces, getMunicipalities, getBarangays };
}
