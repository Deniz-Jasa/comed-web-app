import type { Patient, Message } from '@/types';

export async function classifyTriage(patientData: Pick<Patient, 'symptoms' | 'visitReason' | 'medicalHistory'>) {
  const response = await fetch('/api/triage/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    throw new Error('Failed to classify triage level');
  }

  return response.json();
}

export const getAIResponse = async (
  message: string,
  patientData: Omit<Patient, 'name'>,
  chatHistory: Message[]
) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      patientContext: patientData,
      chatHistory, // Include the chat history
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  return response.text();
};

export async function getRelevantPapers(query: string ) {
  const response = await fetch('/api/papers/rerank', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to get relevant papers');
  }

  return response.json();
}

// Keep existing mock functions for fallback
export async function getPatients(): Promise<Patient[]> {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'John Doe',
          age: 45,
          symptoms: ['Fever', 'Cough'],
          triageLevel: 'level1',
          medicalHistory: 'Hypertension',
          timestamp: new Date().toISOString(),
        },
        // Add more mock data as needed
      ]);
    }, 1000);
  });
}

export async function updateTriageLevel(
  patientId: string,
  level: 'low' | 'medium' | 'high'
): Promise<void> {
  // Simulated API call
  return new Promise((resolve) => setTimeout(resolve, 500));
}

export async function submitPatientData(patientData: Omit<Patient, 'id' | 'timestamp'>): Promise<void> {
  // Simulated API call
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function getPatientDetails(patientId: string): Promise<Patient> {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: patientId,
        name: 'John Doe',
        age: 45,
        symptoms: ['Fever', 'Cough'],
        triageLevel: 'level1',
        medicalHistory: 'Hypertension',
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
}