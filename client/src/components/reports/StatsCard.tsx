import React from 'react';

interface StatsCardProps {
  label: string;
  value?: number | string | null;
  icon?: React.ReactNode;
  color?: string;
  sub?: string;
}

export default function StatsCard({ label, value, icon, color = 'bg-[#003366]', sub }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      {icon && (
        <div className={`${color} text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl flex-shrink-0`}>
          {icon}
        </div>
      )}
      <div>
        <div className="text-2xl font-bold text-gray-900">{value ?? '—'}</div>
        <div className="text-sm text-gray-500">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
