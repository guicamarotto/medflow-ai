import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider } from './provider'

const MODEL = 'claude-sonnet-4-6'

export class AnthropicProvider implements AIProvider {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  async complete(prompt: string, system: string): Promise<string> {
    const res = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    const block = res.content[0]
    return block?.type === 'text' ? block.text : ''
  }

  async *stream(prompt: string, system: string): AsyncIterable<string> {
    const stream = this.client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text
      }
    }
  }
}
