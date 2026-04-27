import PDFDocument from 'pdfkit';
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
  const parts = [person['lastName'], person['firstName'], person['middleName']].filter(Boolean);
  return parts.join(', ');
}

function formatAddress(addr?: Record<string, unknown> | string | null): string {
  if (!addr) return 'N/A';
  if (typeof addr === 'string') return addr;
  return [addr['houseNo'], addr['street'], addr['barangay'], addr['municipality'], addr['province']]
    .filter(Boolean).join(', ');
}

export function generateBlotterPDF(blotter: IBlotterDocument, res: Response): void {
  const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="blotter-${blotter.blotterNumber}.pdf"`);
  doc.pipe(res);

  const brgy = blotter.barangay as Record<string, unknown>;
  const mun = blotter.municipality as Record<string, unknown>;
  const prov = blotter.province as Record<string, unknown>;

  doc.fontSize(10).text('Republic of the Philippines', { align: 'center' });
  doc.text(`Province of ${(prov?.['name'] as string) || 'Antique'}`, { align: 'center' });
  doc.text(`Municipality of ${(mun?.['name'] as string) || ''}`, { align: 'center' });
  doc.text(`${(brgy?.['name'] as string) || 'Barangay'}`, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(14).font('Helvetica-Bold').text('BARANGAY BLOTTER', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(0.5);

  doc.font('Helvetica-Bold').text(`Blotter No.: `, { continued: true });
  doc.font('Helvetica').text(blotter.blotterNumber || 'N/A', { continued: true });
  doc.text(`        Date Recorded: ${formatDate(blotter.dateRecorded)}`, { align: 'right' });
  doc.moveDown(0.5);

  doc.font('Helvetica-Bold').text('INCIDENT INFORMATION');
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').text('Type: ', { continued: true });
  doc.font('Helvetica').text(blotter.incident?.type || 'N/A');
  if (blotter.incident?.otherType) {
    doc.font('Helvetica-Bold').text('Other Type: ', { continued: true });
    doc.font('Helvetica').text(blotter.incident.otherType);
  }
  doc.font('Helvetica-Bold').text('Date/Time: ', { continued: true });
  doc.font('Helvetica').text(
    `${formatDate(blotter.incident?.dateOccurred)}${blotter.incident?.timeOccurred ? ' at ' + blotter.incident.timeOccurred : ''}`
  );
  doc.font('Helvetica-Bold').text('Place: ', { continued: true });
  doc.font('Helvetica').text(blotter.incident?.placeOccurred || 'N/A');
  if (blotter.incident?.motive) {
    doc.font('Helvetica-Bold').text('Motive: ', { continued: true });
    doc.font('Helvetica').text(blotter.incident.motive);
  }
  if (blotter.incident?.weaponOrObjectUsed) {
    doc.font('Helvetica-Bold').text('Weapon/Object: ', { continued: true });
    doc.font('Helvetica').text(blotter.incident.weaponOrObjectUsed);
  }
  doc.font('Helvetica-Bold').text('Narrative:');
  doc.font('Helvetica').text(blotter.incident?.narrative || 'N/A', { indent: 20 });
  doc.moveDown(0.5);

  doc.font('Helvetica-Bold').text('COMPLAINANT');
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(0.3);
  const c = blotter.complainant as unknown as Record<string, unknown>;
  doc.font('Helvetica-Bold').text('Name: ', { continued: true });
  doc.font('Helvetica').text(formatName(c));
  doc.font('Helvetica-Bold').text('Sex: ', { continued: true });
  doc.font('Helvetica').text(`${(c?.['sex'] as string) || 'N/A'}   Age: ${(c?.['age'] as number) || 'N/A'}   Civil Status: ${(c?.['civilStatus'] as string) || 'N/A'}`);
  doc.font('Helvetica-Bold').text('Address: ', { continued: true });
  doc.font('Helvetica').text(formatAddress(c?.['address'] as Record<string, unknown>));
  doc.font('Helvetica-Bold').text('Contact: ', { continued: true });
  doc.font('Helvetica').text((c?.['contactNumber'] as string) || 'N/A');
  doc.font('Helvetica-Bold').text('Occupation: ', { continued: true });
  doc.font('Helvetica').text((c?.['occupation'] as string) || 'N/A');
  if (c?.['idType']) {
    doc.font('Helvetica-Bold').text('ID: ', { continued: true });
    doc.font('Helvetica').text(`${c['idType']} - ${(c['idNumber'] as string) || ''}`);
  }
  doc.moveDown(0.5);

  doc.font('Helvetica-Bold').text('RESPONDENT(S)');
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(0.3);
  const respondents = blotter.respondents || [];
  respondents.forEach((r, idx) => {
    const rd = r as unknown as Record<string, unknown>;
    doc.font('Helvetica-Bold').text(`Respondent ${idx + 1}:`);
    doc.font('Helvetica').text(`Name: ${formatName(rd)}`);
    doc.text(`Sex: ${(rd['sex'] as string) || 'N/A'}   Age: ${(rd['age'] as number) || 'N/A'}`);
    doc.text(`Address: ${formatAddress(rd['address'] as Record<string, unknown>)}`);
    doc.text(`Contact: ${(rd['contactNumber'] as string) || 'N/A'}`);
    doc.text(`Relationship: ${(rd['relationshipToComplainant'] as string) || 'N/A'}`);
    doc.moveDown(0.3);
  });
  if (respondents.length === 0) {
    doc.font('Helvetica').text('None specified');
    doc.moveDown(0.3);
  }

  const witnesses = blotter.witnesses || [];
  if (witnesses.length > 0) {
    doc.font('Helvetica-Bold').text('WITNESSES');
    doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
    doc.moveDown(0.3);
    witnesses.forEach((w, idx) => {
      const wd = w as unknown as Record<string, unknown>;
      doc.font('Helvetica-Bold').text(`Witness ${idx + 1}:`);
      doc.font('Helvetica').text(`Name: ${(wd['firstName'] as string) || ''} ${(wd['lastName'] as string) || ''}`);
      doc.text(`Contact: ${(wd['contactNumber'] as string) || 'N/A'}`);
      doc.text(`Address: ${(wd['address'] as string) || 'N/A'}`);
      if (wd['statement']) doc.text(`Statement: ${wd['statement']}`);
      doc.moveDown(0.3);
    });
  }

  doc.font('Helvetica-Bold').text('RESOLUTION & ACTION');
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').text('Relief Requested: ', { continued: true });
  doc.font('Helvetica').text(blotter.reliefRequested || 'N/A');
  doc.font('Helvetica-Bold').text('Action Taken: ', { continued: true });
  doc.font('Helvetica').text(blotter.barangayAction?.actionTaken || 'N/A');
  doc.font('Helvetica-Bold').text('Status: ', { continued: true });
  doc.font('Helvetica').text((blotter.status || 'recorded').replace(/_/g, ' ').toUpperCase());
  if (blotter.barangayAction?.settledAmicably) {
    doc.font('Helvetica-Bold').text('Settlement Date: ', { continued: true });
    doc.font('Helvetica').text(formatDate(blotter.barangayAction.settlementDate));
    doc.font('Helvetica-Bold').text('Settlement Details: ', { continued: true });
    doc.font('Helvetica').text(blotter.barangayAction.settlementDetails || 'N/A');
  }
  if (blotter.barangayAction?.endorsedToPNP) {
    doc.font('Helvetica-Bold').text('Referred to PNP: YES');
    doc.font('Helvetica-Bold').text('Endorsement Date: ', { continued: true });
    doc.font('Helvetica').text(formatDate(blotter.barangayAction.endorsementDate));
    doc.font('Helvetica-Bold').text('Reason: ', { continued: true });
    doc.font('Helvetica').text(blotter.barangayAction.endorsementReason || 'N/A');
  }
  doc.moveDown(1);

  const sigY = doc.y;
  doc.font('Helvetica').text('_______________________________', 50, sigY);
  doc.text('_______________________________', 320, sigY);
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').text(`${blotter.recordedBy?.name || 'N/A'}`, 50);
  doc.font('Helvetica-Bold').text(`${(brgy?.['punongBarangay'] as string) || 'Punong Barangay'}`, 320, doc.y - doc.currentLineHeight());
  doc.font('Helvetica').text(`${blotter.recordedBy?.position || 'Barangay Official'}`, 50);
  doc.text('Punong Barangay', 320, doc.y - doc.currentLineHeight());
  doc.moveDown(0.5);
  doc.font('Helvetica').text(`Date: ${formatDate(blotter.dateRecorded)}`);

  doc.end();
}

export function generateSummaryPDF(blotters: IBlotterDocument[], scope: string, dateRange: string | null, res: Response): void {
  const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="summary-report.pdf"`);
  doc.pipe(res);

  doc.fontSize(10).text('Republic of the Philippines', { align: 'center' });
  doc.fontSize(14).font('Helvetica-Bold').text('BARANGAY BLOTTER SUMMARY REPORT', { align: 'center' });
  doc.fontSize(11).font('Helvetica').text(scope, { align: 'center' });
  if (dateRange) doc.text(dateRange, { align: 'center' });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown();

  const statusCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  blotters.forEach(b => {
    const s = b.status ?? 'unknown';
    statusCounts[s] = (statusCounts[s] ?? 0) + 1;
    const t = b.incident?.type ?? 'Unknown';
    typeCounts[t] = (typeCounts[t] ?? 0) + 1;
  });

  doc.font('Helvetica-Bold').text('SUMMARY STATISTICS');
  doc.moveDown(0.3);
  doc.font('Helvetica').text(`Total Blotters: ${blotters.length}`);
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').text('By Status:');
  Object.entries(statusCounts).forEach(([status, count]) => {
    doc.font('Helvetica').text(`  ${status.replace(/_/g, ' ').toUpperCase()}: ${count}`);
  });
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').text('By Incident Type:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    doc.font('Helvetica').text(`  ${type}: ${count}`);
  });
  doc.moveDown();

  doc.font('Helvetica-Bold').text('BLOTTER RECORDS', { align: 'center' });
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(0.3);

  const colWidths = [100, 80, 100, 130, 80];
  const headers = ['Blotter No.', 'Date', 'Incident Type', 'Complainant', 'Status'];
  let x = 50;
  headers.forEach((h, i) => {
    doc.font('Helvetica-Bold').fontSize(9).text(h, x, doc.y, { width: colWidths[i]!, lineBreak: false });
    x += colWidths[i]!;
  });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(0.3);

  blotters.forEach(b => {
    if (doc.y > 680) doc.addPage();
    x = 50;
    const rowY = doc.y;
    const c = b.complainant as unknown as Record<string, unknown>;
    const cols = [
      b.blotterNumber || 'N/A',
      b.dateRecorded ? new Date(b.dateRecorded).toLocaleDateString('en-PH') : 'N/A',
      b.incident?.type || 'N/A',
      `${(c?.['lastName'] as string) || ''}, ${(c?.['firstName'] as string) || ''}`,
      (b.status || '').replace(/_/g, ' ').toUpperCase()
    ];
    cols.forEach((col, i) => {
      doc.font('Helvetica').fontSize(8).text(col, x, rowY, { width: colWidths[i]!, lineBreak: false });
      x += colWidths[i]!;
    });
    doc.moveDown();
  });

  doc.end();
}
