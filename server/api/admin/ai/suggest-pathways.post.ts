export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { countryName, categories } = body

  if (!countryName) {
    throw createError({ statusCode: 400, statusMessage: 'Missing countryName' })
  }

  const categoryList =
    Array.isArray(categories) && categories.length > 0
      ? categories.join(', ')
      : 'employed/skilled worker, self-employed/freelancer, business owner, investor/golden visa, real estate purchase, digital nomad, retirement/passive income, family reunification'

  const systemPrompt = `You are an expert immigration consultant. Return only valid JSON, no extra text.`

  const prompt = `List the most relevant visa/residency pathways for foreign nationals relocating to ${countryName}, but ONLY for these categories: ${categoryList}.
Return at most one pathway per category. Do NOT include: humanitarian, asylum, refugee, religious worker, diplomat, seasonal worker, au pair, or temporary short-stay visas.

Return { "pathways": [ ... ] } where each item has ONLY these fields:

{
  "name": string (short name, e.g. "Skilled Worker Visa"),
  "officialName": string | null (official name / subclass number),
  "summary": string (1-2 sentences: who it is for and the key requirement),
  "pathwayType": string (one of: "work", "study", "investment", "family", "digital_nomad", "retirement", "other"),
  "durationYears": number | null,
  "renewable": boolean,
  "leadsToPr": boolean,
  "prTimelineYears": number | null,
  "dependentsAllowed": boolean,
  "workAllowed": string (one of: "yes", "no", "limited"),
  "processingWeeksMin": number | null,
  "processingWeeksMax": number | null,
  "inPersonRequired": boolean,
  "governmentFeeUsd": number | null,
  "sourceUrl": string | null
}`

  const result = await askDeepSeekForJson<{ pathways: Record<string, unknown>[] }>(
    prompt,
    systemPrompt,
    4096
  )

  if (!result?.pathways || !Array.isArray(result.pathways)) {
    throw createError({ statusCode: 500, statusMessage: 'AI returned unexpected format' })
  }

  return result
})
