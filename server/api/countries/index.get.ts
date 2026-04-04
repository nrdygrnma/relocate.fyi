import prisma from '../../db/client'

export default defineEventHandler(async () => {
  const countries = await prisma.country.findMany({
    where: { published: true },
    orderBy: { name: 'asc' },
    include: {
      destinationProfile: { select: { slug: true } },
      originProfile: { select: { slug: true } }
    }
  })
  return countries
})
