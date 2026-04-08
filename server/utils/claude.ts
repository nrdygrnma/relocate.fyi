import Anthropic from '@anthropic-ai/sdk'

let anthropic: Anthropic | null = null

export function getClaudeClient() {
  if (anthropic) return anthropic

  const config = useRuntimeConfig()
  const apiKey = config.anthropicApiKey

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY is not set in runtime config')
    return null
  }

  anthropic = new Anthropic({
    apiKey
  })

  return anthropic
}

export async function askClaude(prompt: string, systemPrompt?: string, maxTokens = 4096) {
  const client = getClaudeClient()
  if (!client) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Claude API key not configured'
    })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system:
        systemPrompt ||
        'You are an expert relocation consultant helping people plan international moves.',
      messages: [{ role: 'user', content: prompt }]
    })

    // Extract text content
    const textContent = message.content.find((c) => c.type === 'text')
    return textContent?.type === 'text' ? textContent.text : ''
  } catch (error: unknown) {
    console.error('Error calling Claude API:', error)
    const status = (error as { status?: number })?.status || 500
    const message = (error as { message?: string })?.message || 'Error communicating with Claude'
    throw createError({
      statusCode: status,
      statusMessage: message
    })
  }
}

export async function askClaudeForJson<T>(
  prompt: string,
  systemPrompt?: string,
  maxTokens = 4096
): Promise<T> {
  const finalSystemPrompt = `${
    systemPrompt || ''
  }\nIMPORTANT: Respond ONLY with valid JSON. Do not include any preamble or extra text.`
  const responseText = await askClaude(prompt, finalSystemPrompt, maxTokens)

  try {
    // 1. Try raw response first
    return JSON.parse(responseText) as T
  } catch {
    // 2. Try extracting from markdown code block
    const codeBlockMatch =
      responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/```\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch?.[1]) {
      try {
        return JSON.parse(codeBlockMatch[1]) as T
      } catch {
        // fall through
      }
    }

    // 3. Try extracting outermost JSON object or array
    const objectMatch = responseText.match(/({[\s\S]*})/)
    const arrayMatch = responseText.match(/(\[[\s\S]*])/)
    const extracted = objectMatch?.[1] ?? arrayMatch?.[1]
    if (extracted) {
      try {
        return JSON.parse(extracted) as T
      } catch {
        // fall through
      }
    }

    console.error('Failed to parse Claude response as JSON:', responseText)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to parse AI response'
    })
  }
}
