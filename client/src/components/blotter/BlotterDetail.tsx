import React from 'react';
import StatusBadge from '../common/StatusBadge.js';
import { formatDate } from '../../utils/formatters.js';
import type { Blotter, BlotterPerson, BlotterAddress } from '../../types/index.js';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-[#003366] border-b border-blue-100 pb-1 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="mb-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <p className="text-sm text-gray-800 mt-0.5">{value ?? 'N/A'}</p>
    </div>
  );
}

function formatAddress(addr?: BlotterAddress | string | null): string {
  if (!addr) return 'N/A';
  if (typeof addr === 'string') return addr;
  return [addr.houseNo, addr.street, addr.barangay, addr.municipality, addr.province].filter(Boolean).join(', ');
}

function formatName(person?: BlotterPerson | null): string {
  if (!person) return 'N/A';
  return [person.lastName, person.firstName, person.middleName].filter(Boolean).join(', ');
}

interface BlotterDetailProps {
  blotter?: Blotter | null;
}

export default function BlotterDetail({ blotter }: BlotterDetailProps) {
  if (!blotter) return <div className="text-gray-500 text-sm">Loading blotter details...</div>;

  const b = blotter;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="text-center mb-6 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-500">Republic of the Philippines</p>
        <p className="text-sm text-gray-600">
          Province of {b.province?.name ?? 'Antique'} | Municipality of {b.municipality?.name} | {b.barangay?.name}
        </p>
        <h2 className="text-2xl font-bold text-[#003366] mt-1">BARANGAY BLOTTER</h2>
        <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
          <span className="text-sm font-semibold">Blotter No.: {b.blotterNumber}</span>
          <span className="text-sm text-gray-500">Date Recorded: {formatDate(b.dateRecorded)}</span>
          <StatusBadge status={b.status} />
        </div>
      </div>

      <Section title="Incident Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type" value={b.incident?.type + (b.incident?.otherType ? ` - ${b.incident.otherType}` : '')} />
          <Field label="Date / Time" value={`${formatDate(b.incident?.dateOccurred)}${b.incident?.timeOccurred ? ' at ' + b.incident.timeOccurred : ''}`} />
          <Field label="Place Occurred" value={b.incident?.placeOccurred} />
          <Field label="Motive" value={b.incident?.motive} />
          {b.incident?.weaponOrObjectUsed && <Field label="Weapon/Object" value={b.incident.weaponOrObjectUsed} />}
          {b.incident?.isReferred && <Field label="Referred To" value={`${b.incident.referredTo ?? ''} (${formatDate(b.incident.referredDate)})`} />}
        </div>
        <div className="mt-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Narrative</span>
          <p className="text-sm text-gray-800 mt-1 leading-relaxed whitespace-pre-wrap">{b.incident?.narrative}</p>
        </div>
      </Section>

      <Section title="Complainant">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" value={formatName(b.complainant)} />
          <Field label="Sex" value={b.complainant?.sex} />
          <Field label="Age" value={b.complainant?.age} />
          <Field label="Civil Status" value={b.complainant?.civilStatus} />
          <Field label="Nationality" value={b.complainant?.nationality} />
          <Field label="Occupation" value={b.complainant?.occupation} />
          <Field label="Contact" value={b.complainant?.contactNumber} />
          <Field label="Address" value={formatAddress(b.complainant?.address)} />
          {b.complainant?.idType && <Field label="ID" value={`${b.complainant.idType} - ${b.complainant.idNumber ?? ''}`} />}
        </div>
      </Section>

      <Section title={`Respondents (${(b.respondents ?? []).length})`}>
        {(b.respondents ?? []).length === 0 ? (
          <p className="text-sm text-gray-500 italic">None specified</p>
        ) : (
          b.respondents.map((r, idx) => (
            <div key={idx} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-500 mb-2">Respondent #{idx + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" value={formatName(r)} />
                <Field label="Sex / Age" value={`${r.sex ?? 'N/A'} / ${r.age ?? 'N/A'}`} />
                <Field label="Contact" value={r.contactNumber} />
                <Field label="Relationship" value={r.relationshipToComplainant} />
                <Field label="Address" value={formatAddress(r.address)} />
              </div>
            </div>
          ))
        )}
      </Section>

      {(b.witnesses ?? []).length > 0 && (
        <Section title={`Witnesses (${b.witnesses.length})`}>
          {b.witnesses.map((w, idx) => (
            <div key={idx} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-500 mb-2">Witness #{idx + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" value={`${w.firstName ?? ''} ${w.lastName ?? ''}`.trim()} />
                <Field label="Contact" value={w.contactNumber} />
                <Field label="Address" value={w.address} />
              </div>
              {w.statement && <Field label="Statement" value={w.statement} />}
            </div>
          ))}
        </Section>
      )}

      <Section title="Resolution & Action">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Relief Requested" value={b.reliefRequested} />
          <Field label="Action Taken" value={b.barangayAction?.actionTaken} />
          {b.barangayAction?.settledAmicably && (
            <>
              <Field label="Settlement Date" value={formatDate(b.barangayAction.settlementDate)} />
              <Field label="Settlement Details" value={b.barangayAction.settlementDetails} />
            </>
          )}
          {b.barangayAction?.endorsedToPNP && (
            <>
              <Field label="Endorsed to PNP" value="Yes" />
              <Field label="Endorsement Date" value={formatDate(b.barangayAction.endorsementDate)} />
              <Field label="Reason" value={b.barangayAction.endorsementReason} />
            </>
          )}
        </div>
      </Section>

      <div className="border-t border-gray-200 pt-4 mt-4 grid grid-cols-2 gap-8">
        <div>
          <div className="border-b border-gray-400 w-48 mb-1"></div>
          <p className="text-sm font-semibold">{b.recordedBy?.name ?? 'N/A'}</p>
          <p className="text-xs text-gray-500">{b.recordedBy?.position ?? 'Barangay Official'}</p>
        </div>
        <div>
          <div className="border-b border-gray-400 w-48 mb-1"></div>
          <p className="text-sm font-semibold">Punong Barangay</p>
          <p className="text-xs text-gray-500">Punong Barangay</p>
        </div>
      </div>
    </div>
  );
}
