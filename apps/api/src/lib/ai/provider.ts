export interface AIProvider {
  complete(prompt: string, system: string): Promise<string>
  stream(prompt: string, system: string): AsyncIterable<string>
}

export type AIProviderName = 'groq' | 'anthropic' | 'openai' | 'ollama'

let _provider: AIProvider | null = null

export function createAIProvider(): AIProvider {
  if (_provider) return _provider

  const name = (process.env.AI_PROVIDER ?? 'groq') as AIProviderName

  switch (name) {
    case 'groq': {
      const { GroqProvider } = require('./groq')
      _provider = new GroqProvider()
      break
    }
    case 'anthropic': {
      const { AnthropicProvider } = require('./anthropic')
      _provider = new AnthropicProvider()
      break
    }
    case 'openai': {
      const { OpenAIProvider } = require('./openai')
      _provider = new OpenAIProvider()
      break
    }
    case 'ollama': {
      const { OllamaProvider } = require('./ollama')
      _provider = new OllamaProvider()
      break
    }
    default:
      throw new Error(`Unknown AI_PROVIDER: ${name}`)
  }

  console.log(`[AI] Using provider: ${name}`)
  return _provider!
}
