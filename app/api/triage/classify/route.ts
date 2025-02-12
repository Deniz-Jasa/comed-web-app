import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { symptoms, visitReason, medicalHistory } = await request.json();

    // Combine all relevant information for classification
    const input = `
      Symptoms: ${symptoms.join(', ')}
      Reason for Visit: ${visitReason}
      Medical History: ${medicalHistory}
    `;

    // const response = await cohere.classify({
    //   inputs: [input],
    //   examples: [
    //     { text: "Symptoms: Chest Pain, Shortness of Breath, Sweating\nReason for Visit: Severe chest pain radiating to left arm\nMedical History: Previous heart attack", label: "level1" },
    //     { text: "Symptoms: Dizziness, Slurred Speech\nReason for Visit: Sudden onset of symptoms\nMedical History: Hypertension", label: "level1" },
    //     { text: "Symptoms: High Fever, Severe Abdominal Pain\nReason for Visit: Worsening pain and fever\nMedical History: None", label: "level2" },
    //     { text: "Symptoms: Cough, Fever\nReason for Visit: Persistent symptoms for 3 days\nMedical History: Asthma", label: "level3" },
    //     { text: "Symptoms: Sprained Ankle\nReason for Visit: Twisted ankle while walking\nMedical History: None", label: "level4" },
    //     { text: "Symptoms: Sore Throat\nReason for Visit: Mild discomfort for 2 days\nMedical History: None", label: "level5" },
    //   ],
    //   model: 'embed-english-v3.0',
    //   taskDescription: 'Classify emergency department triage levels based on patient symptoms and information.',
    //   outputIndicator: 'Triage level classification',
    // });

    // const classification = response.classifications[0];

    return NextResponse.json({});
  } catch (error) {
    console.error('Triage classification error:', error);
    return NextResponse.json(
      { error: 'Failed to classify triage level' },
      { status: 500 }
    );
  }
}