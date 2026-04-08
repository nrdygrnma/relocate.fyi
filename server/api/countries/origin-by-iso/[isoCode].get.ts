import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const isoCode = getRouterParam(event, 'isoCode')

  const origin = await prisma.originProfile.findFirst({
    where: { country: { isoCode: isoCode?.toUpperCase() } },
    include: { country: true }
  })

  if (!origin) {
    throw createError({ statusCode: 404, message: 'Origin profile not found' })
  }

  return origin
})
