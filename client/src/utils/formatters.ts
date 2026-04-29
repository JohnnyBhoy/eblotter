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
    draft: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    recorded: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    under_mediation: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    settled: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    referred_to_pnp: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    closed: 'bg-slate-600/30 text-slate-400 border border-slate-600/30',
  };
  return (status && map[status]) || 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
}
