import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';
import { formatDate } from '../../utils/formatters.js';

const INCIDENT_TYPES = [
  'Physical Injury', 'Theft', 'Robbery', 'Estafa / Fraud',
  'Threat / Intimidation', 'Unjust Vexation', 'Trespassing',
  'Oral Defamation / Slander', 'Domestic Violence',
  'Drug-Related Incident', 'Noise Disturbance',
  'Property Damage', 'Missing Person', 'Other'
];

const STATUSES = ['draft', 'recorded', 'under_mediation', 'settled', 'referred_to_pnp', 'closed'];

export default function BlotterTable({
  blotters = [],
  total = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  onFilterChange,
  viewPath = '',
  readOnly = false,
  onEdit,
}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [incidentType, setIncidentType] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    onFilterChange && onFilterChange({ search, status, incidentType, page: 1 });
  }

  function handleFilter(key, value) {
    const next = { search, status, incidentType, [key]: value, page: 1 };
    if (key === 'status') setStatus(value);
    if (key === 'incidentType') setIncidentType(value);
    onFilterChange && onFilterChange(next);
  }

  const selectClass = 'border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#003366]';

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-64">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
            placeholder="Search blotter no., complainant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="px-3 py-1.5 bg-[#003366] text-white rounded-lg text-sm hover:bg-[#002147]">Search</button>
        </form>
        <select className={selectClass} value={status} onChange={e => handleFilter('status', e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select className={selectClass} value={incidentType} onChange={e => handleFilter('incidentType', e.target.value)}>
          <option value="">All Types</option>
          {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-[#003366] text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Blotter No.</th>
              <th className="px-4 py-3 text-left">Barangay</th>
              <th className="px-4 py-3 text-left">Incident Type</th>
              <th className="px-4 py-3 text-left">Complainant</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blotters.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No blotters found.</td>
              </tr>
            ) : blotters.map((b, idx) => (
              <tr key={b._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-[#003366]">{b.blotterNumber}</td>
                <td className="px-4 py-3 text-gray-600">{b.barangay?.name || 'N/A'}</td>
                <td className="px-4 py-3">{b.incident?.type}</td>
                <td className="px-4 py-3">
                  {b.complainant ? `${b.complainant.lastName}, ${b.complainant.firstName}` : 'N/A'}
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(b.dateRecorded)}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {viewPath && (
                      <Link to={`${viewPath}/${b._id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">View</Link>
                    )}
                    {!readOnly && onEdit && (
                      <button onClick={() => onEdit(b)} className="text-xs text-orange-600 hover:text-orange-800 font-medium">Edit</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">Showing {blotters.length} of {total} records</span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange && onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              ‹ Prev
            </button>
            <span className="px-3 py-1.5 text-sm">Page {page} of {totalPages}</span>
            <button
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
