import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f4d] to-[#003366] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-[#003366] mb-3">Forgot Password</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Password resets are managed by your system administrator. Please contact your supervisor or the IT administrator to have your password reset.
        </p>
        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 mb-6">
          System Administrator Contact: <br />
          <span className="font-semibold">superadmin@eblotter.pnp.gov.ph</span>
        </div>
        <Link to="/login" className="text-sm text-[#003366] hover:text-[#002147] font-medium">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
