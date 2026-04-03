import OpenAI from 'openai'
import type { AIProvider } from './provider'

const MODEL = 'gpt-4o'

export class OpenAIProvider implements AIProvider {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  async complete(prompt: string, system: string): Promise<string> {
    const res = await this.client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    })
    return res.choices[0]?.message.content ?? ''
  }

  async *stream(prompt: string, system: string): AsyncIterable<string> {
    const stream = await this.client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      stream: true,
      temperature: 0.3,
    })
    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content ?? ''
    }
  }
}
