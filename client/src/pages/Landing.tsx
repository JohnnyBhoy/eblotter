import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const officials = [
  {
    name: 'DIR. JEROME LB. ASUGA',
    title: 'Regional Director',
    agency: 'NAPOLCOM Region VI',
    icon: '⭐',
  },
  {
    name: 'PCOL LEA ROSE B. PEÑA',
    title: 'Provincial Director',
    agency: 'PNP Antique Provincial Command',
    icon: '🛡️',
  },
  {
    name: 'PLTCOL ROBERT R. MANSUETO',
    title: 'Project Coordinator / DPDO',
    agency: 'Barangay e-Blotter Project Director',
    icon: '📋',
  },
];

const agencies = [
  { name: 'NAPOLCOM Region VI', short: 'NAPOLCOM', color: 'bg-blue-700' },
  { name: 'PNP Antique Provincial Command', short: 'AnPPO', color: 'bg-red-700' },
  { name: 'Dept. of Information & Communications Technology', short: 'DICT', color: 'bg-green-700' },
  { name: 'Dept. of Interior and Local Government', short: 'DILG', color: 'bg-yellow-600' },
];

const objectives = [
  { icon: '🎯', text: 'Improved crime data accuracy' },
  { icon: '🔍', text: 'Enhanced crime prevention efforts' },
  { icon: '⚡', text: 'Timely intervention and response' },
  { icon: '🤝', text: 'Community engagement and empowerment' },
  { icon: '🏛️', text: 'Trust and confidence building' },
  { icon: '📊', text: 'Targeted resource allocation' },
  { icon: '📑', text: 'Evidence-based policy making' },
  { icon: '🔗', text: 'Harmonized barangay crime records' },
];

const pilots = [
  {
    municipality: 'Bugasong',
    date: 'November 12, 2024 — 2:15 PM',
    venue: 'Evacuation Center, Brgy. Ilaya, Bugasong, Antique',
    official: 'Hon. Marvin Rico, SB Member / OIC Municipal Mayor',
    barangays: 27,
    details:
      'Punong Barangays, Barangay Secretaries, and Peace & Order Kagawads attended. Mr. Combong explained the innovative purpose and legal basis. Actual mobile application demonstration was initiated with AnPPO IT and Bugasong MPS personnel.',
  },
  {
    municipality: 'Culasi',
    date: 'November 26, 2024 — 9:00 AM',
    venue: 'Culasi Gymnasium, Brgy. Centro Poblacion, Culasi, Antique',
    official: 'Hon. Jose Jeffrey Y. Lomugdang, Municipal Mayor',
    barangays: 44,
    details:
      'Hon. Ariel Dy Buco (Liga ng mga Barangay President), Punong Barangays, Barangay Secretaries, and Peace & Order Kagawads attended. Live online demonstration of the web and mobile browser-based application was successfully conducted.',
  },
  {
    municipality: 'Tibiao',
    date: 'November 29, 2024 — 9:00 AM',
    venue: 'Tibiao Function Hall, Tibiao, Antique',
    official: 'Hon. Klemens G. Bandoja, Municipal Mayor',
    barangays: 21,
    details:
      'Launching and pilot testing of the Barangay e-Blotter System was successfully initiated. Barangay officials from all 21 barangays participated in the capacity-building session.',
  },
  {
    municipality: 'Sebaste',
    date: 'December 2, 2024 — 9:00 AM',
    venue: 'Sebaste, Antique',
    official: 'Municipal Officials of Sebaste',
    barangays: 0,
    details:
      'Launching and pilot testing of the Barangay e-Blotter System was conducted. Barangay officials participated in the orientation covering the system\'s purpose, legal basis, application, and benefits.',
  },
  {
    municipality: 'Valderrama',
    date: 'December 12, 2024 — 2:00 PM',
    venue: 'Valderrama Function Hall, Valderrama, Antique',
    official: 'Atty. Jocelyn L. Posadas, Municipal Mayor',
    barangays: 22,
    details:
      'Launching and pilot testing successfully conducted. Barangay officials from all 22 barangays participated, completing the five-municipality pilot rollout across the Province of Antique.',
  },
];

