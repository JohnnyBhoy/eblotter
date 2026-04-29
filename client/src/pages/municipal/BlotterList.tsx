import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import BlotterTable from '../../components/reports/BlotterTable.js';
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

export default function MunicipalBlotterList() {
  const [data, setData] = useState<BlotterListData>({ blotters: [], total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);

  const load = useCallback((params: Filters) => {
    setLoading(true);
    api.get<BlotterListData>('/blotters', { params }).then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(filters); }, []);

  function handleFilter(newFilters: Partial<Filters>) {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    load(merged);
  }

  return (
    <PageLayout>
      <h1 className="text-xl font-bold text-white mb-6">Municipal Blotters</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"></div></div>
      ) : (
        <BlotterTable
          blotters={data.blotters}
          total={data.total}
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={p => handleFilter({ page: p })}
          onFilterChange={handleFilter}
          viewPath="/municipal/blotters"
          readOnly
        />
      )}
    </PageLayout>
  );
}
