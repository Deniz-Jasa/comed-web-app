export interface Patient {
  id: string;
  name: string;
  age: number;
  sex?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  email?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  symptoms: string[];
  triageLevel: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
  medicalHistory: string;
  visitReason?: string;
  timestamp: string;
  aiConfidence?: number;
  aiDiagnosis?: string;
  relevantPapers?: {
    title: string;
    url: string;
    relevance: number;
  }[];
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatSession {
  patientId: string;
  messages: Message[];
}