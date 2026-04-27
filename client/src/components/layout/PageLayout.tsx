import React from 'react';
import Navbar from './Navbar.js';
import Sidebar from './Sidebar.js';
import Footer from './Footer.js';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
