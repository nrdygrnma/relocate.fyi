import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Country ID is required'
    })
  }

  const { name, isoCode, region, currencyCode, languagePrimary, published } = body

  const data: any = {}
  if (name !== undefined) data.name = name
  if (isoCode !== undefined) data.isoCode = isoCode
  if (region !== undefined) data.region = region.toLowerCase()
  if (currencyCode !== undefined) data.currencyCode = currencyCode
  if (languagePrimary !== undefined) data.languagePrimary = languagePrimary
  if (published !== undefined) data.published = published

  const country = await prisma.country.update({
    where: { id },
    data
  })

  return country
})
