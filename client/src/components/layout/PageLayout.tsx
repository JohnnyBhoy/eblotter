import React from 'react';
import Navbar from './Navbar.js';
import Sidebar from './Sidebar.js';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#04091a', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
