import type { AIProvider } from './provider'

// Ollama uses an OpenAI-compatible API — 100% offline, no API key needed
const BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
const MODEL = process.env.OLLAMA_MODEL ?? 'llama3.1'

export class OllamaProvider implements AIProvider {
  async complete(prompt: string, system: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        stream: false,
      }),
    })
    if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
    const data = (await res.json()) as { message?: { content?: string } }
    return data.message?.content ?? ''
  }

  async *stream(prompt: string, system: string): AsyncIterable<string> {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        stream: true,
      }),
    })
    if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
    const reader = res.body?.getReader()
    if (!reader) return
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n').filter(Boolean)
      for (const line of lines) {
        try {
          const data = JSON.parse(line) as { message?: { content?: string } }
          if (data.message?.content) yield data.message.content
        } catch {
          // skip malformed chunks
        }
      }
    }
  }
}
