import React from 'react';
import StatusBadge from '../common/StatusBadge.js';
import { formatDate } from '../../utils/formatters.js';
import type { Blotter, BlotterPerson, BlotterAddress } from '../../types/index.js';

function Section({ title, accent = '#3b82f6', children }: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full" style={{ background: `linear-gradient(to bottom,${accent},${accent}88)` }} />
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="mb-2">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{label}</span>
      <p className="text-sm mt-0.5" style={{ color: '#cbd5e1' }}>{value ?? '—'}</p>
    </div>
  );
}

function formatAddress(addr?: BlotterAddress | string | null): string {
  if (!addr) return '—';
  if (typeof addr === 'string') return addr;
  return [addr.houseNo, addr.street, addr.barangay, addr.municipality, addr.province].filter(Boolean).join(', ');
}

function formatName(person?: BlotterPerson | null): string {
  if (!person) return '—';
  return [person.lastName, person.firstName, person.middleName].filter(Boolean).join(', ');
}

interface BlotterDetailProps {
  blotter?: Blotter | null;
}

export default function BlotterDetail({ blotter }: BlotterDetailProps) {
  if (!blotter) return (
    <div className="flex items-center gap-2 py-4" style={{ color: '#475569' }}>
      <div className="w-4 h-4 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      <span className="text-sm">Loading blotter details…</span>
    </div>
  );

  const b = blotter;
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Header */}
      <div className="px-6 py-5 text-center" style={{ background: 'rgba(59,130,246,0.08)', borderBottom: '1px solid rgba(59,130,246,0.15)' }}>
        <p className="text-xs" style={{ color: '#64748b' }}>Republic of the Philippines</p>
        <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
          Province of {b.province?.name ?? 'Antique'} · Municipality of {b.municipality?.name} · {b.barangay?.name}
        </p>
        <h2 className="text-lg font-bold text-white mt-2 tracking-wide">BARANGAY BLOTTER</h2>
        <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
          <span className="text-sm font-bold" style={{ color: '#60a5fa' }}>No. {b.blotterNumber}</span>
          <span className="text-xs" style={{ color: '#64748b' }}>Recorded: {formatDate(b.dateRecorded)}</span>
          <StatusBadge status={b.status} />
        </div>
      </div>

      <div className="px-6 py-5">
        <Section title="Incident Information" accent="#3b82f6">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type" value={b.incident?.type + (b.incident?.otherType ? ` — ${b.incident.otherType}` : '')} />
            <Field label="Date / Time" value={`${formatDate(b.incident?.dateOccurred)}${b.incident?.timeOccurred ? ' at ' + b.incident.timeOccurred : ''}`} />
            <Field label="Place Occurred" value={b.incident?.placeOccurred} />
            <Field label="Motive" value={b.incident?.motive} />
            {b.incident?.weaponOrObjectUsed && <Field label="Weapon / Object" value={b.incident.weaponOrObjectUsed} />}
            {b.incident?.isReferred && <Field label="Referred To" value={`${b.incident.referredTo ?? ''} (${formatDate(b.incident.referredDate)})`} />}
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>Narrative</span>
            <p className="text-sm mt-1.5 leading-relaxed whitespace-pre-wrap p-3 rounded-xl" style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {b.incident?.narrative}
            </p>
          </div>
        </Section>

        <Section title="Complainant" accent="#10b981">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" value={formatName(b.complainant)} />
            <Field label="Sex" value={b.complainant?.sex} />
            <Field label="Age" value={b.complainant?.age} />
            <Field label="Civil Status" value={b.complainant?.civilStatus} />
            <Field label="Nationality" value={b.complainant?.nationality} />
            <Field label="Occupation" value={b.complainant?.occupation} />
            <Field label="Contact" value={b.complainant?.contactNumber} />
            <Field label="Address" value={formatAddress(b.complainant?.address)} />
            {b.complainant?.idType && <Field label="ID" value={`${b.complainant.idType} — ${b.complainant.idNumber ?? ''}`} />}
          </div>
        </Section>

        <Section title={`Respondents (${(b.respondents ?? []).length})`} accent="#f59e0b">
          {(b.respondents ?? []).length === 0 ? (
            <p className="text-xs italic" style={{ color: '#475569' }}>None specified</p>
          ) : (
            b.respondents.map((r, idx) => (
              <div key={idx} className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#64748b' }}>Respondent #{idx + 1}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name" value={formatName(r)} />
                  <Field label="Sex / Age" value={`${r.sex ?? '—'} / ${r.age ?? '—'}`} />
                  <Field label="Contact" value={r.contactNumber} />
                  <Field label="Relationship" value={r.relationshipToComplainant} />
                  <Field label="Address" value={formatAddress(r.address)} />
                </div>
              </div>
            ))
          )}
        </Section>

        {(b.witnesses ?? []).length > 0 && (
          <Section title={`Witnesses (${b.witnesses.length})`} accent="#8b5cf6">
            {b.witnesses.map((w, idx) => (
              <div key={idx} className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#64748b' }}>Witness #{idx + 1}</p>
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

        <Section title="Resolution & Action" accent="#ec4899">
          <div className="grid grid-cols-2 gap-3">
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

        {/* Signature block */}
        <div className="grid grid-cols-2 gap-8 pt-4 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="w-40 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', height: 24 }} />
            <p className="text-sm font-semibold text-white">{b.recordedBy?.name ?? '—'}</p>
            <p className="text-xs" style={{ color: '#475569' }}>{b.recordedBy?.position ?? 'Barangay Official'}</p>
          </div>
          <div>
            <div className="w-40 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', height: 24 }} />
            <p className="text-sm font-semibold text-white">Punong Barangay</p>
            <p className="text-xs" style={{ color: '#475569' }}>Punong Barangay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
