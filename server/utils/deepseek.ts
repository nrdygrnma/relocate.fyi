const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'

// deepseek-chat  = DeepSeek-V3 (fast, default)
// deepseek-reasoner = DeepSeek-R1 (slower, better reasoning)
const DEFAULT_MODEL = 'deepseek-chat'

function getApiKey(): string {
  const config = useRuntimeConfig()
  const key = config.deepseekApiKey
  if (!key) {
    throw createError({ statusCode: 500, statusMessage: 'DeepSeek API key not configured' })
  }
  return key
}

export async function askDeepSeek(
  prompt: string,
  systemPrompt?: string,
  maxTokens = 4096,
  model = DEFAULT_MODEL
): Promise<string> {
  const apiKey = getApiKey()

  const response = await $fetch<{
    choices: { message: { content: string } }[]
  }>(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: {
      model,
      max_tokens: maxTokens,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ]
    }
  }).catch((e) => {
    console.error('DeepSeek API error:', e)
    throw createError({
      statusCode: e?.response?.status ?? 500,
      statusMessage: e?.data?.error?.message ?? 'Error communicating with DeepSeek'
    })
  })

  return response.choices?.[0]?.message?.content ?? ''
}

export async function askDeepSeekForJson<T>(
  prompt: string,
  systemPrompt?: string,
  maxTokens = 4096,
  model = DEFAULT_MODEL
): Promise<T> {
  const finalSystemPrompt =
    `${systemPrompt ?? ''}\nIMPORTANT: Respond ONLY with valid JSON. Do not include any preamble, markdown, or extra text.`.trim()
  const responseText = await askDeepSeek(prompt, finalSystemPrompt, maxTokens, model)

  // 1. Raw parse
  try {
    return JSON.parse(responseText) as T
  } catch {}

  // 2. Strip markdown code block
  const codeBlockMatch =
    responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/)
  if (codeBlockMatch?.[1]) {
    try {
      return JSON.parse(codeBlockMatch[1]) as T
    } catch {}
  }

  // 3. Extract outermost { } or [ ]
  const objectMatch = responseText.match(/({[\s\S]*})/)
  const arrayMatch = responseText.match(/(\[[\s\S]*])/)
  const extracted = objectMatch?.[1] ?? arrayMatch?.[1]
  if (extracted) {
    try {
      return JSON.parse(extracted) as T
    } catch {}
  }

  console.error('Failed to parse DeepSeek response as JSON:', responseText)
  throw createError({ statusCode: 500, statusMessage: 'Failed to parse AI response' })
}
