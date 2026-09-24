import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(request: NextRequest) {
    try {
        const { code, mode } = await request.json()

        if (!code || code.trim() === '') {
            return NextResponse.json(
                { error: 'No code provided' },
                { status: 400 }
            )
        }

        const prompt = mode === 'beginner'
            ? `You are a friendly coding teacher explaining to a complete beginner.

Analyse this code and provide:
1. What programming language this is (be specific)
2. What the code does in simple, plain English — no jargon
3. A line-by-line breakdown using simple analogies
4. One thing a beginner should remember about this code

Code to explain:
\`\`\`
${code}
\`\`\`

Format your response clearly with headers for each section.`
            : `You are a senior software engineer doing a technical code review.

Analyse this code and provide:
1. What programming language and version/framework this appears to be
2. What the code does technically and its purpose
3. A line-by-line technical breakdown explaining the logic, patterns, and why each part works
4. Any potential issues, edge cases, or improvements
5. Time and space complexity if applicable

Code to analyse:
\`\`\`
${code}
\`\`\`

Format your response clearly with headers for each section.`

        //List models available in free tier to fall back to duting spikes
        const candidateModels = ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
        let response = null
        let lastError: any = null

        for (const model of candidateModels) {
            try {
                response = await ai.models.generateContent({
                    model: model,
                    contents: prompt,
                })
                if (response) break
            } catch (err: any) {
                lastError = err
                // If the free tier is busy (503/429), attempt fallback to the next candidate
                if (err?.status === 503 || err?.status === 429) {
                    console.warn(`Model ${model} hit capacity limit, trying alternative...`)
                    continue
                }
                throw err
            }
        }
        if (!response) {
            throw lastError || new Error('All candidate models failed to generate response')

        }

        const explanation = response.text
        return NextResponse.json({ explanation })

    } catch (error: any) {
        console.error('Gemini API error:', error)

        const statusCode = error?.status === 503 ? 503 : 500
        const message = error?.status === 503
            ? 'The AI model is temporarily busy. Please retry in a few seconds.'
            : 'Failed to explain code. Please try again.'
        return NextResponse.json(
            { error: message },
            { status: statusCode }
        )
    }
}