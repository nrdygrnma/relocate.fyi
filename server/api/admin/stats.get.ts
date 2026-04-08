import prisma from '../../db/client'

export default defineEventHandler(async () => {
  const statuses = ['draft', 'ai_generated', null]

  // Count destination sections needing review (not 'reviewed')
  const destProfiles = await prisma.destinationProfile.findMany({
    select: {
      taxStatus: true,
      bankingStatus: true,
      healthcareStatus: true,
      costStatus: true,
      frictionStatus: true
    }
  })

  const originProfiles = await prisma.originProfile.findMany({
    select: {
      taxExitStatus: true,
      deregStatus: true,
      financialStatus: true,
      documentsStatus: true
    }
  })

  let sectionsNeedingReview = 0
  for (const p of destProfiles) {
    for (const val of Object.values(p)) {
      if (val !== 'reviewed') sectionsNeedingReview++
    }
  }
  for (const p of originProfiles) {
    for (const val of Object.values(p)) {
      if (val !== 'reviewed') sectionsNeedingReview++
    }
  }

  const [totalPathways, publishedPathways, totalCountries] = await Promise.all([
    prisma.pathway.count(),
    prisma.pathway.count({ where: { published: true } }),
    prisma.country.count()
  ])

  return {
    sectionsNeedingReview,
    totalPathways,
    publishedPathways,
    totalCountries
  }
})
