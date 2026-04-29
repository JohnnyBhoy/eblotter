import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: danger ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.12)', border: danger ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(59,130,246,0.25)' }}>
            {danger ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" style={{ color: '#f87171' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <p className="text-sm leading-relaxed mt-1" style={{ color: '#cbd5e1' }}>{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', background: 'transparent' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={danger
              ? { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 4px 20px rgba(220,38,38,0.35)' }
              : { background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
