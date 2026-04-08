export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { countryName, type } = body

  if (!countryName || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing countryName or type'
    })
  }

  const systemPrompt = `You are an expert relocation consultant specializing in helping professionals move internationally.
Your task is to provide highly accurate, structured data for a relocation platform.
You must return a single flat JSON object — no nested objects, no arrays.
All string list values (e.g. countries, banks) must be comma-separated strings.
Only include the fields listed. Do not add extra keys.`

  let prompt = ''

  if (type === 'destination') {
    prompt = `Generate a destination profile for ${countryName}.
Return a single flat JSON object with EXACTLY these keys and types:

{
  "summary": string (2-3 sentence overview for prospective relocators),
  "taxBasis": string (one of: "Territorial", "Worldwide", "Remittance-based"),
  "taxRemittanceDetail": string | null (explain remittance rules, or null if not applicable),
  "incomeTaxRateMin": number (integer, lowest marginal rate as percentage),
  "incomeTaxRateMax": number (integer, highest marginal rate as percentage),
  "capitalGainsTax": boolean,
  "capitalGainsDetail": string | null,
  "wealthTax": boolean,
  "dtaCountries": string | null (comma-separated list of key DTA partner countries, e.g. "United States, United Kingdom, Germany"),
  "taxNotes": string | null (important tax notes for expats),
  "neobankAccepted": string (one of: "High", "Moderate", "Low", "Unknown"),
  "neobankDetail": string | null (which neobanks work well, e.g. Revolut, Wise),
  "accountBeforeArrival": boolean (can you open an account before arriving?),
  "permitRequiredForBanking": boolean (is a residence permit required to open a bank account?),
  "minDepositRequired": boolean,
  "minDepositAmountUsd": number | null (integer, minimum deposit in USD if required),
  "recommendedBanks": string | null (comma-separated list of 2-3 local banks),
  "bankingNotes": string | null,
  "publicHealthcareAccess": string | null (one of: "Full", "Limited", "None" — use "Full" if residents/permanent residents get full access, "Limited" if only partial/emergency access, "None" if no public coverage for immigrants),
  "publicHealthcareDetail": string | null (quality and coverage summary),
  "privateInsuranceRequired": boolean,
  "avgPrivateInsuranceUsdPa": number | null (integer, estimated annual cost in USD),
  "healthcareQualityNotes": string | null,
  "costTier": string (one of: "Low", "Moderate", "High", "Very High" — relative to Western European cost of living),
  "monthlyBudgetSingleUsd": number (integer, estimated monthly budget for a single person in USD),
  "monthlyBudgetCoupleUsd": number (integer, estimated monthly budget for a couple in USD),
  "rent1bedCityUsd": number (integer, typical 1-bed rent in city centre in USD/month),
  "rent1bedOutsideUsd": number (integer, typical 1-bed rent outside city centre in USD/month),
  "costNotes": string | null,
  "policeClearanceRequired": boolean,
  "apostilleRequired": boolean,
  "translationRequired": boolean,
  "inPersonRequired": boolean,
  "inPersonDetail": string | null (which steps require physical presence?),
  "frictionNotes": string | null (other bureaucratic hurdles)
}`
  } else {
    prompt = `Generate an origin profile for ${countryName} — focusing on how to leave the country and exit tax residency.
Return a single flat JSON object with EXACTLY these keys and types:

{
  "summary": string (2-3 sentence overview of the exit process for this country),
  "taxResidencyRule": string | null (how is tax residency determined when leaving?),
  "exitTaxExists": boolean,
  "exitTaxDetail": string | null (explain any exit taxes or deemed disposal rules),
  "daysToBreakResidency": number | null (integer, typical days abroad needed to break residency),
  "zweitwohnsitzRule": boolean (does keeping a secondary home maintain tax liability?),
  "zweitwohnsitzDetail": string | null,
  "unlimitedLiabilityTriggers": string | null (what triggers full tax liability after leaving?),
  "taxExitNotes": string | null (general advice for tax deregistration),
  "deregisterResidence": string | null (how to deregister from the local municipality),
  "deregisterBusiness": string | null (process for closing a sole proprietorship or company),
  "timingRecommendation": string | null (when should deregistration steps be taken?),
  "bankAccountPostExit": string | null (can you keep local accounts as a non-resident?),
  "bankAccountDetail": string | null (recommended actions for banking after exit),
  "pensionPortability": string | null (can you take state/private pension abroad?),
  "abfertigungRules": string | null (severance or mandatory exit payments),
  "socialInsuranceDetail": string | null (how to stop social insurance contributions),
  "policeClearanceIssuer": string | null (which authority issues the criminal record certificate?),
  "policeClearanceWeeks": number | null (integer, how long does it take to obtain?),
  "policeClearanceValidityMonths": number | null (integer, how long is it valid?),
  "otherExitDocuments": string | null (other required certificates or documents)
}`
  }

  const result = await askDeepSeekForJson<Record<string, unknown>>(prompt, systemPrompt)
  return result
})
