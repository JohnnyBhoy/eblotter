import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType
} from 'docx';
import type { Response } from 'express';
import type { IBlotterDocument } from '../models/Blotter.js';

function formatDate(date?: Date | string | null): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function formatName(person?: Record<string, unknown> | null): string {
  if (!person) return 'N/A';
  return [person['lastName'], person['firstName'], person['middleName']].filter(Boolean).join(', ');
}

function formatAddress(addr?: Record<string, unknown> | string | null): string {
  if (!addr) return 'N/A';
  if (typeof addr === 'string') return addr;
  return [addr['houseNo'], addr['street'], addr['barangay'], addr['municipality'], addr['province']]
    .filter(Boolean).join(', ');
}

function bold(text: unknown): TextRun {
  return new TextRun({ text: String(text ?? ''), bold: true });
}

function normal(text: unknown): TextRun {
  return new TextRun({ text: String(text ?? '') });
}

function labelValue(label: string, value: string): Paragraph {
  return new Paragraph({ children: [bold(label + ': '), normal(value)] });
}

function sectionHeader(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 }
  });
}

export async function generateBlotterDocx(blotter: IBlotterDocument, res: Response): Promise<void> {
  const brgy = blotter.barangay as Record<string, unknown>;
  const mun = blotter.municipality as Record<string, unknown>;
  const prov = blotter.province as Record<string, unknown>;

  const children: Paragraph[] = [
    new Paragraph({
      text: 'Republic of the Philippines',
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: `Province of ${(prov?.['name'] as string) || 'Antique'} — Municipality of ${(mun?.['name'] as string) || ''} — ${(brgy?.['name'] as string) || 'Barangay'}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: 'BARANGAY BLOTTER',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    labelValue('Blotter No.', blotter.blotterNumber || 'N/A'),
    labelValue('Date Recorded', formatDate(blotter.dateRecorded)),
    sectionHeader('INCIDENT INFORMATION'),
    labelValue('Type', blotter.incident?.type || 'N/A'),
    labelValue('Date/Time', `${formatDate(blotter.incident?.dateOccurred)}${blotter.incident?.timeOccurred ? ' at ' + blotter.incident.timeOccurred : ''}`),
    labelValue('Place', blotter.incident?.placeOccurred || 'N/A'),
    labelValue('Motive', blotter.incident?.motive || 'N/A'),
    labelValue('Weapon/Object Used', blotter.incident?.weaponOrObjectUsed || 'N/A'),
    new Paragraph({ children: [bold('Narrative: '), normal(blotter.incident?.narrative || 'N/A')] }),
    sectionHeader('COMPLAINANT'),
  ];

  const c = blotter.complainant as unknown as Record<string, unknown>;
  children.push(labelValue('Name', formatName(c)));
  children.push(labelValue('Sex', (c?.['sex'] as string) || 'N/A'));
  children.push(labelValue('Age', String(c?.['age'] || 'N/A')));
  children.push(labelValue('Civil Status', (c?.['civilStatus'] as string) || 'N/A'));
  children.push(labelValue('Address', formatAddress(c?.['address'] as Record<string, unknown>)));
  children.push(labelValue('Contact', (c?.['contactNumber'] as string) || 'N/A'));
  children.push(labelValue('Occupation', (c?.['occupation'] as string) || 'N/A'));
  children.push(sectionHeader('RESPONDENT(S)'));

  const respondents = blotter.respondents || [];
  respondents.forEach((r, idx) => {
    const rd = r as unknown as Record<string, unknown>;
    children.push(new Paragraph({ children: [bold(`Respondent ${idx + 1}:`)] }));
    children.push(labelValue('Name', formatName(rd)));
    children.push(labelValue('Sex', (rd['sex'] as string) || 'N/A'));
    children.push(labelValue('Age', String(rd['age'] || 'N/A')));
    children.push(labelValue('Address', formatAddress(rd['address'] as Record<string, unknown>)));
    children.push(labelValue('Contact', (rd['contactNumber'] as string) || 'N/A'));
    children.push(labelValue('Relationship', (rd['relationshipToComplainant'] as string) || 'N/A'));
  });

  const witnesses = blotter.witnesses || [];
  if (witnesses.length > 0) {
    children.push(sectionHeader('WITNESSES'));
    witnesses.forEach((w, idx) => {
      const wd = w as unknown as Record<string, unknown>;
      children.push(new Paragraph({ children: [bold(`Witness ${idx + 1}:`)] }));
      children.push(labelValue('Name', `${(wd['firstName'] as string) || ''} ${(wd['lastName'] as string) || ''}`));
      children.push(labelValue('Contact', (wd['contactNumber'] as string) || 'N/A'));
      children.push(labelValue('Address', (wd['address'] as string) || 'N/A'));
      if (wd['statement']) children.push(labelValue('Statement', wd['statement'] as string));
    });
  }

  children.push(sectionHeader('RESOLUTION & ACTION'));
  children.push(labelValue('Relief Requested', blotter.reliefRequested || 'N/A'));
  children.push(labelValue('Action Taken', blotter.barangayAction?.actionTaken || 'N/A'));
  children.push(labelValue('Status', (blotter.status || 'recorded').replace(/_/g, ' ').toUpperCase()));
  children.push(new Paragraph({ spacing: { before: 400 } }));
  children.push(new Paragraph({ children: [bold('Recorded by: '), normal(blotter.recordedBy?.name || 'N/A')] }));
  children.push(labelValue('Position', blotter.recordedBy?.position || 'N/A'));
  children.push(labelValue('Date', formatDate(blotter.dateRecorded)));

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="blotter-${blotter.blotterNumber}.docx"`);
  res.send(buffer);
}
