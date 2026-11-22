import { describe, expect, it } from 'vitest'
import { readAssistantResponse } from './readAssistantResponse.js'

describe('readAssistantResponse', () => {
  it('reports a helpful endpoint message for an HTML 404 without JSON parsing errors', async () => {
    const response = new Response('<html><title>The page could not be found</title></html>', {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    })

    await expect(readAssistantResponse(response)).rejects.toThrow(/HTTP 404.*VITE_API_BASE_URL.*POST \/api\/chat/)
  })

  it('explains non-JSON server errors safely', async () => {
    const response = new Response('Service unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    })

    await expect(readAssistantResponse(response)).rejects.toThrow(/HTTP 503.*temporarily unavailable/)
  })

  it('returns valid assistant JSON', async () => {
    const response = Response.json({ answer: 'Catalogue answer', mode: 'demo' })

    await expect(readAssistantResponse(response)).resolves.toEqual({ answer: 'Catalogue answer', mode: 'demo' })
  })
})
