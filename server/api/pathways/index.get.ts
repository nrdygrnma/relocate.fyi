import prisma from '../../db/client'

export default defineEventHandler(async () => {
  const pathways = await prisma.pathway.findMany({
    where: { published: true },
    include: {
      eligibilityRules: true,
      destinationProfile: {
        include: { country: true }
      }
    }
  })
  return pathways
})
