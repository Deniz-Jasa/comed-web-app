'use client';

import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-muted-foreground">Account settings coming soon...</p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <p className="text-muted-foreground">Preferences settings coming soon...</p>
        </Card>
      </div>
    </div>
  );
}