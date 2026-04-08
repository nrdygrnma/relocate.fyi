import prisma from '../../../db/client'

export default defineEventHandler(async () => {
  return prisma.language.findMany({
    orderBy: { name: 'asc' }
  })
})
