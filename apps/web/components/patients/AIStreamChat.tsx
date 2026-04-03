'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Send, Loader2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIStreamChatProps {
  patientId: string
  patientName: string
}

export function AIStreamChat({ patientId, patientName }: AIStreamChatProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat/${patientId}`,
    }),
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isLoading = status === 'streaming' || status === 'submitted'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInput('')
  }

  return (
    <Card className="flex flex-col h-full min-h-125">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          AI Clinical Assistant — {patientName}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Ask questions about this patient&apos;s clinical profile
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12 space-y-2">
              <Bot className="w-10 h-10 opacity-30" />
              <p className="text-sm">Ask a question about this patient</p>
              <div className="flex flex-col gap-1 text-xs text-left mt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-left transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === 'user'
            const textContent = message.parts
              ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('')

            if (!textContent) return null

            return (
              <div
                key={message.id}
                className={cn('flex gap-2.5 items-start', isUser && 'flex-row-reverse')}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                    isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                    isUser
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  )}
                >
                  {textContent}
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive text-center py-2">
              Something went wrong. Check that the API is running and your Groq key is set.
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this patient…"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

const SUGGESTIONS = [
  'What are the main clinical concerns for this patient?',
  'What follow-up questions should I ask?',
  'Are there any medication interactions to watch for?',
]
