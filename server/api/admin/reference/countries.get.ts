import prisma from '../../../db/client'

export default defineEventHandler(async () => {
  return prisma.countryReference.findMany({
    include: {
      currency: true,
      languagePrimary: true
    },
    orderBy: { name: 'asc' }
  })
})
