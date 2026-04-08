import prisma from '../../db/client'

export default defineEventHandler(async () => {
  const countries = await prisma.countryReference.findMany({
    select: { isoCode: true, name: true },
    orderBy: { name: 'asc' }
  })
  return countries
})
