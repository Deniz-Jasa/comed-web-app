import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

export const dynamic = 'force-dynamic';

const documents = [
  {
    title: "Acute Ischemic Stroke: Early Management and Prevention",
    text: "Comprehensive review of acute stroke management including diagnosis, treatment options, and prevention strategies.",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMcp1215540"
  },
  {
    title: "Time to Treatment With Intravenous Tissue Plasminogen Activator",
    text: "Analysis of tPA treatment timing in acute ischemic stroke and its impact on patient outcomes.",
    url: "https://www.ahajournals.org/doi/10.1161/STROKEAHA.116.013644"
  },
  {
    title: "Guidelines for the Early Management of Patients With Acute Ischemic Stroke",
    text: "Latest guidelines for managing acute ischemic stroke patients in the emergency setting.",
    url: "https://www.ahajournals.org/doi/10.1161/STR.0000000000000158"
  },
  {
    title: "Risk Factors for Ischemic Stroke and Transient Ischemic Attack",
    text: "Comprehensive analysis of risk factors contributing to stroke and TIA, including diabetes and hypertension.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0140673616305062"
  },
  {
    title: "Diabetes and Risk of Stroke: Epidemiology, Pathophysiology",
    text: "Review of the relationship between diabetes and stroke risk, including mechanisms and prevention strategies.",
    url: "https://care.diabetesjournals.org/content/42/4/550"
  }
];

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const response = await cohere.rerank({
      query,
      documents,
      model: 'rerank-english-v2.0',
      topN: 3,
      returnDocuments: true,
    });
    const rankedPapers = response.results.map(result => ({
      title: (result.document as any)?.title ?? '',
      url: (result.document as any)?.url ?? '',
      relevance: Math.round(result.relevanceScore * 100),
    }));

    return NextResponse.json({ papers: rankedPapers });
  } catch (error) {
    console.error('Rerank error:', error);
    return NextResponse.json(
      { error: 'Failed to rank relevant papers' },
      { status: 500 }
    );
  }
}