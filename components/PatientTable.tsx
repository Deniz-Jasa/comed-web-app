'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import type { Patient } from "@/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients }: PatientTableProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const sortedPatients = [...patients].sort((a, b) => {
    const priorityOrder = { level1: 5, level2: 4, level3: 3, level4: 2, level5: 1 };
    const priorityDiff = priorityOrder[b.triageLevel] - priorityOrder[a.triageLevel];

    if (priorityDiff === 0) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }

    return priorityDiff;
  });

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Triage</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Arrival</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPatients.map((patient) => (
            <TableRow
              key={patient.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedPatient(patient)}
            >
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>
                <Badge
                  variant={getTriageBadgeVariant(patient.triageLevel)}
                  className="px-3 py-1"
                >
                  {getTriageLabel(patient.triageLevel)}
                </Badge>
              </TableCell>
              <TableCell>{patient.aiConfidence || 'N/A'}%</TableCell>
              <TableCell>
                {new Date(patient.timestamp).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-5xl h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Patient Details</DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <Tabs defaultValue="patient-info" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto p-1 gap-1">
                <TabsTrigger value="patient-info" className="py-2.5 px-3 h-auto whitespace-normal text-center">
                  Patient Info
                </TabsTrigger>
                <TabsTrigger value="emergency" className="py-2.5 px-3 h-auto whitespace-normal text-center">
                  Emergency Contact
                </TabsTrigger>
                <TabsTrigger value="medical" className="py-2.5 px-3 h-auto whitespace-normal text-center">
                  Medical History
                </TabsTrigger>
                <TabsTrigger value="symptoms" className="py-2.5 px-3 h-auto whitespace-normal text-center">
                  Symptoms
                </TabsTrigger>
                <TabsTrigger value="ai-analysis" className="py-2.5 px-3 h-auto whitespace-normal text-center">
                  AI Analysis
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(85vh-10rem)] mt-6">
                <div className="px-2">
                  <TabsContent value="patient-info" className="mt-0">
                    <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                              <dd className="text-lg mt-1">{selectedPatient.name}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Age</dt>
                              <dd className="text-lg mt-1">{selectedPatient.age} years</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Sex</dt>
                              <dd className="text-lg mt-1 capitalize">{selectedPatient.sex || 'Not specified'}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                              <dd className="text-lg mt-1">
                                {selectedPatient.address || 'Not provided'}<br />
                                {selectedPatient.city && `${selectedPatient.city}, `}
                                {selectedPatient.stateProvince || ''}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                              <dd className="text-lg mt-1">{selectedPatient.email || 'Not provided'}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="emergency" className="mt-0">
                    <div className="max-w-2xl">
                      <h3 className="text-xl font-semibold mb-6">Emergency Contact</h3>
                      <dl className="grid grid-cols-2 gap-8">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                          <dd className="text-lg mt-1">
                            {selectedPatient.emergencyContact?.name || 'Not provided'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Relationship</dt>
                          <dd className="text-lg mt-1">
                            {selectedPatient.emergencyContact?.relationship || 'Not specified'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                          <dd className="text-lg mt-1">
                            {selectedPatient.emergencyContact?.phone || 'Not provided'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </TabsContent>

                  <TabsContent value="medical" className="mt-0">
                    <div className="max-w-4xl">
                      <h3 className="text-xl font-semibold mb-6">Medical History</h3>
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <p className="text-lg whitespace-pre-wrap leading-relaxed">
                          {selectedPatient.medicalHistory || 'No medical history provided'}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="symptoms" className="mt-0">
                    <div className="space-y-12">
                      <div>
                        <h3 className="text-xl font-semibold mb-6">Current Symptoms</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.symptoms.map((symptom, index) => (
                            <Badge key={index} variant="outline" className="px-3 py-1 text-base">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-6">Reason for Visit</h3>
                        <div className="bg-muted/30 p-6 rounded-lg max-w-4xl">
                          <p className="text-lg whitespace-pre-wrap leading-relaxed">
                            {selectedPatient.visitReason || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai-analysis" className="mt-0">
                    <div className="space-y-12">
                      <div>
                        <h3 className="text-xl font-semibold mb-6">Triage Assessment</h3>
                        <div className="flex items-center gap-6 bg-muted/30 p-6 rounded-lg">
                          <Badge
                            variant={
                              selectedPatient.triageLevel === 'level1' || selectedPatient.triageLevel === 'level2'
                                ? 'destructive'
                                : selectedPatient.triageLevel === 'level3' || selectedPatient.triageLevel === 'level4'
                                  ? 'warning'
                                  : 'secondary'
                            }
                            className="text-lg py-2 px-6"
                          >
                            {selectedPatient.triageLevel === 'level1' && 'Level 1 - Immediate'}
                            {selectedPatient.triageLevel === 'level2' && 'Level 2 - Emergency'}
                            {selectedPatient.triageLevel === 'level3' && 'Level 3 - Urgent'}
                            {selectedPatient.triageLevel === 'level4' && 'Level 4 - Semi-urgent'}
                            {selectedPatient.triageLevel === 'level5' && 'Level 5 - Non-urgent'}
                          </Badge>
                          <span className="text-lg">
                            AI Confidence: <span className="font-semibold">{selectedPatient.aiConfidence || 'N/A'}%</span>
                          </span>
                        </div>
                      </div>

                      {selectedPatient.aiDiagnosis && (
                        <div>
                          <h3 className="text-xl font-semibold mb-6">AI Suggested Diagnosis</h3>
                          <div className="bg-muted/30 p-6 rounded-lg max-w-4xl">
                            <p className="text-lg whitespace-pre-wrap leading-relaxed">
                              {selectedPatient.aiDiagnosis}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedPatient.relevantPapers && selectedPatient.relevantPapers.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold mb-6">Relevant Medical Literature</h3>
                          <ul className="space-y-4">
                            {selectedPatient.relevantPapers.map((paper, index) => (
                              <li key={index} className="bg-muted/30 p-6 rounded-lg">
                                <a
                                  href={paper.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-lg text-primary hover:underline font-medium"
                                >
                                  {paper.title}
                                </a>
                                <div className="text-base text-muted-foreground mt-2">
                                  Relevance: {paper.relevance}%
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}