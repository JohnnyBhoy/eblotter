import ExcelJS from 'exceljs';
import type { Response } from 'express';
import type { IBlotterDocument } from '../models/Blotter.js';

const statusColors: Record<string, string> = {
  draft: 'FFD3D3D3',
  recorded: 'FFBFDBFE',
  under_mediation: 'FFFEF08A',
  settled: 'FFBBF7D0',
  referred_to_pnp: 'FFFDE68A',
  closed: 'FFE2E8F0',
};

const headerStyle: Partial<ExcelJS.Style> = {
  font: { bold: true, color: { argb: 'FFFFFFFF' } },
  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } } as ExcelJS.FillPattern,
  alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
  border: {
    top: { style: 'thin' }, left: { style: 'thin' },
    bottom: { style: 'thin' }, right: { style: 'thin' }
  }
};

export async function generateBlotterExcel(blotter: IBlotterDocument, res: Response): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Barangay e-Blotter System';
  wb.created = new Date();

  const ws = wb.addWorksheet('Blotter Details');
  ws.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 60 }
  ];

  const titleRow = ws.getRow(1);
  titleRow.getCell(1).value = `Barangay Blotter - ${blotter.blotterNumber}`;
  (titleRow.getCell(1) as ExcelJS.Cell).font = { bold: true, size: 14 };
  ws.mergeCells('A1:B1');
  ws.getRow(1).height = 30;

  const brgy = blotter.barangay as Record<string, unknown>;
  const mun = blotter.municipality as Record<string, unknown>;
  const prov = blotter.province as Record<string, unknown>;
  const c = blotter.complainant as unknown as Record<string, unknown>;

  const addRow = (field: string, value: unknown): void => {
    const row = ws.addRow({ field, value: value ?? 'N/A' });
    (row.getCell(1) as ExcelJS.Cell).font = { bold: true };
    (row.getCell(1) as ExcelJS.Cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } } as ExcelJS.FillPattern;
  };

  addRow('Blotter Number', blotter.blotterNumber);
  addRow('Date Recorded', blotter.dateRecorded ? new Date(blotter.dateRecorded).toLocaleDateString('en-PH') : 'N/A');
  addRow('Status', blotter.status);
  addRow('Barangay', brgy?.['name']);
  addRow('Municipality', mun?.['name']);
  addRow('Province', prov?.['name']);
  ws.addRow({});
  addRow('Incident Type', blotter.incident?.type);
  addRow('Date of Incident', blotter.incident?.dateOccurred ? new Date(blotter.incident.dateOccurred).toLocaleDateString('en-PH') : 'N/A');
  addRow('Time of Incident', blotter.incident?.timeOccurred);
  addRow('Place of Incident', blotter.incident?.placeOccurred);
  addRow('Narrative', blotter.incident?.narrative);
  ws.addRow({});
  addRow('Complainant Name', `${(c?.['lastName'] as string) || ''}, ${(c?.['firstName'] as string) || ''} ${(c?.['middleName'] as string) || ''}`);
  addRow('Complainant Sex', c?.['sex']);
  addRow('Complainant Age', c?.['age']);
  const cAddr = c?.['address'] as Record<string, unknown> | undefined;
  addRow('Complainant Address', [cAddr?.['barangay'], cAddr?.['municipality'], cAddr?.['province']].filter(Boolean).join(', '));
  addRow('Complainant Contact', c?.['contactNumber']);
  ws.addRow({});
  addRow('Number of Respondents', (blotter.respondents || []).length);
  addRow('Referred to PNP', blotter.barangayAction?.endorsedToPNP ? 'Yes' : 'No');
  addRow('Recorded By', blotter.recordedBy?.name);
  addRow('Position', blotter.recordedBy?.position);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="blotter-${blotter.blotterNumber}.xlsx"`);
  await wb.xlsx.write(res);
  res.end();
}

export async function generateSummaryExcel(
  blotters: IBlotterDocument[],
  scope: string,
  dateRange: string | null,
  res: Response,
  provincialMode = false
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Barangay e-Blotter System';
  wb.created = new Date();

  const summaryWs = wb.addWorksheet('Summary');
  summaryWs.mergeCells('A1:C1');
  const titleCell = summaryWs.getCell('A1');
  titleCell.value = 'BARANGAY BLOTTER SUMMARY REPORT';
  titleCell.font = { bold: true, size: 14 };
  titleCell.alignment = { horizontal: 'center' };
  summaryWs.getRow(1).height = 30;
  summaryWs.getCell('A2').value = scope;
  (summaryWs.getCell('A2') as ExcelJS.Cell).font = { bold: true };
  if (dateRange) summaryWs.getCell('A3').value = dateRange;

  summaryWs.addRow([]);
  const statsHeader = summaryWs.addRow(['Incident Type', 'Count', '% of Total']);
  statsHeader.eachCell(cell => {
    (cell as ExcelJS.Cell).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    (cell as ExcelJS.Cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } } as ExcelJS.FillPattern;
    (cell as ExcelJS.Cell).alignment = { horizontal: 'center' };
  });

  const typeCounts: Record<string, number> = {};
  blotters.forEach(b => {
    const t = b.incident?.type || 'Unknown';
    typeCounts[t] = (typeCounts[t] ?? 0) + 1;
  });
  const total = blotters.length;
  Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    summaryWs.addRow([type, count, total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '0%']);
  });
  summaryWs.addRow(['TOTAL', total, '100%']).eachCell(cell => {
    (cell as ExcelJS.Cell).font = { bold: true };
  });
  summaryWs.columns = [{ width: 30 }, { width: 12 }, { width: 15 }];

  const recordsWs = wb.addWorksheet('Blotter Records');
  const headers = [
    'Blotter No.', 'Date Recorded', 'Barangay', 'Municipality', 'Province',
    'Incident Type', 'Date of Incident', 'Place', 'Complainant Name',
    'No. of Respondents', 'Status', 'Referred to PNP', 'Recorded By'
  ];
  const headerRow = recordsWs.addRow(headers);
  headerRow.eachCell(cell => Object.assign(cell, headerStyle));
  recordsWs.getRow(1).height = 30;
  recordsWs.autoFilter = { from: 'A1', to: 'M1' };
  recordsWs.views = [{ state: 'frozen', ySplit: 1 }];

  blotters.forEach((b, idx) => {
    const c = b.complainant as unknown as Record<string, unknown>;
    const brgy = b.barangay as Record<string, unknown>;
    const mun = b.municipality as Record<string, unknown>;
    const prov = b.province as Record<string, unknown>;
    const row = recordsWs.addRow([
      b.blotterNumber || 'N/A',
      b.dateRecorded ? new Date(b.dateRecorded).toLocaleDateString('en-PH') : 'N/A',
      (brgy?.['name'] as string) || 'N/A',
      (mun?.['name'] as string) || 'N/A',
      (prov?.['name'] as string) || 'N/A',
      b.incident?.type || 'N/A',
      b.incident?.dateOccurred ? new Date(b.incident.dateOccurred).toLocaleDateString('en-PH') : 'N/A',
      b.incident?.placeOccurred || 'N/A',
      `${(c?.['lastName'] as string) || ''}, ${(c?.['firstName'] as string) || ''}`.trim() || 'N/A',
      (b.respondents || []).length,
      (b.status || 'recorded').replace(/_/g, ' ').toUpperCase(),
      b.barangayAction?.endorsedToPNP ? 'Yes' : 'No',
      b.recordedBy?.name || 'N/A'
    ]);

    const bgColor = idx % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC';
    row.eachCell(cell => {
      (cell as ExcelJS.Cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } } as ExcelJS.FillPattern;
    });

    const statusCell = row.getCell(11) as ExcelJS.Cell;
    const statusKey = b.status || 'recorded';
    if (statusColors[statusKey]) {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusColors[statusKey]! } } as ExcelJS.FillPattern;
    }
  });

  recordsWs.columns = [
    { width: 22 }, { width: 14 }, { width: 18 }, { width: 16 }, { width: 14 },
    { width: 22 }, { width: 16 }, { width: 25 }, { width: 22 },
    { width: 10 }, { width: 18 }, { width: 14 }, { width: 20 }
  ];

  if (provincialMode) {
    const munWs = wb.addWorksheet('Municipality Breakdown');
    const incidentTypes = [...new Set(blotters.map(b => b.incident?.type).filter((t): t is string => Boolean(t)))];
    const munHeaders = ['Municipality', 'Total Blotters', ...incidentTypes, '% of Province Total'];
    const munHeaderRow = munWs.addRow(munHeaders);
    munHeaderRow.eachCell(cell => Object.assign(cell, headerStyle));

    const munData: Record<string, Record<string, number>> = {};
    blotters.forEach(b => {
      const mun = b.municipality as Record<string, unknown>;
      const munName = (mun?.['name'] as string) || 'Unknown';
      if (!munData[munName]) munData[munName] = { total: 0 };
      munData[munName]!['total'] = (munData[munName]!['total'] ?? 0) + 1;
      const t = b.incident?.type || 'Unknown';
      munData[munName]![t] = (munData[munName]![t] ?? 0) + 1;
    });

    Object.entries(munData).forEach(([mun, data]) => {
      const row = [mun, data['total'] ?? 0, ...incidentTypes.map(t => data[t] ?? 0), total > 0 ? `${(((data['total'] ?? 0) / total) * 100).toFixed(1)}%` : '0%'];
      munWs.addRow(row);
    });
    munWs.columns = [{ width: 20 }, { width: 14 }, ...incidentTypes.map(() => ({ width: 20 })), { width: 18 }];
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="summary-report.xlsx"`);
  await wb.xlsx.write(res);
  res.end();
}