const timeline = [
  {
    date: 'Sept 11, 2024',
    event: 'Agency Coordination',
    description:
      'PLTCOL Mansueto and Mr. Alfonso Combong III coordinated with both DICT-Antique (Salazar St., Brgy. Madrangca, San Jose) and DILG-Antique (Binirayan Hills, Brgy. 5, San Jose) to align efforts for the implementation.',
  },
  {
    date: 'Nov 2024',
    event: 'NAPOLCOM6 Presentation',
    description:
      'Presentation of the Barangay e-Blotter System to Atty. Jerome LB. Asuga, Regional Director of NAPOLCOM Region VI, together with technical staff. Actual system demonstration and collaborative drafting of the MOA were conducted.',
  },
  {
    date: 'Nov–Dec 2024',
    event: 'Pilot Testing — 5 Municipalities',
    description:
      'Successful pilot testing launched in Bugasong, Culasi, Tibiao, Sebaste, and Valderrama. Local government officials, punong barangays, secretaries, and peace & order kagawads participated in each municipality.',
  },
  {
    date: '2024',
    event: 'MOA Review & SP Resolution',
    description:
      'The proposed Memorandum of Agreement was reviewed by NAPOLCOM and endorsed to the Sangguniang Panlalawigan, resulting in the approval of Resolution No. 707-2024 authorizing Gov. Rhodora J. Cadiao to enter into MOA with NAPOLCOM Region VI, PNP Antique, and other national agencies.',
  },
  {
    date: 'Ongoing',
    event: 'Cascading & Follow-up Meetings',
    description:
      'Regular cascading activities and coordination meetings conducted with Chiefs of Police of all municipalities in the province to ensure consistent implementation and progress updates.',
  },
];

