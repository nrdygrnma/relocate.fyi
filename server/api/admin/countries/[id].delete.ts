import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Country ID is required'
    })
  }

  // Find country first to check if it exists
  const country = await prisma.country.findUnique({
    where: { id },
    include: {
      destinationProfile: true,
      originProfile: true
    }
  })

  if (!country) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Country not found'
    })
  }

  // Delete everything related to this country
  // We'll use a transaction to ensure all or nothing
  await prisma.$transaction(async (tx) => {
    // 1. Delete pathways associated with destination profile
    if (country.destinationProfile) {
      const pathways = await tx.pathway.findMany({
        where: { destinationProfileId: country.destinationProfile.id }
      })

      for (const pathway of pathways) {
        // Delete steps and eligibility rules for each pathway
        await tx.step.deleteMany({ where: { pathwayId: pathway.id } })
        await tx.eligibilityRule.deleteMany({ where: { pathwayId: pathway.id } })
      }

      await tx.pathway.deleteMany({
        where: { destinationProfileId: country.destinationProfile.id }
      })

      // 2. Delete destination profile
      await tx.destinationProfile.delete({
        where: { id: country.destinationProfile.id }
      })
    }

    // 3. Delete origin profile
    if (country.originProfile) {
      await tx.originProfile.delete({
        where: { id: country.originProfile.id }
      })
    }

    // 4. Delete the country itself
    await tx.country.delete({
      where: { id }
    })
  })

  return { message: 'Country and associated profiles deleted successfully' }
})
