import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
function formatDate(date) {
    if (!date)
        return 'N/A';
    return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}
function formatName(person) {
    if (!person)
        return 'N/A';
    return [person['lastName'], person['firstName'], person['middleName']].filter(Boolean).join(', ');
}
function formatAddress(addr) {
    if (!addr)
        return 'N/A';
    if (typeof addr === 'string')
        return addr;
    return [addr['houseNo'], addr['street'], addr['barangay'], addr['municipality'], addr['province']]
        .filter(Boolean).join(', ');
}
function bold(text) {
    return new TextRun({ text: String(text ?? ''), bold: true });
}
function normal(text) {
    return new TextRun({ text: String(text ?? '') });
}
function labelValue(label, value) {
    return new Paragraph({ children: [bold(label + ': '), normal(value)] });
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
            text: `Province of ${prov?.['name'] || 'Antique'} — Municipality of ${mun?.['name'] || ''} — ${brgy?.['name'] || 'Barangay'}`,
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
    const c = blotter.complainant;
    children.push(labelValue('Name', formatName(c)));
    children.push(labelValue('Sex', c?.['sex'] || 'N/A'));
    children.push(labelValue('Age', String(c?.['age'] || 'N/A')));
    children.push(labelValue('Civil Status', c?.['civilStatus'] || 'N/A'));
    children.push(labelValue('Address', formatAddress(c?.['address'])));
    children.push(labelValue('Contact', c?.['contactNumber'] || 'N/A'));
    children.push(labelValue('Occupation', c?.['occupation'] || 'N/A'));
    children.push(sectionHeader('RESPONDENT(S)'));
    const respondents = blotter.respondents || [];
    respondents.forEach((r, idx) => {
        const rd = r;
        children.push(new Paragraph({ children: [bold(`Respondent ${idx + 1}:`)] }));
        children.push(labelValue('Name', formatName(rd)));
        children.push(labelValue('Sex', rd['sex'] || 'N/A'));
        children.push(labelValue('Age', String(rd['age'] || 'N/A')));
        children.push(labelValue('Address', formatAddress(rd['address'])));
        children.push(labelValue('Contact', rd['contactNumber'] || 'N/A'));
        children.push(labelValue('Relationship', rd['relationshipToComplainant'] || 'N/A'));
    });
    const witnesses = blotter.witnesses || [];
    if (witnesses.length > 0) {
        children.push(sectionHeader('WITNESSES'));
        witnesses.forEach((w, idx) => {
            const wd = w;
            children.push(new Paragraph({ children: [bold(`Witness ${idx + 1}:`)] }));
            children.push(labelValue('Name', `${wd['firstName'] || ''} ${wd['lastName'] || ''}`));
            children.push(labelValue('Contact', wd['contactNumber'] || 'N/A'));
            children.push(labelValue('Address', wd['address'] || 'N/A'));
            if (wd['statement'])
                children.push(labelValue('Statement', wd['statement']));
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
//# sourceMappingURL=generateDocx.js.map