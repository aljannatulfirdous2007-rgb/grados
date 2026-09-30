import Groq from 'groq-sdk'
import { NextRequest } from 'next/server'

const MAX_ATTEMPTS = 3

export async function POST(request: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { gpa, gre, greVerbal, budget, country, field, workExp } = await request.json()

  if (!gpa || !country || !field) {
    return Response.json({ error: 'GPA, country, and field are required.' }, { status: 400 })
  }

  const prompt = `You are an expert grad school admissions advisor specializing in Indian students applying abroad.

Given this student profile, return ONLY valid JSON — a list of 12 universities grouped by admission tier:

Student profile:
- GPA: ${gpa}/10 (Indian scale) or roughly ${(parseFloat(gpa) / 10 * 4).toFixed(1)}/4.0
- GRE Total: ${gre || 'Not taken'} ${greVerbal ? `(Verbal: ${greVerbal})` : ''}
- Work experience: ${workExp || '0'} years
- Annual tuition budget: USD ${budget || '30000'}
- Preferred country: ${country}
- Field: ${field}

Return exactly this JSON format (no markdown, just JSON):
{
  "universities": [
    {
      "name": "<university name>",
      "country": "<country>",
      "program": "<specific MS/MEng/MBA program name>",
      "tier": "<Safety|Target|Reach|Dream>",
      "avgTuition": <annual USD number>,
      "avgGPA": "<typical accepted GPA range>",
      "avgGRE": "<typical GRE range or 'Not required'>",
      "highlights": "<1 sentence: why this is a good fit>",
      "postStudyWork": "<post-study work permit info>"
    }
  ]
}

Include a mix of Safety (3), Target (5), Reach (3), and Dream (1) universities.
Focus on universities known to admit Indian students in the ${field} field.
Make sure tuition is within or near the stated budget.`

  // With default reasoning, gpt-oss spent the whole token budget "thinking" and never
  // answered (4/4 failures). Low effort: ~30 reasoning tokens, 4/4 valid, ~3.5s.
  // Keep max_tokens + prompt under Groq free tier's 8,000 tokens/minute.
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL ?? 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 4000,
        reasoning_effort: 'low',
      })

      const raw = completion.choices[0]?.message?.content ?? ''
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) continue

      const result = JSON.parse(jsonMatch[0])
      if (!Array.isArray(result.universities)) continue
      return Response.json(result)
    } catch (err) {
      console.error(`match-universities attempt ${attempt + 1} failed:`, err)
    }
  }

  return Response.json({ error: 'Could not find matches right now. Please try again in a moment.' }, { status: 500 })
}