export default function Landing() {
  const [openPilot, setOpenPilot] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Top Bar */}
      <div className="bg-[#001f4d] text-white text-xs py-1.5 px-4 text-center tracking-wide">
        Republic of the Philippines &nbsp;|&nbsp; National Police Commission &nbsp;|&nbsp; Province of Antique
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#002d6e] to-[#003f99] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-3xl select-none">
              🛡️
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
                Barangay e-Blotter System
              </h1>
              <p className="text-blue-200 text-sm mt-0.5">Province of Antique &mdash; NAPOLCOM Region VI</p>
            </div>
          </div>
          <div className="md:ml-auto flex gap-3">
            <Link
              to="/login"
              className="bg-white text-[#003366] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition shadow"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-blue-100 text-xs font-semibold px-4 py-1 rounded-full mb-5 tracking-widest uppercase">
            Joint Initiative · NAPOLCOM6 &amp; PNP Antique
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            Harmonizing Barangay Crime Records<br className="hidden md:block" /> Across Antique
          </h2>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            A web and mobile browser-based application provided <span className="text-white font-semibold">FREE</span> to
            all barangay units, enabling real-time incident recording, accurate crime data management,
            and seamless integration with PNP station records.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="bg-white/10 border border-white/20 rounded-lg px-5 py-3 text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-blue-200 text-xs">Pilot Municipalities</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg px-5 py-3 text-center">
              <div className="text-2xl font-bold">4</div>
              <div className="text-blue-200 text-xs">Partner Agencies</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg px-5 py-3 text-center">
              <div className="text-2xl font-bold">114+</div>
              <div className="text-blue-200 text-xs">Barangays Covered</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg px-5 py-3 text-center">
              <div className="text-2xl font-bold">707-2024</div>
              <div className="text-blue-200 text-xs">SP Resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#003366] rounded-full" />
            <h2 className="text-2xl font-bold text-[#003366]">About the Project</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-gray-700 text-sm leading-relaxed">
            <div>
              <p className="mb-4">
                <strong>NAPOLCOM Region VI</strong> and the <strong>Antique Police Provincial Office (PRO6)</strong> collaborated
                to establish a comprehensive crime picture of the Province of Antique. The Barangay e-Blotter System aims
                to harmonize barangay crime records with those of the local PNP, ensuring accurate and timely data across all levels of governance.
              </p>
              <p>
                The system is provided <strong>FREE</strong> to all participating barangays as part of a joint initiative
                between NAPOLCOM Region VI and the PNP Antique Provincial Command, with coordination from <strong>DICT</strong> and <strong>DILG</strong>.
              </p>
            </div>
            <div>
              <p className="mb-4">
                The project was spearheaded under the supervision of <strong>DIR. JEROME LB. ASUGA</strong>, Regional Director of NAPOLCOM 6,
                and <strong>PCOL LEA ROSE B. PEÑA</strong>, Provincial Director of PNP Antique, with <strong>PLTCOL ROBERT R. MANSUETO</strong> serving
                as Project Coordinator.
              </p>
              <p>
                A <strong>Memorandum of Agreement (MOA)</strong> was approved via <strong>SP Resolution No. 707-2024</strong>, authorizing
                Governor Rhodora J. Cadiao to formally enter into agreement with NAPOLCOM Region VI, PNP Antique, and partner national agencies for province-wide implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Objectives */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#003366] rounded-full" />
            <h2 className="text-2xl font-bold text-[#003366]">Key Objectives</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {objectives.map((obj) => (
              <div key={obj.text} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-2">{obj.icon}</div>
                <p className="text-xs text-gray-700 font-medium leading-snug">{obj.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Officials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#003366] rounded-full" />
            <h2 className="text-2xl font-bold text-[#003366]">Key Officials</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {officials.map((o) => (
              <div key={o.name} className="bg-gradient-to-br from-[#003366] to-[#004b99] text-white rounded-2xl p-6 text-center shadow-md">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center text-3xl mx-auto mb-4">{o.icon}</div>
                <h3 className="font-bold text-sm leading-snug mb-1">{o.name}</h3>
                <p className="text-blue-200 text-xs mb-0.5">{o.title}</p>
                <p className="text-blue-300 text-xs">{o.agency}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-gray-700">
            <span className="font-semibold text-[#003366]">Also recognized:</span> Mr. Alfonso Combong III, NAPOLCOM Inspector Region 6 — instrumental in explaining the legal framework and innovative purpose of the project during all pilot training activities. Municipal Information Officer Richard Francisco noted the system is accessible across desktops, laptops, tablets, and mobile phones.
          </div>
        </div>
      </section>

      {/* Partner Agencies */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-[#003366] rounded-full" />
            <h2 className="text-2xl font-bold text-[#003366]">Partner Agencies</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agencies.map((a) => (
              <div key={a.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <div className={`${a.color} text-white text-center py-3 text-lg font-bold tracking-wide`}>{a.short}</div>
                <div className="p-3 text-center text-xs text-gray-600 leading-snug">{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-[#003366] rounded-full" />
            <h2 className="text-2xl font-bold text-[#003366]">Project Timeline</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#003366] text-white flex items-center justify-center text-xs font-bold shadow">{i + 1}</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="bg-[#003366] text-white text-xs font-semibold px-3 py-0.5 rounded-full">{item.date}</span>
                      <h3 className="font-bold text-[#003366] text-sm">{item.event}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Testing */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-[#003366] rounded-full" />
            <h2 className="text-2xl font-bold text-[#003366]">Pilot Testing — 5 Municipalities</h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-5">
            The launching and pilot testing of the Barangay e-Blotter System was successfully conducted across five municipalities in Antique.
          </p>
          <div className="space-y-3">
            {pilots.map((p, i) => (
              <div key={p.municipality} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition"
                  onClick={() => setOpenPilot(openPilot === i ? null : i)}
                >
                  <div className="w-9 h-9 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#003366]">{p.municipality}</span>
                      {p.barangays > 0 && (
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{p.barangays} Barangays</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{p.date}</p>
                  </div>
                  <span className="text-gray-400 text-lg">{openPilot === i ? '▲' : '▼'}</span>
                </button>
                {openPilot === i && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 bg-blue-50/30">
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Venue</p>
                        <p>{p.venue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Presided By</p>
                        <p>{p.official}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Details</p>
                        <p className="leading-relaxed">{p.details}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOA Section */}
      <section className="py-16 px-4 bg-[#003366] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-4">📜</div>
          <h2 className="text-2xl font-bold mb-3">SP Resolution No. 707-2024</h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-2xl mx-auto mb-6">
            The Sangguniang Panlalawigan of Antique approved Resolution No. 707-2024, authorizing
            <strong className="text-white"> Hon. Gov. Rhodora J. Cadiao </strong>
            to enter into a Memorandum of Agreement with NAPOLCOM Region VI, PNP Antique, and other national government agencies for the effective province-wide implementation of the Barangay e-Blotter System.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-3">
            <div className="bg-white/10 border border-white/20 rounded-lg px-5 py-3">
              <p className="text-xs text-blue-300 uppercase tracking-wide mb-0.5">Endorsed By</p>
              <p className="font-semibold text-sm">National Police Commission</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg px-5 py-3">
              <p className="text-xs text-blue-300 uppercase tracking-wide mb-0.5">Authorized Signatory</p>
              <p className="font-semibold text-sm">Gov. Rhodora J. Cadiao</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg px-5 py-3">
              <p className="text-xs text-blue-300 uppercase tracking-wide mb-0.5">Resolution</p>
              <p className="font-semibold text-sm">No. 707-2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-white text-center">
        <h2 className="text-xl font-bold text-[#003366] mb-2">Access the System</h2>
        <p className="text-gray-500 text-sm mb-6">Authorized barangay officials and PNP personnel may log in using their assigned credentials.</p>
        <Link
          to="/login"
          className="inline-block bg-[#003366] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#002147] transition shadow-md"
        >
          Sign In to e-Blotter System →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#001a3d] text-blue-300 text-xs py-8 px-4 text-center">
        <p className="font-semibold text-white mb-1">Barangay e-Blotter System &mdash; Province of Antique</p>
        <p className="mb-3">A joint initiative of NAPOLCOM Region VI &amp; PNP Antique Provincial Command in collaboration with DICT and DILG.</p>
        <p className="text-blue-400">&copy; 2024–2025 National Police Commission Region VI. All rights reserved.</p>
      </footer>
    </div>
  );
}
