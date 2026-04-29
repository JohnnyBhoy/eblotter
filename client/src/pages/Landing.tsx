import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─── Scroll-reveal hook ─────────────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Animated counter ───────────────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal(0.5);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const steps = 40;
    const inc = to / steps;
    const id = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(id); } else { setVal(Math.floor(start)); }
    }, 35);
    return () => clearInterval(id);
  }, [visible, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Reveal wrapper ─────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const officials = [
  { name: 'DIR. JEROME LB. ASUGA', title: 'Regional Director', agency: 'NAPOLCOM Region VI', initials: 'JA' },
  { name: 'PCOL LEA ROSE B. PEÑA', title: 'Provincial Director', agency: 'PNP Antique Provincial Command', initials: 'LP' },
  { name: 'PLTCOL ROBERT R. MANSUETO', title: 'Project Director / DPDO', agency: 'Barangay e-Blotter System', initials: 'RM' },
];

const objectives = [
  { label: 'Crime Data Accuracy', desc: 'Standardized, real-time incident records at every barangay level' },
  { label: 'Crime Prevention', desc: 'Proactive analysis enabling targeted law enforcement actions' },
  { label: 'Rapid Response', desc: 'Timely intervention through centralized incident visibility' },
  { label: 'Community Trust', desc: 'Transparent reporting builds confidence in local governance' },
  { label: 'Resource Allocation', desc: 'Evidence-based deployment of police resources province-wide' },
  { label: 'Policy Making', desc: 'Data-driven decisions backed by accurate, historical records' },
  { label: 'Harmonized Records', desc: 'Seamless sync between barangay logs and PNP station data' },
  { label: 'Empowerment', desc: 'Barangay officials equipped with modern digital tools' },
];

const agencies = [
  { short: 'NAPOLCOM', full: 'National Police Commission Region VI', accent: '#1d4ed8' },
  { short: 'AnPPO', full: 'PNP Antique Provincial Command', accent: '#dc2626' },
  { short: 'DICT', full: 'Dept. of Information & Communications Technology', accent: '#16a34a' },
  { short: 'DILG', full: 'Dept. of Interior and Local Government', accent: '#d97706' },
];

const pilots = [
  { municipality: 'Bugasong', date: 'November 12, 2024', time: '2:15 PM', venue: 'Evacuation Center, Brgy. Ilaya', official: 'Hon. Marvin Rico, SB Member / OIC Municipal Mayor', barangays: 27, details: 'Punong Barangays, Barangay Secretaries, and Peace & Order Kagawads attended. Mr. Combong explained the innovative purpose and legal basis. Live mobile application demonstration was initiated with AnPPO IT and MPS personnel.' },
  { municipality: 'Culasi', date: 'November 26, 2024', time: '9:00 AM', venue: 'Culasi Gymnasium, Brgy. Centro Poblacion', official: 'Hon. Jose Jeffrey Y. Lomugdang, Municipal Mayor', barangays: 44, details: 'Hon. Ariel Dy Buco (Liga ng mga Barangay President), Punong Barangays, Secretaries, and Peace & Order Kagawads attended. Live online demonstration of the web and mobile browser-based application was successfully conducted.' },
  { municipality: 'Tibiao', date: 'November 29, 2024', time: '9:00 AM', venue: 'Tibiao Function Hall', official: 'Hon. Klemens G. Bandoja, Municipal Mayor', barangays: 21, details: 'Launching and pilot testing of the Barangay e-Blotter System was successfully initiated with all 21 barangays participating in the capacity-building session.' },
  { municipality: 'Sebaste', date: 'December 2, 2024', time: '9:00 AM', venue: 'Sebaste, Antique', official: 'Municipal Officials of Sebaste', barangays: 0, details: 'Orientation covering the system\'s purpose, legal basis, application, and benefits. Barangay officials completed hands-on demonstration of the mobile and browser-based application.' },
  { municipality: 'Valderrama', date: 'December 12, 2024', time: '2:00 PM', venue: 'Valderrama Function Hall', official: 'Atty. Jocelyn L. Posadas, Municipal Mayor', barangays: 22, details: 'Launching and pilot testing completed with 22 barangays, concluding the five-municipality pilot rollout across the Province of Antique.' },
];

const timeline = [
  { date: 'Sept 11, 2024', label: 'Agency Coordination', body: 'PLTCOL Mansueto and Mr. Alfonso Combong III coordinated with DICT-Antique and DILG-Antique in San Jose, Antique — aligning four agencies for cohesive province-wide implementation.' },
  { date: 'Oct–Nov 2024', label: 'NAPOLCOM6 Presentation', body: 'System presented to Atty. Jerome LB. Asuga, Regional Director NAPOLCOM VI and technical staff. Actual demonstration conducted and MOA collaboratively drafted.' },
  { date: 'Nov–Dec 2024', label: 'Five-Municipality Pilot', body: 'Successful pilot testing launched sequentially in Bugasong, Culasi, Tibiao, Sebaste, and Valderrama — covering 114+ barangays across the province.' },
  { date: 'Dec 2024', label: 'SP Resolution 707-2024', body: 'MOA reviewed by NAPOLCOM and endorsed to the Sangguniang Panlalawigan. SP Resolution No. 707-2024 approved, authorizing Governor Rhodora J. Cadiao as signatory.' },
  { date: 'Ongoing', label: 'Province-Wide Rollout', body: 'Cascading activities and coordination meetings conducted with all municipal Chiefs of Police for consistent implementation and monitoring across the Province of Antique.' },
];

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Landing() {
  const [openPilot, setOpenPilot] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen bg-[#04091a] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes scan-line {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes grid-fade {
          0%, 100% { opacity: 0.03; }
          50%       { opacity: 0.06; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #e2e8f0 0%, #93c5fd 40%, #ffffff 50%, #93c5fd 60%, #e2e8f0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .glow-blue { box-shadow: 0 0 30px rgba(59,130,246,0.25), 0 0 60px rgba(59,130,246,0.1); }
        .glow-blue-sm { box-shadow: 0 0 15px rgba(59,130,246,0.2); }
        .border-glow { border-color: rgba(59,130,246,0.4); }
        .card-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .card-glass:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(59,130,246,0.3);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(59,130,246,0.15);
        }
        .card-glass { transition: all 0.3s ease; }
        .dot-grid {
          background-image: radial-gradient(rgba(99,179,237,0.15) 1px, transparent 1px);
          background-size: 32px 32px;
          animation: grid-fade 6s ease-in-out infinite;
        }
        .tag-pill {
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.3);
          color: #93c5fd;
          letter-spacing: 0.12em;
        }
        .line-accent {
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          height: 1px;
        }
        .timeline-dot::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(59,130,246,0.4);
          animation: pulse-ring 2.5s ease-out infinite;
        }
      `}</style>

      {/* ── Sticky Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(4,9,26,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <IconShield />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">Barangay e-Blotter</span>
              <span className="hidden sm:inline text-blue-400 text-xs ml-1.5">/ Antique</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden md:block">Republic of the Philippines</span>
            <span className="hidden md:block text-slate-600">·</span>
            <span className="hidden md:block">NAPOLCOM Region VI</span>
            <Link
              to="/login"
              className="ml-4 px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}
            >
              Sign In →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(29,78,216,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to top, #04091a, transparent)' }} />

        {/* Floating orbs */}
        <div className="absolute top-32 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', animation: 'float 7s ease-in-out infinite' }} />
        <div className="absolute bottom-40 right-1/4 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', animation: 'float 9s ease-in-out infinite 2s' }} />

        <div className="relative max-w-4xl mx-auto text-center">

          <div className="tag-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{ opacity: 0, animation: 'none' }}
            ref={(el) => { if (el) setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 100); }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
            JOINT INITIATIVE · NAPOLCOM VI &amp; PNP ANTIQUE
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-none tracking-tight mb-6"
            style={{ opacity: 0, transform: 'translateY(30px)', animation: 'none' }}
            ref={(el) => { if (el) setTimeout(() => { el.style.transition = 'all 0.8s ease 0.1s'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50); }}
          >
            <span className="shimmer-text">Barangay</span>
            <br />
            <span className="text-white">e-Blotter</span>
            <br />
            <span className="text-blue-400" style={{ fontSize: '0.55em', letterSpacing: '0.05em', fontWeight: 700 }}>PROVINCE OF ANTIQUE</span>
          </h1>

          <p
            className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
            ref={(el) => { if (el) setTimeout(() => { el.style.transition = 'all 0.8s ease 0.3s'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50); }}
          >
            A unified digital platform harmonizing barangay crime records with PNP station data —
            enabling <span className="text-blue-400 font-medium">real-time visibility</span>, accurate reporting, and evidence-based law enforcement across all 5 pilot municipalities.
          </p>

          {/* Stats row */}
          <div
            className="flex flex-wrap justify-center gap-px mb-12"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
            ref={(el) => { if (el) setTimeout(() => { el.style.transition = 'all 0.8s ease 0.5s'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50); }}
          >
            {[
              { n: 5, suffix: '', label: 'Pilot Municipalities' },
              { n: 4, suffix: '', label: 'Partner Agencies' },
              { n: 114, suffix: '+', label: 'Barangays Covered' },
              { n: 2024, suffix: '', label: 'SP Resolution 707' },
            ].map((s, i) => (
              <div key={i} className="px-8 py-5 text-center" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                <div className="text-3xl font-black text-white tabular-nums">
                  <Counter to={s.n} suffix={s.suffix} />
                </div>
                <div className="text-xs text-slate-500 mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/login"
              className="group px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', boxShadow: '0 8px 32px rgba(37,99,235,0.4)' }}
            >
              Access the System
              <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#about"
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-28 px-4 relative">
        <div className="line-accent w-full absolute top-0 left-0" />
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase">About the Project</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3 leading-tight">
              Modernizing Public Safety<br />
              <span className="text-slate-400 font-normal text-2xl">at the Grassroots Level</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal delay={100}>
              <div className="card-glass rounded-2xl p-8 h-full">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-5">
                  <IconShield />
                </div>
                <h3 className="font-bold text-white mb-3">The Initiative</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <span className="text-blue-400 font-semibold">NAPOLCOM Region VI</span> and the <span className="text-blue-400 font-semibold">Antique Police Provincial Office</span> collaborated to establish a comprehensive crime picture of Antique Province. The system harmonizes barangay crime records with local PNP data, ensuring accurate, timely information across all governance levels.
                </p>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="card-glass rounded-2xl p-8 h-full">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-3">Legal Backing</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The proposed MOA was reviewed by NAPOLCOM and endorsed to the Sangguniang Panlalawigan, resulting in <span className="text-white font-semibold">SP Resolution No. 707-2024</span> — authorizing <span className="text-white font-semibold">Gov. Rhodora J. Cadiao</span> to formally enter into agreement with NAPOLCOM Region VI, PNP Antique, DICT, and DILG for province-wide implementation.
                </p>
              </div>
            </Reveal>
            <Reveal delay={240} className="md:col-span-2">
              <div className="card-glass rounded-2xl p-8">
                <div className="flex flex-wrap gap-8">
                  <div className="flex-1 min-w-48">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Provided</p>
                    <p className="text-white font-bold text-lg">100% FREE</p>
                    <p className="text-slate-400 text-sm mt-1">To all participating barangay units as part of the joint public service initiative.</p>
                  </div>
                  <div className="w-px bg-white/5 hidden md:block" />
                  <div className="flex-1 min-w-48">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Accessible Via</p>
                    <p className="text-white font-bold text-lg">Any Device</p>
                    <p className="text-slate-400 text-sm mt-1">Desktop, laptop, tablet, and mobile phone — web and mobile browser-based.</p>
                  </div>
                  <div className="w-px bg-white/5 hidden md:block" />
                  <div className="flex-1 min-w-48">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Designed For</p>
                    <p className="text-white font-bold text-lg">Barangay Officials</p>
                    <p className="text-slate-400 text-sm mt-1">Punong Barangays, Secretaries, Peace & Order Kagawads, and PNP personnel.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Objectives ── */}
      <section className="py-28 px-4 relative" style={{ background: 'linear-gradient(180deg, #04091a 0%, #060d24 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase">What It Achieves</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Key Objectives</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {objectives.map((obj, i) => (
              <Reveal key={obj.label} delay={i * 60}>
                <div className="card-glass rounded-xl p-5 group cursor-default h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">
                      <IconCheck />
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug">{obj.label}</h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed pl-9">{obj.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Officials ── */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Key Officials</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {officials.map((o, i) => (
              <Reveal key={o.name} delay={i * 100}>
                <div className="relative rounded-2xl p-px overflow-hidden group" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.1), rgba(59,130,246,0.05))' }}>
                  <div className="relative rounded-2xl p-7 text-center h-full" style={{ background: 'linear-gradient(135deg, #0a1628, #0d1f3c)' }}>
                    {/* Glow on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.1), transparent 70%)' }} />
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center font-black text-xl text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
                        {o.initials}
                      </div>
                      <h3 className="font-black text-white text-sm mb-1.5 leading-snug">{o.name}</h3>
                      <p className="text-blue-400 text-xs font-semibold mb-1">{o.title}</p>
                      <p className="text-slate-500 text-xs">{o.agency}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <div className="rounded-xl p-5 text-sm text-slate-400 leading-relaxed" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <span className="text-blue-400 font-semibold">Also recognized — </span>
              Mr. <span className="text-white">Alfonso Combong III</span>, NAPOLCOM Inspector Region 6, instrumental in presenting the legal framework during all pilot training activities. Municipal Information Officer <span className="text-white">Richard Francisco</span> highlighted the system's cross-device accessibility for barangay officials.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Partner Agencies ── */}
      <section className="py-28 px-4" style={{ background: 'linear-gradient(180deg, #04091a 0%, #060d24 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase">Collaboration</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Partner Agencies</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agencies.map((a, i) => (
              <Reveal key={a.short} delay={i * 80}>
                <div className="card-glass rounded-2xl overflow-hidden group text-center">
                  <div className="py-6 px-4" style={{ background: `linear-gradient(135deg, ${a.accent}22, ${a.accent}11)`, borderBottom: `1px solid ${a.accent}33` }}>
                    <span className="text-2xl font-black tracking-tight" style={{ color: a.accent }}>{a.short}</span>
                  </div>
                  <div className="px-4 py-4 text-xs text-slate-400 leading-snug">{a.full}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase">Milestones</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Project Timeline</h2>
          </Reveal>
          <div className="relative">
            {/* Vertical track */}
            <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.4) 10%, rgba(59,130,246,0.2) 90%, transparent)' }} />

            <div className="space-y-6">
              {timeline.map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="relative pl-16">
                    {/* Dot */}
                    <div className="absolute left-2.5 top-5 -translate-x-1/2 timeline-dot">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-[#04091a] flex items-center justify-center" style={{ boxShadow: '0 0 12px rgba(59,130,246,0.5)' }}>
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                    </div>
                    <div className="card-glass rounded-xl p-5 group hover:border-blue-500/30">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' }}>
                          {item.date}
                        </span>
                        <h3 className="font-bold text-white text-sm">{item.label}</h3>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pilot Testing ── */}
      <section className="py-28 px-4" style={{ background: 'linear-gradient(180deg, #04091a 0%, #060d24 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-4">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase">Field Deployment</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Pilot Testing</h2>
          </Reveal>
          <Reveal delay={80} className="mb-10">
            <p className="text-slate-500 text-sm">Successful launching across five municipalities — covering barangay officials, secretaries, and peace & order kagawads.</p>
          </Reveal>
          <div className="space-y-3">
            {pilots.map((p, i) => (
              <Reveal key={p.municipality} delay={i * 60}>
                <div className="rounded-xl overflow-hidden transition-all duration-300" style={{ border: openPilot === i ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.06)', background: openPilot === i ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)' }}>
                  <button
                    className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenPilot(openPilot === i ? null : i)}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0 transition-all duration-300"
                      style={{ background: openPilot === i ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)' : 'rgba(59,130,246,0.1)', color: openPilot === i ? '#fff' : '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white">{p.municipality}</span>
                        {p.barangays > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(59,130,246,0.1)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>
                            {p.barangays} Barangays
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{p.date} · {p.time}</p>
                    </div>
                    <div className="text-slate-500 shrink-0">
                      <IconChevron open={openPilot === i} />
                    </div>
                  </button>

                  <div style={{ maxHeight: openPilot === i ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                    <div className="px-6 pb-6 pt-1 border-t" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
                      <div className="grid md:grid-cols-2 gap-5 mt-4">
                        <div>
                          <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-1.5">Venue</p>
                          <p className="text-slate-300 text-sm">{p.venue}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-1.5">Presided By</p>
                          <p className="text-slate-300 text-sm">{p.official}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-1.5">Activity Summary</p>
                          <p className="text-slate-400 text-sm leading-relaxed">{p.details}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOA Banner ── */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid" style={{ opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(29,78,216,0.15) 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-8 px-4 py-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' }}>
              Memorandum of Agreement
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              SP Resolution<br />
              <span className="shimmer-text">No. 707-2024</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xl mx-auto">
              The Sangguniang Panlalawigan of Antique authorized <span className="text-white font-semibold">Hon. Gov. Rhodora J. Cadiao</span> to formally enter into a Memorandum of Agreement with NAPOLCOM Region VI, PNP Antique, DICT, and DILG for the province-wide implementation of the Barangay e-Blotter System.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'Endorsed By', value: 'National Police Commission' },
                { label: 'Authorized Signatory', value: 'Gov. Rhodora J. Cadiao' },
                { label: 'Resolution', value: 'No. 707-2024' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl px-6 py-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="font-bold text-white text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #04091a 0%, #030712 100%)' }}>
        <div className="line-accent w-full absolute top-0 left-0" />
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Ready to access<br />the system?
            </h2>
            <p className="text-slate-500 mb-10 text-sm">Authorized barangay officials and PNP personnel — use your assigned credentials to log in.</p>
            <Link
              to="/login"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', boxShadow: '0 12px 48px rgba(37,99,235,0.5)' }}
            >
              Sign In to e-Blotter
              <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <IconShield />
            </div>
            <span className="font-bold text-white text-sm">Barangay e-Blotter System</span>
            <span className="text-slate-600 text-xs">— Province of Antique</span>
          </div>
          <p className="text-slate-600 text-xs mb-2">A joint initiative of NAPOLCOM Region VI &amp; PNP Antique Provincial Command in collaboration with DICT and DILG.</p>
          <p className="text-slate-700 text-xs">&copy; 2024–2025 National Police Commission Region VI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
