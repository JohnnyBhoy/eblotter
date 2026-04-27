import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import BlotterTable from '../../components/reports/BlotterTable.js';
import ExportBar from '../../components/reports/ExportBar.js';
import api from '../../utils/api.js';
import type { Blotter } from '../../types/index.js';

interface BlotterListData {
  blotters: Blotter[];
  total: number;
  page: number;
  totalPages: number;
}

interface Filters {
  page: number;
  limit: number;
  [key: string]: unknown;
}

export default function BarangayBlotterList() {
  const [data, setData] = useState<BlotterListData>({ blotters: [], total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);

  const load = useCallback((params: Filters) => {
    setLoading(true);
    api.get<BlotterListData>('/blotters', { params })
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(filters); }, []);

  function handleFilter(newFilters: Partial<Filters>) {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    load(merged);
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">My Blotters</h1>
        <div className="flex items-center gap-3">
          <ExportBar summaryParams={{}} />
          <Link to="/barangay/blotters/create" className="bg-[#003366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002147] transition">
            + Create New
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <BlotterTable
          blotters={data.blotters}
          total={data.total}
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={p => handleFilter({ page: p })}
          onFilterChange={handleFilter}
          viewPath="/barangay/blotters"
          readOnly={false}
        />
      )}
    </PageLayout>
  );
}
