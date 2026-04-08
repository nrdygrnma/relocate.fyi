export default defineEventHandler(async (event) => {
  const body = await readBody<{ countryName: string; pathwayName: string }>(event)
  const { countryName, pathwayName } = body

  if (!countryName || !pathwayName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing countryName or pathwayName'
    })
  }

  const systemPrompt = `You are an expert relocation consultant. You provide detailed, step-by-step action plans for specific visa pathways.
Your task is to return a JSON array of steps.`

  const prompt = `Generate a sequence of practical steps for the "${pathwayName}" in ${countryName}.
Return a JSON array where each object has:
- title: Short, actionable title (e.g., "Obtain Police Clearance Certificate")
- description: Brief instructions for this step.
- category: One of: document_gathering, online_application, appointment, payment, travel, arrival, residence_permit, other.
- typicalDurationDays: (integer)
- validityDays: (integer, if applicable)
- originSide: (boolean, true if this must be done in the home country BEFORE leaving).
- orderIndex: (integer starting from 0)

Include 5-10 logical steps in the correct chronological order.`

  const result = await askDeepSeekForJson<any[] | { steps: any[] }>(prompt, systemPrompt)
  const steps = Array.isArray(result) ? result : (result.steps ?? [])
  return { steps }
})
