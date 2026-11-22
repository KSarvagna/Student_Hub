export async function readAssistantResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) {
    if (response.status === 404) {
      throw new Error('Scholarship API returned HTTP 404. Check VITE_API_BASE_URL and confirm the Render POST /api/chat route is deployed.')
    }
    if (response.status >= 500) {
      throw new Error(`Scholarship backend returned HTTP ${response.status}. It may be starting or temporarily unavailable; please retry.`)
    }
    throw new Error(`Scholarship backend returned a non-JSON response (HTTP ${response.status}). Check the backend URL and API route.`)
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(`Scholarship backend returned invalid JSON (HTTP ${response.status}). Please retry or check the Render deployment.`)
  }

  if (!response.ok) {
    throw new Error(data?.error || `Scholarship request failed (HTTP ${response.status}).`)
  }
  if (typeof data?.answer !== 'string' || !data.answer.trim()) {
    throw new Error('Scholarship backend returned no answer. Please retry.')
  }

  return data
}
