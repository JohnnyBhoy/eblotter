export function formatDate(date?: string | Date | null): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatDateTime(date?: string | Date | null): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatStatus(status?: string | null): string {
  if (!status) return 'N/A';
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function statusColor(status?: string | null): string {
  const map: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    recorded: 'bg-blue-100 text-blue-700',
    under_mediation: 'bg-yellow-100 text-yellow-700',
    settled: 'bg-green-100 text-green-700',
    referred_to_pnp: 'bg-orange-100 text-orange-700',
    closed: 'bg-slate-100 text-slate-700',
  };
  return (status && map[status]) || 'bg-gray-100 text-gray-700';
}
