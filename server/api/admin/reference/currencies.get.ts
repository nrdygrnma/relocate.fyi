import prisma from '../../../db/client'

export default defineEventHandler(async () => {
  return prisma.currency.findMany({
    orderBy: { code: 'asc' }
  })
})
