'use client';

import { useState } from 'react';
import { PatientForm } from '@/components/PatientForm';
import { PatientTable } from '@/components/PatientTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockPatients } from '@/lib/data';

type SortField = 'triage' | 'confidence' | 'time' | 'name' | 'age';

export default function PatientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [triageFilter, setTriageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortField[]>(['triage', 'confidence', 'time']);

  const filteredAndSortedPatients = [...mockPatients]
    // Filter by search query
    .filter(patient => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(query) ||
        patient.symptoms.some(s => s.toLowerCase().includes(query)) ||
        patient.medicalHistory.toLowerCase().includes(query)
      );
    })
    // Filter by triage level
    .filter(patient => {
      if (triageFilter === 'all') return true;
      return patient.triageLevel === triageFilter;
    })
    // Sort based on selected criteria
    .sort((a, b) => {
      for (const field of sortBy) {
        let comparison = 0;

        switch (field) {
          case 'triage':
            const triageOrder: Record<string, number> = {
              level1: 5,
              level2: 4,
              level3: 3,
              level4: 2,
              level5: 1
            };
            comparison = (triageOrder[b.triageLevel] ?? 0) - (triageOrder[a.triageLevel] ?? 0);
            break;
          case 'confidence':
            comparison = (b.aiConfidence ?? 0) - (a.aiConfidence ?? 0);
            break;
          case 'time':
            comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'age':
            comparison = a.age - b.age;
            break;
        }

        if (comparison !== 0) return comparison;
      }
      return 0;
    });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-4">
            <Select value={triageFilter} onValueChange={setTriageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by triage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="level1">Level 1</SelectItem>
                <SelectItem value="level2">Level 2</SelectItem>
                <SelectItem value="level3">Level 3</SelectItem>
                <SelectItem value="level4">Level 4</SelectItem>
                <SelectItem value="level5">Level 5</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy[0]}
              onValueChange={(value: SortField) => setSortBy([value, ...sortBy.filter(f => f !== value)])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="triage">Triage Level</SelectItem>
                <SelectItem value="confidence">AI Confidence</SelectItem>
                <SelectItem value="time">Check-in Time</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="age">Age</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <PatientTable patients={filteredAndSortedPatients} />
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <PatientForm onSuccess={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}