import 'dotenv/config'
import express from 'express'
import { GoogleGenAI } from '@google/genai'
import schemes from './src/data/schemes.json' with { type: 'json' }
import { buildAssistantInstruction } from './src/engine/assistantPrompt.js'
import { createScholarshipDemoAnswer } from './src/engine/scholarshipDemo.js'

const app = express()
app.use(express.json({ limit: '12kb' }))

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null
const allowedLanguages = new Set(['English', 'Telugu', 'Hindi'])

function getGeminiStatus(error) {
  const directStatus = Number(error?.status ?? error?.statusCode)
  if (Number.isInteger(directStatus) && directStatus >= 400) return directStatus

  try {
    const parsed = JSON.parse(error?.message)
    const messageStatus = Number(parsed?.error?.code)
    return Number.isInteger(messageStatus) && messageStatus >= 400 ? messageStatus : null
  } catch {
    return null
  }
}

app.post('/api/chat', async (req, res) => {
  const { question, language } = req.body ?? {}
  if (typeof question !== 'string' || !question.trim() || question.length > 1000) {
    return res.status(400).json({ error: 'Enter a question of up to 1,000 characters.' })
  }
  if (!allowedLanguages.has(language)) return res.status(400).json({ error: 'Choose English, Telugu or Hindi.' })
  if (!ai) return res.status(503).json({ error: 'The assistant is not configured yet. Add GEMINI_API_KEY to the backend .env file and restart the app.' })

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question.trim(),
      config: {
        systemInstruction: buildAssistantInstruction(language, schemes),
      },
    })
    const answer = result.text?.trim()
    if (!answer) return res.status(502).json({ error: 'The assistant returned an empty response. Please try again.' })
    return res.json({ answer })
  } catch (error) {
    const status = getGeminiStatus(error)
    const transportCode = error?.cause?.code ?? error?.code
    console.error('Gemini request failed:', JSON.stringify({ status, code: transportCode }))

    if (transportCode === 'EACCES') {
      return res.json({
        answer: createScholarshipDemoAnswer(question.trim(), schemes),
        mode: 'demo',
      })
    }

    if (status === 503) {
      return res.status(503).json({ error: 'Gemini is temporarily overloaded (HTTP 503). Please try again shortly.' })
    }
    if (status === 429) {
      return res.status(429).json({ error: 'Gemini request limits were reached (HTTP 429). Please wait and try again.' })
    }
    if (status === 401 || status === 403) {
      return res.status(502).json({ error: `Gemini rejected the backend credentials (HTTP ${status}). Check the backend API key and project access.` })
    }
    if (status === 404) {
      return res.status(502).json({ error: 'Gemini could not find the configured model (HTTP 404). Check the model name and API access.' })
    }
    if (transportCode) {
      return res.status(503).json({ error: `The backend could not reach Gemini (${transportCode}). Check outbound network access and try again.` })
    }
    return res.status(502).json({ error: status ? `Gemini returned an unexpected error (HTTP ${status}). Please try again.` : 'The backend could not complete the Gemini request. Check backend logs for its safe status code and retry.' })
  }
})

const port = Number(process.env.PORT) || 3001
app.listen(port, () => console.log(`Student Hub API listening on ${port}`))
