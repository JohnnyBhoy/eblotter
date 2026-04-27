import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

import User from '../models/User.js';
import type { IUserDocument } from '../models/User.js';
import Province from '../models/Province.js';
import type { IProvinceDocument } from '../models/Province.js';
import Municipality from '../models/Municipality.js';
import type { IMunicipalityDocument } from '../models/Municipality.js';
import Barangay from '../models/Barangay.js';
import type { IBarangayDocument } from '../models/Barangay.js';
import Blotter from '../models/Blotter.js';

interface PsgcEntry { code: string; name: string; regionCode?: string; provinceCode?: string; municipalityCode?: string; }
interface PsgcData { regions: PsgcEntry[]; provinces: PsgcEntry[]; municipalities: PsgcEntry[]; barangays: PsgcEntry[]; }

const psgc: PsgcData = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../data/psgc.json'), 'utf-8')
) as PsgcData;

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '_');
}

const STATUSES = ['draft', 'recorded', 'under_mediation', 'settled', 'referred_to_pnp', 'closed'];

async function seed(): Promise<void> {
  await mongoose.connect(process.env['MONGO_URI']!);
  console.log('Connected to MongoDB');

  let superAdmin = await User.findOne({ username: 'superadmin' });
  if (!superAdmin) {
    superAdmin = await User.create({
      username: 'superadmin', password: 'SuperAdmin@2025',
      fullName: 'System Administrator', role: 'super_admin',
      isActive: true, scopeLabel: 'System-Wide'
    });
    console.log('Created super admin');
  } else {
    console.log('Super admin already exists, skipping');
  }

  let province = await Province.findOne({ psgcCode: '064500000' });
  if (!province) {
    province = await Province.create({
      psgcCode: '064500000', name: 'Antique',
      regionCode: '060000000', regionName: 'Region VI (Western Visayas)'
    });
    console.log('Created province: Antique');
  } else {
    console.log('Province Antique already exists, skipping');
  }

  const munCodes = [
    { code: '064501000', name: 'Bugasong' },
    { code: '064504000', name: 'Culasi' },
    { code: '064510000', name: 'Tibiao' },
    { code: '064509000', name: 'Sebaste' },
    { code: '064511000', name: 'Valderrama' }
  ];

  const municipalityDocs: Record<string, IMunicipalityDocument> = {};
  for (const m of munCodes) {
    let mun = await Municipality.findOne({ psgcCode: m.code });
    if (!mun) {
      mun = await Municipality.create({
        psgcCode: m.code, name: m.name,
        province: province._id, provinceCode: '064500000'
      });
      console.log(`Created municipality: ${m.name}`);
    }
    municipalityDocs[m.code] = mun;
  }

  const barangayDocs: Record<string, IBarangayDocument> = {};
  for (const b of psgc.barangays) {
    const mun = municipalityDocs[b.municipalityCode ?? ''];
    if (!mun) continue;
    let brgy = await Barangay.findOne({ psgcCode: b.code });
    if (!brgy) {
      brgy = await Barangay.create({
        psgcCode: b.code, name: b.name,
        municipality: mun._id, municipalityCode: b.municipalityCode,
        province: province._id, punongBarangay: 'Hon. Juan dela Cruz',
        barangaySecretary: 'Maria Santos', contactNumber: '09123456789',
        address: `${b.name}, ${mun.name}, Antique`
      });
      console.log(`Created barangay: ${b.name}`);
    }
    barangayDocs[b.code] = brgy;
  }

  let provincialUser = await User.findOne({ username: 'antique_provincial' });
  if (!provincialUser) {
    provincialUser = await User.create({
      username: 'antique_provincial', password: 'Password@2025',
      fullName: 'Provincial Admin - Antique', role: 'provincial',
      province: province._id, scopeLabel: 'Antique', isActive: true
    });
    console.log('Created provincial account');
  }

  const munUserMap: Record<string, { username: string; fullName: string }> = {
    '064501000': { username: 'bugasong_municipal', fullName: 'Municipal Admin - Bugasong' },
    '064504000': { username: 'culasi_municipal', fullName: 'Municipal Admin - Culasi' },
    '064510000': { username: 'tibiao_municipal', fullName: 'Municipal Admin - Tibiao' },
    '064509000': { username: 'sebaste_municipal', fullName: 'Municipal Admin - Sebaste' },
    '064511000': { username: 'valderrama_municipal', fullName: 'Municipal Admin - Valderrama' }
  };

  for (const [code, info] of Object.entries(munUserMap)) {
    const mun = municipalityDocs[code];
    if (!mun) continue;
    let u = await User.findOne({ username: info.username });
    if (!u) {
      u = await User.create({
        username: info.username, password: 'Password@2025',
        fullName: info.fullName, role: 'municipal',
        municipality: mun._id, province: province._id,
        scopeLabel: `${mun.name}, Antique`, isActive: true
      });
      console.log(`Created municipal account: ${info.username}`);
    }
  }

  const barangayUserDocs: Record<string, IUserDocument> = {};
  for (const b of psgc.barangays) {
    const brgy = barangayDocs[b.code];
    const mun = municipalityDocs[b.municipalityCode ?? ''];
    if (!brgy || !mun) continue;
    const slug = `${slugify(b.name)}_${slugify(mun.name)}`;
    let u = await User.findOne({ username: slug });
    if (!u) {
      u = await User.create({
        username: slug, password: 'Password@2025',
        fullName: `Barangay Admin - ${b.name}, ${mun.name}`, role: 'barangay',
        barangay: brgy._id, municipality: mun._id, province: province._id,
        scopeLabel: `${b.name}, ${mun.name}, Antique`, isActive: true
      });
      console.log(`Created barangay account: ${slug}`);
    }
    barangayUserDocs[b.code] = u;
  }

  const existingBlotters = await Blotter.countDocuments();
  if (existingBlotters === 0) {
    const brgyCodes = Object.keys(barangayDocs);
    const sampleTopics = [
      { complaint: 'Juan', respondent: 'Pedro', incidentType: 'Physical Injury', narrative: 'Complainant was allegedly punched by respondent during a heated argument over a boundary dispute.' },
      { complaint: 'Maria', respondent: 'Rosa', incidentType: 'Oral Defamation / Slander', narrative: 'Respondent allegedly spread false rumors about complainant in the community.' },
      { complaint: 'Carlos', respondent: 'Unknown', incidentType: 'Theft', narrative: 'Complainant reported that his motorcycle was stolen from in front of his house.' },
      { complaint: 'Elena', respondent: 'Jose', incidentType: 'Domestic Violence', narrative: 'Complainant reported being physically harmed by her husband after a domestic dispute.' },
      { complaint: 'Roberto', respondent: 'Miguel', incidentType: 'Threat / Intimidation', narrative: 'Respondent threatened to harm complainant using a bladed weapon.' },
      { complaint: 'Ana', respondent: 'Lito', incidentType: 'Property Damage', narrative: "Respondent allegedly destroyed the fence of the complainant's property." },
      { complaint: 'Ramon', respondent: 'Unknown', incidentType: 'Missing Person', narrative: 'Complainant reports that his 15-year-old child has been missing for 3 days.' },
      { complaint: 'Gloria', respondent: 'Neighbors', incidentType: 'Noise Disturbance', narrative: 'Complainant reported that respondents were causing excessive noise late at night.' },
      { complaint: 'Felix', respondent: 'Antonio', incidentType: 'Estafa / Fraud', narrative: 'Respondent allegedly defrauded complainant of PHP 10,000 through a fake investment scheme.' },
      { complaint: 'Nora', respondent: 'Ben', incidentType: 'Unjust Vexation', narrative: 'Respondent repeatedly harasses complainant by blocking her path to her residence.' }
    ];

    for (let i = 0; i < sampleTopics.length; i++) {
      const t = sampleTopics[i]!;
      const brgyCode = brgyCodes[i % brgyCodes.length]!;
      const brgy = barangayDocs[brgyCode];
      const psgcBrgy = psgc.barangays.find(b => b.code === brgyCode);
      const mun = municipalityDocs[psgcBrgy?.municipalityCode ?? ''];
      const brgyUser = barangayUserDocs[brgyCode];
      if (!brgy || !mun || !brgyUser) continue;

      const dateOffset = Math.floor(Math.random() * 90);
      const incidentDate = new Date();
      incidentDate.setDate(incidentDate.getDate() - dateOffset);
      const status = STATUSES[i % STATUSES.length]!;

      await Blotter.create({
        blotterNumber: `BLT-${(mun as unknown as Record<string, unknown>)['psgcCode']}-${String(i + 1).padStart(4, '0')}`,
        barangay: brgy._id, municipality: mun._id, province: province._id,
        createdBy: brgyUser._id, status,
        dateRecorded: new Date(Date.now() - dateOffset * 86400000),
        incident: {
          type: t.incidentType, dateOccurred: incidentDate,
          timeOccurred: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
          placeOccurred: `${brgy.name}, ${mun.name}, Antique`,
          narrative: t.narrative, isReferred: status === 'referred_to_pnp'
        },
        complainant: {
          lastName: t.complaint, firstName: 'dela Cruz',
          sex: i % 2 === 0 ? 'Male' : 'Female', age: 30 + i,
          civilStatus: 'Single', nationality: 'Filipino', occupation: 'Farmer',
          contactNumber: `0912345678${i}`,
          address: { barangay: brgy.name, municipality: mun.name, province: 'Antique' }
        },
        respondents: [{
          lastName: t.respondent, firstName: 'Reyes', sex: 'Male', age: 35,
          address: { barangay: brgy.name, municipality: mun.name, province: 'Antique' },
          relationshipToComplainant: 'Neighbor', isKnown: t.respondent !== 'Unknown'
        }],
        witnesses: [],
        reliefRequested: 'Complainant seeks mediation and peaceful resolution.',
        recordedBy: { name: (brgyUser as unknown as Record<string, unknown>)['fullName'] as string, position: 'Barangay Secretary' },
        barangayAction: {
          actionTaken: status === 'settled' ? 'Parties agreed to an amicable settlement.' : 'Under investigation.',
          settledAmicably: status === 'settled', endorsedToPNP: status === 'referred_to_pnp'
        }
      });
      console.log(`Created sample blotter ${i + 1}`);
    }
  } else {
    console.log(`Blotters already exist (${existingBlotters}), skipping sample blotter creation`);
  }

  console.log('\nSeed complete!');
  console.log('  Super Admin: superadmin / SuperAdmin@2025');
  console.log('  Provincial:  antique_provincial / Password@2025');
  console.log('  Municipal:   bugasong_municipal / Password@2025');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
