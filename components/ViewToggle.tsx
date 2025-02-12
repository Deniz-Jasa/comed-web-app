'use client';

import { useViewStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function ViewToggle() {
  const { isPhysicianView, toggleView } = useViewStore();

  return (
    <div className="border-t p-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={!isPhysicianView ? "default" : "outline"}
          className="h-10"
          onClick={() => isPhysicianView && toggleView()}
        >
          Nurse
        </Button>
        <Button
          variant={isPhysicianView ? "default" : "outline"}
          className="h-10"
          onClick={() => !isPhysicianView && toggleView()}
        >
          Physician
        </Button>
      </div>
    </div>
  );
}