import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.js';
import { formatDate } from '../../utils/formatters.js';
import type { Blotter } from '../../types/index.js';

interface BlotterCardProps {
  blotter: Blotter;
  basePath?: string;
}

export default function BlotterCard({ blotter, basePath = '' }: BlotterCardProps) {
  const name = blotter.complainant
    ? `${blotter.complainant.lastName}, ${blotter.complainant.firstName}`
    : 'N/A';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="font-bold text-[#003366] text-sm">{blotter.blotterNumber}</span>
        <StatusBadge status={blotter.status} />
      </div>
      <div className="text-sm text-gray-800 font-medium mb-1">{blotter.incident?.type}</div>
      <div className="text-xs text-gray-500 mb-1">Complainant: {name}</div>
      <div className="text-xs text-gray-500 mb-3">{formatDate(blotter.dateRecorded)}</div>
      <Link
        to={`${basePath}/${blotter._id}`}
        className="inline-block text-xs bg-[#003366] text-white px-3 py-1.5 rounded-lg hover:bg-[#002147] transition"
      >
        View Details
      </Link>
    </div>
  );
}
