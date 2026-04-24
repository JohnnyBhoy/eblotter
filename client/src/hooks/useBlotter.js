import { useState } from 'react';
import api from '../utils/api.js';

export default function useBlotter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function call(fn) {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getBlotters: (params) => call(() => api.get('/blotters', { params }).then(r => r.data)),
    getBlotter: (id) => call(() => api.get(`/blotters/${id}`).then(r => r.data)),
    createBlotter: (data) => call(() => api.post('/blotters', data).then(r => r.data)),
    updateBlotter: (id, data) => call(() => api.put(`/blotters/${id}`, data).then(r => r.data)),
    updateStatus: (id, status) => call(() => api.patch(`/blotters/${id}/status`, { status }).then(r => r.data)),
    deleteBlotter: (id) => call(() => api.delete(`/blotters/${id}`).then(r => r.data)),
    getStats: () => call(() => api.get('/blotters/stats').then(r => r.data)),
  };
}
