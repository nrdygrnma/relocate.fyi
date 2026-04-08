export default defineEventHandler(async (event) => {
  const { name } = getQuery(event)
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing country name'
    })
  }

  try {
    const response = await $fetch<any[]>(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(name as string)}?fullText=true`
    )
    if (!response || response.length === 0) {
      // Try fuzzy search if fullText fails
      const fuzzyResponse = await $fetch<any[]>(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(name as string)}`
      )
      if (!fuzzyResponse || fuzzyResponse.length === 0) {
        return null
      }
      return formatCountryData(fuzzyResponse[0])
    }
    return formatCountryData(response[0])
  } catch (error: any) {
    console.error('Error fetching external country data:', error.message)
    return null
  }
})

function formatCountryData(data: any) {
  // Extract currencies (take the first one)
  const currencies = data.currencies ? (Object.values(data.currencies) as any[]) : []
  const currencyCode = data.currencies ? Object.keys(data.currencies)[0] : ''
  const currencyName = currencies.length > 0 ? currencies[0].name : ''

  // Extract languages (take the first one)
  const languages = data.languages ? (Object.values(data.languages) as string[]) : []
  const languagePrimary = languages.length > 0 ? languages[0] : ''

  // Map restcountries regions to our region list
  // restcountries: Africa, Americas, Asia, Europe, Oceania, Antarctic
  // our list: Europe, Asia, Africa, Americas, Oceania, Middle East
  let region = data.region || 'Europe'
  if (region === 'Americas') {
    // Keep as Americas
  } else if (!['Europe', 'Asia', 'Africa', 'Americas', 'Oceania'].includes(region)) {
    region = 'Europe' // Default
  }

  // Handle Middle East special case (not a standard restcountries region)
  const subregion = data.subregion || ''
  if (
    subregion.toLowerCase().includes('middle east') ||
    subregion.toLowerCase().includes('western asia')
  ) {
    // Check if it's one of the typical Middle East countries
    const middleEastCountries = [
      'United Arab Emirates',
      'Saudi Arabia',
      'Qatar',
      'Kuwait',
      'Bahrain',
      'Oman',
      'Jordan',
      'Lebanon',
      'Israel',
      'Palestine',
      'Syria',
      'Iraq',
      'Iran',
      'Yemen',
      'Turkey',
      'Egypt'
    ]
    if (
      middleEastCountries.includes(data.name.common) ||
      middleEastCountries.includes(data.name.official)
    ) {
      region = 'Middle East'
    }
  }

  return {
    name: data.name.common,
    isoCode: data.cca2,
    currencyCode,
    currencyName,
    languagePrimary,
    region
  }
}
