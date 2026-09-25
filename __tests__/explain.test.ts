import { describe, it, expect } from 'vitest'

describe('Code explanation API input validation', () => {
    it('should reject empty code input', async () => {
        const response = await fetch('https://codesense-chi.vercel.app/api/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: '', mode: 'beginner' }),
        })
        expect(response.status).toBe(400)
    })

    it('should reject whitespace-only code input', async () => {
        const response = await fetch('https://codesense-chi.vercel.app/api/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: '   ', mode: 'beginner' }),
        })
        expect(response.status).toBe(400)
    })
})