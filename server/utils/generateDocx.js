import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, BorderStyle, WidthType, AlignmentType
} from 'docx';

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function formatName(person) {
  if (!person) return 'N/A';
  return [person.lastName, person.firstName, person.middleName].filter(Boolean).join(', ');
}

function formatAddress(addr) {
  if (!addr) return 'N/A';
  if (typeof addr === 'string') return addr;
  return [addr.houseNo, addr.street, addr.barangay, addr.municipality, addr.province]
    .filter(Boolean).join(', ');
}

function bold(text) {
  return new TextRun({ text: String(text || ''), bold: true });
}

function normal(text) {
  return new TextRun({ text: String(text || '') });
}

function labelValue(label, value) {
  return new Paragraph({
    children: [bold(label + ': '), normal(value)]
  });
}

function sectionHeader(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 }
  });
}

export async function generateBlotterDocx(blotter, res) {
  const brgy = blotter.barangay;
  const mun = blotter.municipality;
  const prov = blotter.province;

  const children = [
    new Paragraph({
      text: 'Republic of the Philippines',
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 }
    }),
    new Paragraph({
      text: `Province of ${prov?.name || 'Antique'} — Municipality of ${mun?.name || ''} — ${brgy?.name || 'Barangay'}`,
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
    labelValue('Name', formatName(blotter.complainant)),
    labelValue('Sex', blotter.complainant?.sex || 'N/A'),
    labelValue('Age', String(blotter.complainant?.age || 'N/A')),
    labelValue('Civil Status', blotter.complainant?.civilStatus || 'N/A'),
    labelValue('Address', formatAddress(blotter.complainant?.address)),
    labelValue('Contact', blotter.complainant?.contactNumber || 'N/A'),
    labelValue('Occupation', blotter.complainant?.occupation || 'N/A'),
    sectionHeader('RESPONDENT(S)'),
  ];

  const respondents = blotter.respondents || [];
  respondents.forEach((r, idx) => {
    children.push(new Paragraph({ children: [bold(`Respondent ${idx + 1}:`)] }));
    children.push(labelValue('Name', formatName(r)));
    children.push(labelValue('Sex', r.sex || 'N/A'));
    children.push(labelValue('Age', String(r.age || 'N/A')));
    children.push(labelValue('Address', formatAddress(r.address)));
    children.push(labelValue('Contact', r.contactNumber || 'N/A'));
    children.push(labelValue('Relationship', r.relationshipToComplainant || 'N/A'));
  });

  const witnesses = blotter.witnesses || [];
  if (witnesses.length > 0) {
    children.push(sectionHeader('WITNESSES'));
    witnesses.forEach((w, idx) => {
      children.push(new Paragraph({ children: [bold(`Witness ${idx + 1}:`)] }));
      children.push(labelValue('Name', `${w.firstName || ''} ${w.lastName || ''}`));
      children.push(labelValue('Contact', w.contactNumber || 'N/A'));
      children.push(labelValue('Address', w.address || 'N/A'));
      if (w.statement) children.push(labelValue('Statement', w.statement));
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
