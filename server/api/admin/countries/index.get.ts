import prisma from '../../../db/client'

export default defineEventHandler(async () => {
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
    include: {
      destinationProfile: true,
      originProfile: true
    }
  })
  return countries
})
