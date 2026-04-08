export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { countryName, pathwayName } = body

  if (!countryName || !pathwayName) {
    throw createError({ statusCode: 400, statusMessage: 'Missing countryName or pathwayName' })
  }

  const systemPrompt = `You are an expert immigration lawyer. Return only valid JSON, no extra text.`

  const prompt = `Generate the key eligibility rules for the "${pathwayName}" visa/residency pathway in ${countryName}.

Return a JSON array of rule objects. Each rule must have EXACTLY these fields:

{
  "displayLabel": string (short human-readable label, e.g. "Minimum monthly income USD 2,500"),
  "ruleType": string (one of: "income", "savings", "age", "nationality", "education", "experience", "other"),
  "operator": string (one of: "eq", "gt", "gte", "lt", "lte", "in", "notin"),
  "valueInt": number | null (use for income, savings, age thresholds as integers),
  "valueString": string | null (use for single string values like employment type),
  "valueList": string | null (comma-separated ISO codes for nationality rules, e.g. "USA,GBR,AUS"),
  "hardRequirement": boolean (true if failing this rule makes the applicant ineligible),
  "perDependent": boolean (true if the income/savings threshold increases per dependent),
  "dependentIncrementUsd": number | null (additional USD required per dependent if perDependent is true),
  "notes": string | null (brief explanation of the rule)
}

Rules to cover (if applicable to this pathway):
- Minimum monthly or annual income in USD
- Minimum savings or net worth
- Age range (min/max if any)
- Nationality restrictions or allowances
- Clean criminal record requirement
- Health insurance requirement
- Employment status or experience requirements

Return only the JSON array: [ ... ]`

  const result = await askDeepSeekForJson<any[] | { rules: any[] }>(prompt, systemPrompt)
  const rules = Array.isArray(result) ? result : ((result as any).rules ?? [])
  return { rules }
})
