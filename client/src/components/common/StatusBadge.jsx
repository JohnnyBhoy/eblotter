import React from 'react';
import { statusColor, formatStatus } from '../../utils/formatters.js';

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(status)}`}>
      {formatStatus(status)}
    </span>
  );
}
