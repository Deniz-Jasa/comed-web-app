import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getAIResponse, getRelevantPapers } from '@/lib/api';
import { mockPatients } from '@/lib/data';
import type { Patient, Message } from '@/types';
import { toast } from "sonner";
import { SendIcon, CheckCircle2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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

export function PhysicianDashboard() {
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [patients, setPatients] = useState(mockPatients);
  const [relevantPapers, setRelevantPapers] = useState<Array<{
    title: string;
    url: string;
    relevance: number;
  }>>([]);
  const [loadingPapers, setLoadingPapers] = useState(false);

  const sortedPatients = [...patients].sort((a, b) => {
    const priorityOrder = { level1: 5, level2: 4, level3: 3, level4: 2, level5: 1 };
    const priorityDiff = priorityOrder[b.triageLevel] - priorityOrder[a.triageLevel];
    
    if (priorityDiff === 0) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    
    return priorityDiff;
  });

  const currentPatient = sortedPatients[currentPatientIndex];

  useEffect(() => {
    const getInitialAssessment = async () => {
      if (!currentPatient) return;
  
      setSending(true);
      try {
        // Create a new object with all patient data except the name
        const patientData = {
          ...currentPatient,
          name: undefined, // Explicitly exclude the name
        };
        delete patientData.name; // Remove the name field
  
        // Pass the chat history (messages) to the AI
        const response = await getAIResponse('initial_assessment', patientData, messages);
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };
  
        // Add the AI's response to the chat history
        setMessages([aiMessage]);
      } catch (error) {
        toast.error('Failed to get initial assessment');
      } finally {
        setSending(false);
      }
    };
  
    setMessages([]);
    getInitialAssessment();
  }, [currentPatient]);

  useEffect(() => {
    const fetchRelevantPapers = async () => {
      if (!currentPatient) return;

      setLoadingPapers(true);
      try {
        // Create a query based on patient's symptoms and condition
        const query = `
          Medical research papers about patient with symptoms: ${currentPatient.symptoms.join(', ')}.
          Medical history: ${currentPatient.medicalHistory}.
          Current condition: ${currentPatient.visitReason}
        `;

        const response = await getRelevantPapers(query);
        setRelevantPapers(response.papers);
      } catch (error) {
        console.error('Failed to fetch relevant papers:', error);
        toast.error('Failed to fetch relevant research papers');
      } finally {
        setLoadingPapers(false);
      }
    };

    fetchRelevantPapers();
  }, [currentPatient]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      role: 'user',
      timestamp: new Date().toISOString(),
    };
  
    // Add the user's message to the chat history
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setSending(true);
  
    try {
      // Create a new object with all patient data except the name
      const patientData = {
        ...currentPatient,
        name: undefined, // Explicitly exclude the name
      };
      delete patientData.name; // Remove the name field
  
      // Pass the chat history (messages) to the AI
      const response = await getAIResponse(newMessage, patientData, messages);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
  
      // Add the AI's response to the chat history
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setSending(false);
    }
  };

  const handleCompleteVisit = () => {
    if (!notes.trim()) {
      toast.error('Please add visit notes before completing');
      return;
    }
    setShowCompleteConfirm(true);
  };

  const confirmCompleteVisit = () => {
    // Remove current patient from the list
    const updatedPatients = sortedPatients.filter(
      patient => patient.id !== currentPatient.id
    );
    
    // Move to next patient or previous if at the end
    if (currentPatientIndex >= updatedPatients.length) {
      setCurrentPatientIndex(Math.max(0, currentPatientIndex - 1));
    }
    
    // Update patients list
    setPatients(updatedPatients);
    setNotes('');
    setShowCompleteConfirm(false);
    toast.success('Visit completed successfully');
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

  const formatAIResponse = (content: string) => {
    return (
      <div className="space-y-4 mt-2 text-sm"> {/* Base font size for the entire response */}
        {content.split('\n\n').map((section, index) => {
          if (!section.trim()) return null;
  
          const [title, ...points] = section.split('\n');
          const heading = title.trim();
  
          return (
            <div key={index} className="space-y-2">
              {/* Heading */}
              <h4 className="text-sm">{heading}</h4> {/* Small font size for headings */}
  
              {/* Content */}
              {heading === 'Primary Diagnosis' ? (
                <p className="bg-primary/10 p-3 rounded-lg text-primary text-sm">
                  {points[0]?.trim()}
                </p>
              ) : (
                <ul className="space-y-2">
                  {points.map((point, i) => {
                    const cleanPoint = point.replace(/^[•-]\s*/, '').trim();
                    if (!cleanPoint) return null;
  
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span className="text-sm">{cleanPoint}</span> {/* Small font size for list items */}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderRelevantPapers = () => (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-3">
        {loadingPapers ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Finding relevant papers...
            </div>
          </div>
        ) : relevantPapers.length > 0 ? (
          relevantPapers.map((paper, index) => (
            <div key={index} className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                <div>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    {paper.title}
                  </a>
                  <div className="text-xs text-muted-foreground mt-1">
                    Relevance: {paper.relevance}%
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No relevant papers found
          </div>
        )}
      </div>
    </ScrollArea>
  );

  if (sortedPatients.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-muted-foreground">No patients waiting</h3>
          <p className="text-muted-foreground mt-2">The waiting room is currently empty</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex-none space-y-6">
          <div className="flex justify-between items-center">
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

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{currentPatient.name}</h2>
              <div className="flex items-center gap-3 text-muted-foreground mt-1">
                <span>{currentPatient.age} years</span>
                <span>•</span>
                <span className="capitalize">{currentPatient.sex}</span>
              </div>
            </div>
            <Badge
              variant={getTriageBadgeVariant(currentPatient.triageLevel)}
              className="px-6 py-3 rounded-md text-sm"
            >
              {getTriageLabel(currentPatient.triageLevel)}
            </Badge>
          </div>
        </div>

        <Card className="flex-1 mt-6 overflow-hidden">
          <Tabs defaultValue="ai-assistant" className="h-full flex flex-col">
            <TabsList className="flex-none grid w-full grid-cols-3 h-auto p-1.5 rounded-b-none gap-1 bg-muted">
              <TabsTrigger 
                value="patient-info" 
                className="py-2.5 px-3 h-auto whitespace-normal text-center data-[state=active]:bg-background"
              >
                1. Patient Info
              </TabsTrigger>
              <TabsTrigger 
                value="ai-assistant" 
                className="py-2.5 px-3 h-auto whitespace-normal text-center data-[state=active]:bg-background"
              >
                2. AI Assistant
              </TabsTrigger>
              <TabsTrigger 
                value="consultation" 
                className="py-2.5 px-3 h-auto whitespace-normal text-center data-[state=active]:bg-background"
              >
                3. Consultation
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="patient-info" className="h-full m-0 border-none">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-6">
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
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                              <span>{condition.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="ai-assistant" className="h-full m-0 border-none">
                <div className="h-full flex">
                  <div className="flex-1 flex flex-col min-h-0 border-r">
                    <div className="flex-1 overflow-hidden">
                      <ScrollArea className="h-full p-6">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`
                                  max-w-[80%] p-4 rounded-lg
                                  ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'}
                                `}
                              >
                                {message.role === 'assistant' 
                                  ? formatAIResponse(message.content)
                                  : <span className="text-sm">{message.content}</span>
                                }
                              </div>
                            </div>
                          ))}
                          {sending && (
                            <div className="flex justify-start">
                              <div className="bg-muted max-w-[80%] p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                  </span>
                                  Thinking...
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="flex-none p-6 border-t bg-background">
                      <form onSubmit={handleSendMessage}>
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Ask comed about the patient..."
                            disabled={sending}
                            className="h-9"
                          />
                          <Button 
                            type="submit" 
                            disabled={sending || !newMessage.trim()}
                            size="icon"
                            className="h-9 w-9 shrink-0"
                          >
                            <SendIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="w-80 flex flex-col min-h-0">
                    <div className="flex-none p-4 border-b">
                      <h3 className="font-medium">Relevant Research</h3>
                    </div>
                    {renderRelevantPapers()}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="consultation" className="h-full m-0 border-none">
                <div className="h-full p-6 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Visit Notes</h3>
                    <Textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your consultation notes here..."
                      className="h-[calc(100%-4rem)] resize-none text-sm"
                    />
                  </div>

                  <Button 
                    className="w-full py-5 text-sm mt-6"
                    onClick={handleCompleteVisit}
                  >
                    Complete Visit
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>

      <AlertDialog open={showCompleteConfirm} onOpenChange={setShowCompleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Visit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to complete the visit for {currentPatient.name}?
              This will remove them from your patient list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompleteVisit}>
              Complete Visit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}