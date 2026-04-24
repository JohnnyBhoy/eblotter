import React, { useEffect, useState, useCallback } from 'react';
import PageLayout from '../../components/layout/PageLayout.jsx';
import BlotterTable from '../../components/reports/BlotterTable.jsx';
import ExportBar from '../../components/reports/ExportBar.jsx';
import api from '../../utils/api.js';

export default function SuperAdminBlotterList() {
  const [data, setData] = useState({ blotters: [], total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);

  const load = useCallback((params) => {
    setLoading(true);
    api.get('/blotters', { params }).then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(filters); }, []);

  function handleFilter(newFilters) {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    load(merged);
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">All Blotters (System-Wide)</h1>
        <ExportBar summaryParams={{}} />
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
          viewPath="/superadmin/blotters"
          readOnly
        />
      )}
    </PageLayout>
  );
}
