'use client';

import { PhysicianDashboard } from '@/components/PhysicianDashboard';

export default function ConsultationsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Consultations</h1>
      <PhysicianDashboard />
    </div>
  );
}