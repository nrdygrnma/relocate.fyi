import prisma from '../../../db/client'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const profile = await prisma.originProfile.findUnique({
    where: { slug },
    include: { country: true }
  })

  if (!profile) {
    throw createError({ statusCode: 404, message: 'Profile not found' })
  }

  return profile
})
