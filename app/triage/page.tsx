'use client';

import { NurseDashboard } from '@/components/NurseDashboard';

export default function TriagePage() {
  return (
    <div className="h-full">
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold">Triage Patients</h1>
      </div>
      <div className="px-8">
        <NurseDashboard />
      </div>
    </div>
  );
}