import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const { message, patientContext, chatHistory = [] } = await request.json();

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  try {
    // Define the system prompt based on whether it's an initial assessment or a follow-up
    const systemPrompt = message.startsWith('initial_assessment')
      ? `You are a medical AI assistant designed to help physicians with patient consultations. 
         You are NOT interacting directly with the patient. Your role is to provide structured, 
         evidence-based recommendations to the doctor. Always address the doctor, not the patient.

         For initial assessments, provide concise, structured feedback using these sections:

         Key Findings
         • List only critical symptoms and vital signs
         • Maximum 3 bullet points

         Immediate Actions
         • List 3-4 most urgent steps
         • Order by priority

         Risk Factors
         • List key risk factors from history
         • Maximum 3 points

         Differential Diagnosis
         • List top 2-3 potential diagnoses
         • One-line rationale for each
         • One-line definitive assessment

         Treatment Plan
         • List immediate interventions
         • Include key medications/tests`
      : `You are a medical AI assistant designed to support physicians during patient consultations. You do not interact directly with patients. Your role is to provide concise, focused responses tailored to the doctor's needs. Since you're assisting a medical professional, you can share all relevant information without restriction.`;

    // Format the chat message for initial assessments
    const chatMessage = message.startsWith('initial_assessment')
      ? `Provide initial assessment for patient with:
         Age: ${patientContext.age}
         Sex: ${patientContext.sex}
         Symptoms: ${patientContext.symptoms.join(', ')}
         Visit Reason: ${patientContext.visitReason}
         Arrival time: ${patientContext.timestamp}
         Current time: ${new Date().toISOString()}
         Triage Level: ${patientContext.triageLevel} based on the Canadian Triage and Acuity Scale (CTAS)
         Medical History: ${patientContext.medicalHistory}`
      : message;

    // Include the system prompt and chat history in the request to Cohere
    const updatedChatHistory = [
      { role: 'CHATBOT', message: systemPrompt }, // Add the system prompt
      ...chatHistory.map((msg: { role: string; content: any; }) => ({
        role: msg.role === 'user' ? 'USER' : 'CHATBOT', // Map roles to Cohere's expected format
        message: msg.content, // Use the message content
      })),
      { role: 'USER', message: chatMessage }, // Add the latest user message
    ];

    const chatStream = await cohere.chatStream({
      message: chatMessage, // The latest user message
      model: 'command-r-08-2024',
      temperature: 0.3,
      chatHistory: updatedChatHistory, // Pass the updated chat history
      promptTruncation: 'AUTO',
    });

    (async () => {
      try {
        for await (const chat of chatStream) {
          if (chat.eventType === 'text-generation') {
            await writer.write(encoder.encode(chat.text));
          }
        }
      } catch (error) {
        console.error('Streaming error:', error);
      } finally {
        await writer.close();
      }
    })();

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get chat response' },
      { status: 500 }
    );
  }
}