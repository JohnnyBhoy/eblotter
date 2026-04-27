import { useState } from 'react';
import axios from 'axios';
import api from '../utils/api.js';
import type { Blotter, DashboardStats, PaginatedResponse } from '../types/index.js';

interface BlotterQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  incidentType?: string;
  search?: string;
  barangayId?: string;
  municipalityId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface BlotterListResponse {
  blotters: Blotter[];
  total: number;
  page: number;
  totalPages: number;
}

export default function useBlotter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call<T>(fn: () => Promise<T>): Promise<T> {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'An error occurred'
        : 'An error occurred';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getBlotters: (params?: BlotterQueryParams) =>
      call(() => api.get<BlotterListResponse>('/blotters', { params }).then(r => r.data)),
    getBlotter: (id: string) =>
      call(() => api.get<Blotter>(`/blotters/${id}`).then(r => r.data)),
    createBlotter: (data: unknown) =>
      call(() => api.post<Blotter>('/blotters', data).then(r => r.data)),
    updateBlotter: (id: string, data: unknown) =>
      call(() => api.put<Blotter>(`/blotters/${id}`, data).then(r => r.data)),
    updateStatus: (id: string, status: string) =>
      call(() => api.patch<Blotter>(`/blotters/${id}/status`, { status }).then(r => r.data)),
    deleteBlotter: (id: string) =>
      call(() => api.delete<{ message: string }>(`/blotters/${id}`).then(r => r.data)),
    getStats: () =>
      call(() => api.get<DashboardStats>('/blotters/stats').then(r => r.data)),
  };
}
