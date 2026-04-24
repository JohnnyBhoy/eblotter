import React from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function ExportBar({ blotterId, summaryParams }) {
  function download(url) {
    const token = localStorage.getItem('token');
    const a = document.createElement('a');
    a.href = url + (token ? `?token=${token}` : '');
    a.target = '_blank';
    a.click();
  }

  function downloadWithAuth(path) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const disposition = res.headers.get('content-disposition');
        const match = disposition?.match(/filename="(.+)"/);
        const filename = match ? match[1] : 'download';
        return res.blob().then(blob => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(console.error);
  }

  if (blotterId) {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => downloadWithAuth(`/export/blotter/${blotterId}/pdf`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
        >
          📄 Export PDF
        </button>
        <button
          onClick={() => downloadWithAuth(`/export/blotter/${blotterId}/docx`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800 transition"
        >
          📝 Export Word
        </button>
        <button
          onClick={() => downloadWithAuth(`/export/blotter/${blotterId}/excel`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800 transition"
        >
          📊 Export Excel
        </button>
      </div>
    );
  }

  // Summary export
  const qs = summaryParams ? '?' + new URLSearchParams(summaryParams).toString() : '';
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => downloadWithAuth(`/export/summary/pdf${qs}`)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
      >
        📄 Export Summary PDF
      </button>
      <button
        onClick={() => downloadWithAuth(`/export/summary/excel${qs}`)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800 transition"
      >
        📊 Export Summary Excel
      </button>
    </div>
  );
}
