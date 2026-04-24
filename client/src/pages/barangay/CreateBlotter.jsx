import React from 'react';
import PageLayout from '../../components/layout/PageLayout.jsx';
import BlotterForm from '../../components/blotter/BlotterForm.jsx';

export default function CreateBlotter() {
  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Create New Blotter</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in all required fields to record a new blotter entry.</p>
      </div>
      <BlotterForm />
    </PageLayout>
  );
}
