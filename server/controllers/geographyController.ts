import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { Request, Response, NextFunction } from 'express';
import Province from '../models/Province.js';
import Municipality from '../models/Municipality.js';
import Barangay from '../models/Barangay.js';

interface PsgcEntry { code: string; name: string; regionCode?: string; provinceCode?: string; municipalityCode?: string; }
interface PsgcData {
  regions: PsgcEntry[];
  provinces: PsgcEntry[];
  municipalities: PsgcEntry[];
  barangays: PsgcEntry[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const psgc: PsgcData = JSON.parse(readFileSync(join(__dirname, '../data/psgc.json'), 'utf-8')) as PsgcData;

export const getRegions = (_req: Request, res: Response): void => { res.json(psgc.regions); };

export const getProvinces = (req: Request, res: Response): void => {
  const { region } = req.query as { region?: string };
  const provinces = region ? psgc.provinces.filter(p => p.regionCode === region) : psgc.provinces;
  res.json(provinces);
};

export const getMunicipalities = (req: Request, res: Response): void => {
  const { province } = req.query as { province?: string };
  const municipalities = province ? psgc.municipalities.filter(m => m.provinceCode === province) : psgc.municipalities;
  res.json(municipalities);
};

export const getBarangays = (req: Request, res: Response): void => {
  const { municipality } = req.query as { municipality?: string };
  const barangays = municipality ? psgc.barangays.filter(b => b.municipalityCode === municipality) : psgc.barangays;
  res.json(barangays);
};

export const registerProvince = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { psgcCode } = req.body as { psgcCode?: string };
    const psgcProvince = psgc.provinces.find(p => p.code === psgcCode);
    if (!psgcProvince) { res.status(400).json({ message: 'Province not found in PSGC data' }); return; }

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
  } catch (err) { next(err); }
};

export const registerMunicipality = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { psgcCode, provinceDbId } = req.body as { psgcCode?: string; provinceDbId?: string };
    const psgcMun = psgc.municipalities.find(m => m.code === psgcCode);
    if (!psgcMun) { res.status(400).json({ message: 'Municipality not found in PSGC data' }); return; }

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
  } catch (err) { next(err); }
};

export const registerBarangay = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { psgcCode, municipalityDbId, provinceDbId, punongBarangay, barangaySecretary, contactNumber, address } =
      req.body as Record<string, string>;
    const psgcBrgy = psgc.barangays.find(b => b.code === psgcCode);
    if (!psgcBrgy) { res.status(400).json({ message: 'Barangay not found in PSGC data' }); return; }

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
  } catch (err) { next(err); }
};

export const getRegisteredProvinces = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provinces = await Province.find({}).sort({ name: 1 });
    res.json(provinces);
  } catch (err) { next(err); }
};

export const getRegisteredMunicipalities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { provinceId } = req.query as { provinceId?: string };
    const filter = provinceId ? { province: provinceId } : {};
    const municipalities = await Municipality.find(filter).populate('province', 'name').sort({ name: 1 });
    res.json(municipalities);
  } catch (err) { next(err); }
};

export const getRegisteredBarangays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { municipalityId, provinceId } = req.query as { municipalityId?: string; provinceId?: string };
    const filter: Record<string, string> = {};
    if (municipalityId) filter['municipality'] = municipalityId;
    if (provinceId) filter['province'] = provinceId;
    const barangays = await Barangay.find(filter).populate('municipality', 'name').populate('province', 'name').sort({ name: 1 });
    res.json(barangays);
  } catch (err) { next(err); }
};
