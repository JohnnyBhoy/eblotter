import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-2 text-center text-xs text-gray-500">
      Barangay e-Blotter System | Province of Antique &nbsp;|&nbsp; &copy; {new Date().getFullYear()} PNP
    </footer>
  );
}
