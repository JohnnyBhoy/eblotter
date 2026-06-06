import React from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import BlotterForm from '../../components/blotter/BlotterForm.js';

export default function CreateBlotter() {
  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Create New Blotter</h1>
        <p className="text-sm text-slate-400 mt-1">Fill in all required fields to record a new blotter entry.</p>
      </div>
      <BlotterForm />
    </PageLayout>
  );
}
