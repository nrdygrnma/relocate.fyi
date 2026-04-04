import prisma from '../../db/client'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const destination = await prisma.destinationProfile.findUnique({
    where: { slug },
    include: {
      country: true,
      pathways: {
        where: { published: true },
        include: {
          eligibilityRules: true,
          steps: { orderBy: { orderIndex: 'asc' } }
        }
      }
    }
  })

  if (destination) return { type: 'destination', data: destination }

  const origin = await prisma.originProfile.findUnique({
    where: { slug },
    include: { country: true }
  })

  if (origin) return { type: 'origin', data: origin }

  throw createError({ statusCode: 404, message: 'Country not found' })
})
