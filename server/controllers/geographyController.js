import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Province from '../models/Province.js';
import Municipality from '../models/Municipality.js';
import Barangay from '../models/Barangay.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const psgc = JSON.parse(readFileSync(join(__dirname, '../data/psgc.json'), 'utf-8'));

export const getRegions = (req, res) => res.json(psgc.regions);

export const getProvinces = (req, res) => {
  const { region } = req.query;
  const provinces = region ? psgc.provinces.filter(p => p.regionCode === region) : psgc.provinces;
  res.json(provinces);
};

export const getMunicipalities = (req, res) => {
  const { province } = req.query;
  const municipalities = province ? psgc.municipalities.filter(m => m.provinceCode === province) : psgc.municipalities;
  res.json(municipalities);
};

export const getBarangays = (req, res) => {
  const { municipality } = req.query;
  const barangays = municipality ? psgc.barangays.filter(b => b.municipalityCode === municipality) : psgc.barangays;
  res.json(barangays);
};

export const registerProvince = async (req, res, next) => {
  try {
    const { psgcCode } = req.body;
    const psgcProvince = psgc.provinces.find(p => p.code === psgcCode);
    if (!psgcProvince) return res.status(400).json({ message: 'Province not found in PSGC data' });

    const region = psgc.regions.find(r => r.code === psgcProvince.regionCode);
    let province = await Province.findOne({ psgcCode });
    if (!province) {
      province = await Province.create({
        psgcCode,
        name: psgcProvince.name,
        regionCode: psgcProvince.regionCode,
        regionName: region?.name || ''
      });
    }
    res.status(201).json(province);
  } catch (err) {
    next(err);
  }
};

export const registerMunicipality = async (req, res, next) => {
  try {
    const { psgcCode, provinceDbId } = req.body;
    const psgcMun = psgc.municipalities.find(m => m.code === psgcCode);
    if (!psgcMun) return res.status(400).json({ message: 'Municipality not found in PSGC data' });

    let mun = await Municipality.findOne({ psgcCode });
    if (!mun) {
      mun = await Municipality.create({
        psgcCode,
        name: psgcMun.name,
        province: provinceDbId,
        provinceCode: psgcMun.provinceCode
      });
    }
    res.status(201).json(mun);
  } catch (err) {
    next(err);
  }
};

export const registerBarangay = async (req, res, next) => {
  try {
    const { psgcCode, municipalityDbId, provinceDbId, punongBarangay, barangaySecretary, contactNumber, address } = req.body;
    const psgcBrgy = psgc.barangays.find(b => b.code === psgcCode);
    if (!psgcBrgy) return res.status(400).json({ message: 'Barangay not found in PSGC data' });

    let brgy = await Barangay.findOne({ psgcCode });
    if (!brgy) {
      brgy = await Barangay.create({
        psgcCode,
        name: psgcBrgy.name,
        municipality: municipalityDbId,
        municipalityCode: psgcBrgy.municipalityCode,
        province: provinceDbId,
        punongBarangay,
        barangaySecretary,
        contactNumber,
        address
      });
    }
    res.status(201).json(brgy);
  } catch (err) {
    next(err);
  }
};

export const getRegisteredProvinces = async (req, res, next) => {
  try {
    const provinces = await Province.find({}).sort({ name: 1 });
    res.json(provinces);
  } catch (err) {
    next(err);
  }
};

export const getRegisteredMunicipalities = async (req, res, next) => {
  try {
    const { provinceId } = req.query;
    const filter = provinceId ? { province: provinceId } : {};
    const municipalities = await Municipality.find(filter).populate('province', 'name').sort({ name: 1 });
    res.json(municipalities);
  } catch (err) {
    next(err);
  }
};

export const getRegisteredBarangays = async (req, res, next) => {
  try {
    const { municipalityId, provinceId } = req.query;
    const filter = {};
    if (municipalityId) filter.municipality = municipalityId;
    if (provinceId) filter.province = provinceId;
    const barangays = await Barangay.find(filter).populate('municipality', 'name').populate('province', 'name').sort({ name: 1 });
    res.json(barangays);
  } catch (err) {
    next(err);
  }
};
