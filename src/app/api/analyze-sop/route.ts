import Groq from 'groq-sdk'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { sop } = await request.json()

  if (!sop || typeof sop !== 'string' || sop.trim().length < 50) {
    return Response.json({ error: 'Please paste at least 50 characters of your SOP.' }, { status: 400 })
  }

  const prompt = `You are an expert grad school admissions counselor who has reviewed 10,000+ SOPs for top US/UK/Canada/European universities.

Analyze this Statement of Purpose and return ONLY valid JSON (no markdown, no explanation, just the JSON object):

{
  "structure": <number 0-10>,
  "clarity": <number 0-10>,
  "voice": <number 0-10>,
  "aiDetection": <number 0-100 — estimated % of AI-generated content>,
  "overallScore": <number 0-10>,
  "strengths": [<2-3 short strings>],
  "improvements": [<3-4 specific actionable strings>],
  "flaggedPassages": [<0-3 short exact quotes from the text that sound AI-generated or generic>],
  "rewriteSuggestion": "<one rewritten version of the weakest sentence in the SOP, made more authentic>"
}

SOP to analyze:
${sop.slice(0, 3000)}`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 800,
  })

  const raw = completion.choices[0]?.message?.content ?? ''

  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return Response.json({ error: 'Could not parse AI response. Please try again.' }, { status: 500 })
  }

  const result = JSON.parse(jsonMatch[0])
  return Response.json(result)
}
