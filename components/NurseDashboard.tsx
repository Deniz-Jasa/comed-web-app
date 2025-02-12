'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, Activity, AlertCircle, Brain } from 'lucide-react';
import { mockPatients } from '@/lib/data';
import { toast } from "sonner";
import type { Patient } from '@/types';

export function NurseDashboard() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [showTriageConfirm, setShowTriageConfirm] = useState(false);
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [pendingTriageLevel, setPendingTriageLevel] = useState<Patient['triageLevel'] | null>(null);
  
  const sortedPatients = [...patients].sort((a, b) => {
    const priorityOrder = { level1: 5, level2: 4, level3: 3, level4: 2, level5: 1 };
    const priorityDiff = priorityOrder[b.triageLevel] - priorityOrder[a.triageLevel];
    
    if (priorityDiff === 0) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    
    return priorityDiff;
  });

  const currentPatient = sortedPatients[currentPatientIndex];

  const handlePrevious = () => {
    if (currentPatientIndex > 0) {
      setCurrentPatientIndex(currentPatientIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPatientIndex < sortedPatients.length - 1) {
      setCurrentPatientIndex(currentPatientIndex + 1);
    }
  };

  const handleTriageChange = (level: Patient['triageLevel']) => {
    if (level !== currentPatient.triageLevel) {
      setPendingTriageLevel(level);
      setShowTriageConfirm(true);
    }
  };

  const confirmTriageChange = () => {
    if (pendingTriageLevel && currentPatient) {
      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === currentPatient.id
            ? { ...patient, triageLevel: pendingTriageLevel }
            : patient
        )
      );
      
      toast.success('Triage level updated');
      setShowTriageConfirm(false);
      setPendingTriageLevel(null);
    }
  };

  const handleAssignToPhysician = () => {
    setShowAssignConfirm(true);
  };

  const confirmAssignToPhysician = () => {
    if (currentPatient) {
      setPatients(prevPatients =>
        prevPatients.filter(patient => patient.id !== currentPatient.id)
      );

      if (currentPatientIndex >= sortedPatients.length - 1) {
        setCurrentPatientIndex(Math.max(0, currentPatientIndex - 1));
      }

      toast.success('Patient assigned to physician');
      setShowAssignConfirm(false);
    }
  };

  const getTriageBadgeVariant = (level: Patient['triageLevel']) => {
    switch (level) {
      case 'level1':
      case 'level2':
        return 'destructive';
      case 'level3':
      case 'level4':
        return 'warning';
      case 'level5':
        return 'secondary';
    }
  };

  const getTriageLabel = (level: Patient['triageLevel']) => {
    switch (level) {
      case 'level1':
        return 'Level 1 - Immediate';
      case 'level2':
        return 'Level 2 - Emergency';
      case 'level3':
        return 'Level 3 - Urgent';
      case 'level4':
        return 'Level 4 - Semi-urgent';
      case 'level5':
        return 'Level 5 - Non-urgent';
    }
  };

  const getMonitoringInstructions = (triageLevel: Patient['triageLevel'], symptoms: string[]) => {
    const instructions = [];
    
    instructions.push({
      title: "Vital Signs",
      icon: Activity,
      items: [
        "Monitor blood pressure every 15 minutes",
        "Check pulse and respiratory rate",
        "Record temperature",
        "Monitor oxygen saturation"
      ]
    });

    if (symptoms.includes('Dizziness') || symptoms.includes('Weakness in Left Arm') || symptoms.includes('Slurred Speech')) {
      instructions.push({
        title: "Neurological Assessment",
        icon: Brain,
        items: [
          "Perform FAST assessment",
          "Check pupil response",
          "Monitor consciousness level",
          "Assess grip strength",
          "Document changes every 5 minutes",
          "Maintain clear airway"
        ]
      });
    }

    return instructions;
  };

  if (sortedPatients.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-muted-foreground">No patients waiting</h3>
          <p className="text-muted-foreground mt-2">The waiting room is currently empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-7">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {sortedPatients.length} waiting
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPatientIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {currentPatientIndex + 1} / {sortedPatients.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPatientIndex === sortedPatients.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1">
        <Card className="flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-1">{currentPatient.name}</h2>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{currentPatient.age} years</span>
                    <span>•</span>
                    <span className="capitalize">{currentPatient.sex}</span>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <Badge
                    variant={getTriageBadgeVariant(currentPatient.triageLevel)}
                    className="px-3 py-1 text-sm"
                  >
                    {getTriageLabel(currentPatient.triageLevel)}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {currentPatient.aiConfidence}%
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {currentPatient.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary" className="px-2.5 py-0.5 text-sm">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Reason for Visit</h3>
                <p className="bg-muted/30 p-3 rounded-lg">
                  {currentPatient.visitReason}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Medical History</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {currentPatient.medicalHistory.split('.').filter(Boolean).map((condition, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                        <span>{condition.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ScrollArea>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="flex-1">
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                {getMonitoringInstructions(currentPatient.triageLevel, currentPatient.symptoms).map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2 text-foreground">
                      <section.icon className="h-4 w-4 text-primary" />
                      {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {currentPatient.triageLevel === 'level1' && (
                  <div className="bg-destructive/15 dark:bg-destructive/25 p-4 rounded-lg flex items-start gap-2 text-sm border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <span className="text-destructive dark:text-destructive-foreground">
                      Critical patient requiring immediate attention. Do not leave unattended.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Triage Assessment</h3>
              <div className="space-y-4">
                <Select
                  value={currentPatient.triageLevel}
                  onValueChange={handleTriageChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="level1">Level 1 - Immediate (Life Threatening)</SelectItem>
                    <SelectItem value="level2">Level 2 - Emergency (Could Become Life Threatening)</SelectItem>
                    <SelectItem value="level3">Level 3 - Urgent (Not Life Threatening)</SelectItem>
                    <SelectItem value="level4">Level 4 - Semi-urgent (Not Life Threatening)</SelectItem>
                    <SelectItem value="level5">Level 5 - Non-urgent (When Time Permits)</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="lg"
                  className="w-full py-5 text-sm"
                  onClick={handleAssignToPhysician}
                >
                  Assign to Physician
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AlertDialog open={showTriageConfirm} onOpenChange={setShowTriageConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Triage Level</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the triage level for {currentPatient.name} to{' '}
              {pendingTriageLevel ? getTriageLabel(pendingTriageLevel) : ''}? This will update their priority in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingTriageLevel(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTriageChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAssignConfirm} onOpenChange={setShowAssignConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign to Physician</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to assign {currentPatient.name} to a physician? 
              This will remove them from the waiting list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAssignToPhysician}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}